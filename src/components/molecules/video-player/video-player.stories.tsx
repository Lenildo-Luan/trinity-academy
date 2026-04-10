import type { Meta, StoryObj } from '@storybook/react'
import { Video, TimestampButton } from '@/components/molecules'

const meta = {
  title: 'Components/VideoPlayer',
  component: Video,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Video>

export default meta
type Story = StoryObj<typeof meta>

// Mock video URLs (using public domain video)
const mockVideoSources = {
  sd: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  hd: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
}

const mockPoster = 'https://assets.tailwindcss.com/templates/compass/video-placeholder.png'

export const Default: Story = {
  args: {
    src: mockVideoSources.sd,
    poster: mockPoster,
    id: 'video-default',
  },
}

export const WithoutPoster: Story = {
  args: {
    src: mockVideoSources.sd,
    id: 'video-no-poster',
  },
}

export const HDVideo: Story = {
  args: {
    src: mockVideoSources.hd,
    poster: mockPoster,
    id: 'video-hd',
  },
}

export const WithTimestamps: Story = {
  render: () => (
    <div className="space-y-6">
      <Video
        src={mockVideoSources.sd}
        poster={mockPoster}
        id="video-timestamps"
      />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
          Chapters
        </h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <TimestampButton start={0} videoId="video-timestamps" />
            <div>
              <p className="font-medium text-gray-950 dark:text-white">Introduction</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overview of what we'll cover in this video
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TimestampButton start={120} videoId="video-timestamps" />
            <div>
              <p className="font-medium text-gray-950 dark:text-white">First Concept</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explaining the fundamental concepts
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TimestampButton start={300} videoId="video-timestamps" />
            <div>
              <p className="font-medium text-gray-950 dark:text-white">Practical Example</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Walking through a real-world example
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TimestampButton start={480} videoId="video-timestamps" />
            <div>
              <p className="font-medium text-gray-950 dark:text-white">Conclusion</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Summary and next steps
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

// TimestampButton stories
const timestampMeta = {
  title: 'Components/VideoPlayer/TimestampButton',
  component: TimestampButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TimestampButton>

type TimestampStory = StoryObj<typeof timestampMeta>

export const TimestampDefault: TimestampStory = {
  args: {
    start: 0,
    videoId: 'demo-video',
  },
}

export const TimestampMinutes: TimestampStory = {
  args: {
    start: 120, // 2:00
    videoId: 'demo-video',
  },
}

export const TimestampHours: TimestampStory = {
  args: {
    start: 3665, // 1:01:05
    videoId: 'demo-video',
  },
}

export const MultipleTimestamps: TimestampStory = {
  args: {
    start: 0,
    videoId: 'demo-video',
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TimestampButton start={0} videoId="demo-video" />
      <TimestampButton start={45} videoId="demo-video" />
      <TimestampButton start={120} videoId="demo-video" />
      <TimestampButton start={305} videoId="demo-video" />
      <TimestampButton start={720} videoId="demo-video" />
      <TimestampButton start={1845} videoId="demo-video" />
      <TimestampButton start={3665} videoId="demo-video" />
    </div>
  ),
}
