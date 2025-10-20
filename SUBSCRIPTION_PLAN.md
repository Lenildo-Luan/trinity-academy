# Plano de Implementação - Sistema de Assinatura

## Visão Geral

Implementação de sistema de pagamento por assinatura usando Stripe, com período de teste gratuito de 7 dias sem necessidade de cartão.

## Requisitos

- ✅ 7 dias de acesso gratuito sem adicionar cartão
- ✅ Modal informativo no primeiro acesso com data de término do período gratuito
- ✅ Bloqueio de acesso após período de teste com redirecionamento para página de pagamento
- ✅ Integração com Stripe para gerenciamento de pagamentos
- ✅ Assinatura única: R$ 19,99/mês

## Arquitetura

### 1. Banco de Dados (Supabase)

#### Nova Tabela: `subscriptions`

```sql
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null check (status in ('trialing', 'active', 'canceled', 'past_due', 'expired')),
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  constraint unique_user_subscription unique (user_id)
);

-- RLS Policies
alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');

-- Index
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);
create index idx_subscriptions_stripe_subscription on public.subscriptions(stripe_subscription_id);
```

#### Função: `initialize_trial`

```sql
create or replace function public.initialize_trial()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, status, trial_start, trial_end)
  values (
    new.id,
    'trialing',
    now(),
    now() + interval '7 days'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para criar período de teste automaticamente
drop trigger if exists on_auth_user_trial_init on auth.users;

create trigger on_auth_user_trial_init
  after insert on auth.users
  for each row execute function public.initialize_trial();
```

#### View: `user_access_status`

```sql
create or replace view public.user_access_status as
select
  s.user_id,
  s.status,
  s.trial_end,
  s.current_period_end,
  case
    when s.status = 'trialing' and s.trial_end > now() then true
    when s.status = 'active' and s.current_period_end > now() then true
    else false
  end as has_access,
  case
    when s.status = 'trialing' then s.trial_end
    when s.status = 'active' then s.current_period_end
    else null
  end as access_ends_at
from public.subscriptions s;
```

### 2. Configuração do Stripe

#### Produtos e Preços

1. Criar produto no Stripe Dashboard:
   - Nome: "Introdução à Programação - Assinatura Mensal"
   - Descrição: "Acesso completo à plataforma de ensino"

2. Criar preço recorrente:
   - Valor: R$ 19,99
   - Moeda: BRL
   - Intervalo: Mensal
   - Salvar o `price_id` gerado (ex: `price_xxxxx`)

#### Variáveis de Ambiente

Adicionar ao `.env.local`:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID=price_xxxxx

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Instalação de Dependências

```bash
npm install stripe @stripe/stripe-js
```

### 4. Estrutura de Arquivos

```
src/
├── lib/
│   ├── stripe.ts                 # Cliente Stripe (server-side)
│   ├── stripe-client.ts          # Cliente Stripe (client-side)
│   └── subscription-service.ts   # Funções de gerenciamento de assinatura
├── hooks/
│   ├── use-subscription.ts       # Hook para acessar status de assinatura
│   └── use-trial-modal.ts        # Hook para controlar modal de trial
├── components/
│   ├── trial-welcome-modal.tsx   # Modal de boas-vindas com info do trial
│   ├── subscription-guard.tsx    # Componente de proteção de conteúdo
│   └── subscription-status.tsx   # Badge de status da assinatura
├── app/
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── create-checkout-session/
│   │   │   │   └── route.ts      # Criar sessão de checkout
│   │   │   ├── create-portal-session/
│   │   │   │   └── route.ts      # Criar sessão do portal do cliente
│   │   │   └── webhooks/
│   │   │       └── route.ts      # Processar webhooks do Stripe
│   ├── (auth)/
│   │   └── subscribe/
│   │       └── page.tsx          # Página de assinatura/checkout
│   │   └── subscription-expired/
│   │       └── page.tsx          # Página de trial/assinatura expirada
│   └── middleware.ts             # Middleware de proteção de rotas
└── types/
    └── subscription.ts           # Types para assinatura
```

