import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from './dropdown'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-64 flex items-start justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownButton className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3.5 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
        Options
        <ChevronDownIcon className="size-4" />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href="/option1">Option 1</DropdownItem>
        <DropdownItem href="/option2">Option 2</DropdownItem>
        <DropdownItem href="/option3">Option 3</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}

export const WithClickHandler: Story = {
  render: () => (
    <Dropdown>
      <DropdownButton className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3.5 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
        Actions
        <ChevronDownIcon className="size-4" />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem onClick={() => alert('Edit clicked')}>Edit</DropdownItem>
        <DropdownItem onClick={() => alert('Duplicate clicked')}>
          Duplicate
        </DropdownItem>
        <DropdownItem onClick={() => alert('Delete clicked')}>
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}

export const ManyItems: Story = {
  render: () => (
    <Dropdown>
      <DropdownButton className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3.5 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
        Select
        <ChevronDownIcon className="size-4" />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href="/item1">Item 1</DropdownItem>
        <DropdownItem href="/item2">Item 2</DropdownItem>
        <DropdownItem href="/item3">Item 3</DropdownItem>
        <DropdownItem href="/item4">Item 4</DropdownItem>
        <DropdownItem href="/item5">Item 5</DropdownItem>
        <DropdownItem href="/item6">Item 6</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}

export const UserMenu: Story = {
  render: () => (
    <Dropdown>
      <DropdownButton className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3.5 py-2 text-sm/6 font-semibold text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
        User Menu
        <ChevronDownIcon className="size-4" />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem href="/profile">Profile</DropdownItem>
        <DropdownItem href="/settings">Settings</DropdownItem>
        <DropdownItem onClick={() => alert('Signing out...')}>
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}
