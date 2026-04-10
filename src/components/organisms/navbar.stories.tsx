import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from './navbar'
import { Logo } from '../atoms/logo'
import { withAuth, mockUsers } from '../../../.storybook/decorators/auth-decorator'

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    withAuth,
    (Story) => (
      <div>
        <Story />
        <div className="p-8 text-gray-950 dark:text-white">
          <h1 className="text-2xl font-bold">Page Content</h1>
          <p className="mt-4">
            This demonstrates the sticky navbar behavior. The navbar will stay at the top
            when scrolling.
          </p>
          <div className="mt-8 space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Unauthenticated: Story = {
  parameters: {
    mockUser: null,
  },
  render: () => (
    <Navbar>
      <Logo className="h-8 w-auto text-gray-950 dark:text-white" />
    </Navbar>
  ),
}

export const Authenticated: Story = {
  parameters: {
    mockUser: mockUsers.authenticated,
  },
  render: () => (
    <Navbar>
      <Logo className="h-8 w-auto text-gray-950 dark:text-white" />
    </Navbar>
  ),
}

export const AuthenticatedAdmin: Story = {
  parameters: {
    mockUser: mockUsers.admin,
  },
  render: () => (
    <Navbar>
      <Logo className="h-8 w-auto text-gray-950 dark:text-white" />
    </Navbar>
  ),
}

export const Loading: Story = {
  parameters: {
    mockUser: null,
    mockAuthLoading: true,
  },
  render: () => (
    <Navbar>
      <Logo className="h-8 w-auto text-gray-950 dark:text-white" />
    </Navbar>
  ),
}

export const WithTitle: Story = {
  parameters: {
    mockUser: mockUsers.authenticated,
  },
  render: () => (
    <Navbar>
      <div className="flex items-center gap-x-4">
        <Logo className="h-8 w-auto text-gray-950 dark:text-white" />
        <span className="text-lg font-semibold text-gray-950 dark:text-white">
          Introdução a Programação
        </span>
      </div>
    </Navbar>
  ),
}