### 5. Implementação

#### 5.1. Types (`src/types/subscription.ts`)

```typescript
export type SubscriptionStatus = 'trialing' | 'active' | 'canceled' | 'past_due' | 'expired'

export type Subscription = {
  id: string
  user_id: string
  status: SubscriptionStatus
  trial_start: string | null
  trial_end: string | null
  current_period_start: string | null
  current_period_end: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export type UserAccessStatus = {
  user_id: string
  status: SubscriptionStatus
  trial_end: string | null
  current_period_end: string | null
  has_access: boolean
  access_ends_at: string | null
}
```

#### 5.2. Stripe Client Server-Side (`src/lib/stripe.ts`)

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})
```

#### 5.3. Stripe Client Client-Side (`src/lib/stripe-client.ts`)

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}
```

#### 5.4. Subscription Service (`src/lib/subscription-service.ts`)

```typescript
import { createClient } from '@/lib/supabase/server'
import type { UserAccessStatus } from '@/types/subscription'

export async function getUserAccessStatus(userId: string): Promise<UserAccessStatus | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_access_status')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data
}

export async function hasAccess(userId: string): Promise<boolean> {
  const status = await getUserAccessStatus(userId)
  return status?.has_access ?? false
}

export async function getSubscription(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  return data
}

export async function updateSubscription(
  userId: string,
  updates: Partial<Subscription>
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

#### 5.5. Hook de Assinatura (`src/hooks/use-subscription.ts`)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserAccessStatus } from '@/types/subscription'

export function useSubscription() {
  const [status, setStatus] = useState<UserAccessStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function loadSubscription() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('user_access_status')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setStatus(data)
      setLoading(false)
    }

    loadSubscription()

    // Subscription para mudanças em tempo real
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
        },
        () => {
          loadSubscription()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { status, loading, hasAccess: status?.has_access ?? false }
}
```

#### 5.6. Hook Modal de Trial (`src/hooks/use-trial-modal.ts`)

```typescript
'use client'

import { useEffect, useState } from 'react'

const TRIAL_MODAL_SEEN_KEY = 'trial_modal_seen'

export function useTrialModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const hasSeenModal = localStorage.getItem(TRIAL_MODAL_SEEN_KEY)
    if (!hasSeenModal) {
      setShowModal(true)
    }
  }, [])

  const closeModal = () => {
    localStorage.setItem(TRIAL_MODAL_SEEN_KEY, 'true')
    setShowModal(false)
  }

  return { showModal, closeModal }
}
```

#### 5.7. Trial Welcome Modal (`src/components/trial-welcome-modal.tsx`)

```typescript
'use client'

import { Dialog } from '@headlessui/react'
import { format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type TrialWelcomeModalProps = {
  isOpen: boolean
  onClose: () => void
  trialEndDate: Date
}

export function TrialWelcomeModal({ isOpen, onClose, trialEndDate }: TrialWelcomeModalProps) {
  const formattedDate = format(trialEndDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
          <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bem-vindo à Plataforma! 🎉
          </Dialog.Title>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Seu período de <strong>teste gratuito de 7 dias</strong> foi iniciado com sucesso!
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Acesso gratuito até:
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                {formattedDate}
              </p>
            </div>

            <p className="text-sm">
              Durante este período, você terá acesso completo a todos os recursos da plataforma.
              Após o término do período gratuito, será necessário assinar o plano mensal de{' '}
              <strong>R$ 19,99</strong> para continuar aprendendo.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Começar a Aprender
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
```

#### 5.8. Subscription Guard (`src/components/subscription-guard.tsx`)

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/hooks/use-subscription'
import { useTrialModal } from '@/hooks/use-trial-modal'
import { TrialWelcomeModal } from './trial-welcome-modal'

