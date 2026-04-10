import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './icon-button'
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Close: Story = {
  args: {
    children: <XMarkIcon className="size-5 text-gray-950 dark:text-white" />,
  },
}

export const Search: Story = {
  args: {
    children: <MagnifyingGlassIcon className="size-5 text-gray-950 dark:text-white" />,
  },
}

export const Heart: Story = {
  args: {
    children: <HeartIcon className="size-5 text-gray-950 dark:text-white" />,
  },
}

export const Back: Story = {
  args: {
    children: <ArrowLeftIcon className="size-5 text-gray-950 dark:text-white" />,
  },
}

export const Settings: Story = {
  args: {
    children: <Cog6ToothIcon className="size-5 text-gray-950 dark:text-white" />,
  },
}

export const Disabled: Story = {
  args: {
    children: <XMarkIcon className="size-5 text-gray-950 dark:text-white" />,
    disabled: true,
  },
}
