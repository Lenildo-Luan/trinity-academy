import { createClient } from '@/lib/supabase/server'
import type { UserAccessStatus, Subscription } from '@/types/subscription'

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