type SubscriptionGuardProps = {
  children: React.ReactNode
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const router = useRouter()
  const { status, loading, hasAccess } = useSubscription()
  const { showModal, closeModal } = useTrialModal()

  useEffect(() => {
    if (!loading && !hasAccess) {
      router.push('/subscription-expired')
    }
  }, [loading, hasAccess, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  const trialEndDate = status?.trial_end ? new Date(status.trial_end) : new Date()

  return (
    <>
      {status?.status === 'trialing' && (
        <TrialWelcomeModal
          isOpen={showModal}
          onClose={closeModal}
          trialEndDate={trialEndDate}
        />
      )}
      {children}
    </>
  )
}
```

#### 5.9. API - Create Checkout Session (`src/app/api/stripe/create-checkout-session/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Buscar ou criar customer no Stripe
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      await supabase
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id)
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?canceled=true`,
      metadata: {
        user_id: user.id,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Erro ao criar sessão de checkout' },
      { status: 500 }
    )
  }
}
```

#### 5.10. API - Create Portal Session (`src/app/api/stripe/create-portal-session/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Cliente Stripe não encontrado' },
        { status: 404 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Erro ao criar sessão do portal' },
      { status: 500 }
    )
  }
}
```

#### 5.11. API - Webhooks (`src/app/api/stripe/webhooks/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id

  if (!userId) return

  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: subscription.status === 'active' ? 'active' : subscription.status,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0].price.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id

  if (!userId) return

  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (data?.user_id) {
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', data.user_id)
  }
}
```

#### 5.12. Página de Assinatura (`src/app/(auth)/subscribe/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStripe } from '@/lib/stripe-client'
import { useSubscription } from '@/hooks/use-subscription'

export default function SubscribePage() {
  const [loading, setLoading] = useState(false)
  const { status } = useSubscription()
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
      })

      const { sessionId } = await response.json()
      const stripe = await getStripe()

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handlePortal = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      alert('Erro ao abrir portal. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Assinatura Premium
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Continue sua jornada de aprendizado
        </p>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              R$ 19,99
            </span>
            <span className="text-gray-600 dark:text-gray-400">/mês</span>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Acesso ilimitado a todos os módulos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Vídeo-aulas e materiais exclusivos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Quizzes e acompanhamento de progresso
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Cancele a qualquer momento
              </span>
            </li>
          </ul>
        </div>

        {status?.status === 'active' ? (
          <button
            onClick={handlePortal}
            disabled={loading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Gerenciar Assinatura'}
          </button>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Assinar Agora'}
          </button>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          Pagamento seguro processado pelo Stripe
        </p>
      </div>
    </div>
  )
}
```

#### 5.13. Página de Assinatura Expirada (`src/app/(auth)/subscription-expired/page.tsx`)

```typescript
import Link from 'next/link'

export default function SubscriptionExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Período de Teste Expirado
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Seu período de teste gratuito de 7 dias chegou ao fim.
            Para continuar aprendendo, assine nosso plano mensal.
          </p>

          <Link
            href="/subscribe"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Ver Planos de Assinatura
          </Link>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Apenas R$ 19,99/mês • Cancele quando quiser
          </p>
        </div>
      </div>
    </div>
  )
}
```

#### 5.14. Middleware (`src/middleware.ts`)

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'

// Rotas públicas que não precisam de assinatura ativa
const PUBLIC_ROUTES = ['/login', '/otp', '/subscribe', '/subscription-expired']

// Rotas de API que não precisam de verificação
const API_ROUTES = ['/api/stripe/webhooks']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Não verificar rotas de API específicas
  if (API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Atualizar sessão Supabase
  const response = await updateSession(request)

  // Não verificar assinatura em rotas públicas
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return response
  }

  // Verificar se usuário está autenticado
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar status de assinatura
  const { data: accessStatus } = await supabase
    .from('user_access_status')
    .select('has_access')
    .eq('user_id', user.id)
    .single()

  if (!accessStatus?.has_access) {
    return NextResponse.redirect(new URL('/subscription-expired', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 6. Configuração do Webhook no Stripe

1. Acessar Stripe Dashboard → Developers → Webhooks
2. Adicionar endpoint: `https://seu-dominio.com/api/stripe/webhooks`
3. Selecionar eventos:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copiar signing secret e adicionar ao `.env.local` como `STRIPE_WEBHOOK_SECRET`

