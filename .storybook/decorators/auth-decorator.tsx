import React from 'react'
import type { Decorator } from '@storybook/react'
import { User } from '@supabase/supabase-js'
import { setMockAuthValue } from '../mocks/auth-context'

// Mock user data
export const mockUsers = {
  authenticated: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'usuario@example.com',
    user_metadata: {
      full_name: 'Usuário Teste',
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
  } as User,
  admin: {
    id: '987e6543-e21b-45d3-a456-426614174000',
    email: 'admin@example.com',
    user_metadata: {
      full_name: 'Admin User',
    },
    app_metadata: {
      role: 'admin',
    },
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
  } as User,
}

/**
 * Decorator to wrap stories with authentication state
 *
 * Usage in stories:
 * ```
 * export const Authenticated: Story = {
 *   parameters: {
 *     mockUser: mockUsers.authenticated,
 *   },
 * }
 *
 * export const Unauthenticated: Story = {
 *   parameters: {
 *     mockUser: null,
 *   },
 * }
 *
 * export const Loading: Story = {
 *   parameters: {
 *     mockUser: null,
 *     mockAuthLoading: true,
 *   },
 * }
 * ```
 */
export const withAuth: Decorator = (Story, context) => {
  const mockUser = context.parameters.mockUser !== undefined
    ? context.parameters.mockUser
    : null
  const loading = context.parameters.mockAuthLoading || false

  // Update the mock auth value before rendering
  React.useEffect(() => {
    setMockAuthValue({ user: mockUser, loading })
  }, [mockUser, loading])

  return <Story />
}
