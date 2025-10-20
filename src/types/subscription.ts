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
