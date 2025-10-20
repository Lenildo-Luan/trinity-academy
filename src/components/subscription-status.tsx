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