Para desenvolvimento local:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

### 7. Atualização dos Layouts Existentes

Adicionar `<SubscriptionGuard>` aos layouts principais:

**`src/app/(sidebar)/layout.tsx`:**
```typescript
import { SubscriptionGuard } from '@/components/subscription-guard'

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubscriptionGuard>
      <SidebarLayoutContent>
        {children}
      </SidebarLayoutContent>
    </SubscriptionGuard>
  )
}
```

### 8. Indicador de Status de Assinatura (Opcional)

Adicionar ao navbar para mostrar status do trial/assinatura:

**`src/components/subscription-status.tsx`:**
```typescript
'use client'

import { useSubscription } from '@/hooks/use-subscription'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function SubscriptionStatus() {
  const { status } = useSubscription()

  if (!status) return null

  if (status.status === 'trialing' && status.trial_end) {
    const daysRemaining = formatDistanceToNow(new Date(status.trial_end), {
      locale: ptBR,
      addSuffix: true,
    })

    return (
      <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300">
        Trial expira {daysRemaining}
      </div>
    )
  }

  if (status.status === 'active') {
    return (
      <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/20 rounded-full text-xs font-medium text-green-700 dark:text-green-300">
        Assinatura Ativa
      </div>
    )
  }

  return null
}
```

## Checklist de Implementação

### Fase 1: Configuração Inicial
- [ ] Instalar dependências do Stripe
- [ ] Configurar produto e preço no Stripe Dashboard
- [ ] Adicionar variáveis de ambiente
- [ ] Criar schema do banco de dados no Supabase
- [ ] Configurar RLS policies

### Fase 2: Backend
- [ ] Implementar Stripe clients (server/client)
- [ ] Criar subscription service
- [ ] Implementar API routes (checkout, portal, webhooks)
- [ ] Configurar webhook no Stripe Dashboard
- [ ] Testar webhooks com Stripe CLI

### Fase 3: Frontend
- [ ] Criar hooks (useSubscription, useTrialModal)
- [ ] Implementar TrialWelcomeModal
- [ ] Criar SubscriptionGuard
- [ ] Implementar páginas (subscribe, subscription-expired)
- [ ] Adicionar SubscriptionStatus (opcional)

### Fase 4: Integração
- [ ] Atualizar middleware para verificar assinatura
- [ ] Adicionar SubscriptionGuard aos layouts
- [ ] Testar fluxo completo de trial
- [ ] Testar fluxo de checkout
- [ ] Testar fluxo de expiração

### Fase 5: Testes e Deploy
- [ ] Testar com Stripe test mode
- [ ] Testar webhooks em produção
- [ ] Validar RLS policies
- [ ] Migrar para Stripe live mode
- [ ] Monitorar logs e erros

## Considerações de Segurança

1. **Nunca expor chaves secretas** no código client-side
2. **Validar webhooks** usando Stripe signature
3. **Usar RLS** para proteger dados de assinatura
4. **Service Role** apenas no backend (webhooks)
5. **Verificação dupla**: Middleware + SubscriptionGuard
6. **HTTPS obrigatório** em produção

## Monitoramento

- Logs de webhooks no Stripe Dashboard
- Monitorar tabela `subscriptions` no Supabase
- Alertas para pagamentos falhados
- Métricas de conversão (trial → paid)
- Taxa de cancelamento (churn rate)

## Próximos Passos (Futuro)

- Sistema de cupons de desconto
- Planos anuais com desconto
- Programa de afiliados
- Notificações por email (trial ending, payment failed)
- Analytics de conversão
