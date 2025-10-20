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
