import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from '@/components/atoms'

const meta = {
  title: 'Components/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS classes to apply to the logo',
    },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    className: 'h-8 w-auto text-gray-950 dark:text-white',
  },
}

export const Small: Story = {
  args: {
    className: 'h-6 w-auto text-gray-950 dark:text-white',
  },
}

export const Large: Story = {
  args: {
    className: 'h-12 w-auto text-gray-950 dark:text-white',
  },
}

export const Colored: Story = {
  args: {
    className: 'h-8 w-auto text-blue-600',
  },
}

export const ExtraLarge: Story = {
  args: {
    className: 'h-20 w-auto text-gray-950 dark:text-white',
  },
}
