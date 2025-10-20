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
