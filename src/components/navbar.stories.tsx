import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from './navbar'
import { Logo } from './logo'

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
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

export const Default: Story = {
  render: () => (
    <Navbar>
      <Logo />
    </Navbar>
  ),
}

export const WithTitle: Story = {
  render: () => (
    <Navbar>
      <div className="flex items-center gap-x-4">
        <Logo />
        <span className="text-lg font-semibold text-gray-950 dark:text-white">
          Introdução a Programação
        </span>
      </div>
    </Navbar>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Navbar>
      <span className="text-sm font-medium text-gray-950 dark:text-white">
        My App
      </span>
    </Navbar>
  ),
}
