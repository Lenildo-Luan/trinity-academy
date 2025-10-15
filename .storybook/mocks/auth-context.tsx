'use client'

import { createContext, useContext } from 'react'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

// Create a context that will be shared across the mock
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Export a way to set the mock auth value
let mockAuthValue: AuthContextType = {
  user: null,
  loading: false,
  signOut: async () => {
    console.log('Mock sign out called')
  },
}

export function setMockAuthValue(value: Partial<AuthContextType>) {
  mockAuthValue = { ...mockAuthValue, ...value }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return default mock value instead of throwing
    return mockAuthValue
  }
  return context
}
