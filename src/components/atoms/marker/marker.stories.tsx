import type { Meta, StoryObj } from '@storybook/react'
import { Marker } from '@/components/atoms'

const meta = {
  title: 'Components/Marker',
  component: Marker,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    time: {
      control: 'text',
      description: 'Timestamp for the marker',
    },
    title: {
      control: 'text',
      description: 'Title of the marker section',
    },
  },
} satisfies Meta<typeof Marker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    time: '00:00',
    title: 'Introduction',
    children: (
      <p className="text-gray-700 dark:text-gray-300">
        Welcome to this video. In this section, we'll introduce the main concepts.
      </p>
    ),
  },
}

export const WithLongContent: Story = {
  args: {
    time: '05:23',
    title: 'Advanced Topics',
    children: (
      <div className="text-gray-700 dark:text-gray-300">
        <p className="mb-2">
          This is a longer marker with multiple paragraphs of content.
        </p>
        <p className="mb-2">
          We can include detailed explanations and code examples here.
        </p>
        <p>The marker component is flexible enough to handle any content.</p>
      </div>
    ),
  },
}

export const MultipleMarkers: Story = {
  args: {
    time: '00:00',
    title: 'Multiple Markers Example',
  },
  render: () => (
    <div className="space-y-6">
      <Marker time="00:00" title="Introduction">
        <p className="text-gray-700 dark:text-gray-300">
          Overview of the topic we'll cover today.
        </p>
      </Marker>
      <Marker time="02:15" title="First Concept">
        <p className="text-gray-700 dark:text-gray-300">
          Explaining the first important concept in detail.
        </p>
      </Marker>
      <Marker time="08:42" title="Practical Example">
        <p className="text-gray-700 dark:text-gray-300">
          Let's see how this works in practice with a real example.
        </p>
      </Marker>
      <Marker time="15:30" title="Conclusion">
        <p className="text-gray-700 dark:text-gray-300">
          Summary of what we've learned and next steps.
        </p>
      </Marker>
    </div>
  ),
}

export const WithCodeBlock: Story = {
  args: {
    time: '10:45',
    title: 'Code Example',
    children: (
      <div className="text-gray-700 dark:text-gray-300">
        <p className="mb-2">Here's a simple code example:</p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
          <code>{`function greet(name) {
  console.log('Hello, ' + name);
}`}</code>
        </pre>
      </div>
    ),
  },
}
