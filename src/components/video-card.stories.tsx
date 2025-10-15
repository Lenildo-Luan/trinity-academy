import type { Meta, StoryObj } from '@storybook/react'
import { VideoCard } from './video-card'

const meta = {
  title: 'Components/VideoCard',
  component: VideoCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: 'number',
      description: 'Duration in seconds',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    url: '/video/example',
    thumbnailUrl: 'https://assets.tailwindcss.com/templates/compass/video-placeholder.png',
    duration: 3725, // 1:02:05
    title: 'Introdução a JavaScript',
    subtitle: 'Aprenda os fundamentos da linguagem',
  },
}

export const WithVideoPreview: Story = {
  args: {
    url: '/video/example',
    thumbnailUrl: 'https://assets.tailwindcss.com/templates/compass/video-placeholder.png',
    videoUrl: 'https://assets.tailwindcss.com/templates/compass/video-preview.mp4',
    duration: 1845, // 30:45
    title: 'Variáveis e Tipos de Dados',
    subtitle: 'Entenda como armazenar informações',
  },
}

export const ShortVideo: Story = {
  args: {
    url: '/video/short',
    thumbnailUrl: 'https://assets.tailwindcss.com/templates/compass/video-placeholder.png',
    duration: 125, // 2:05
    title: 'Dica Rápida: Console.log',
    subtitle: 'Como debugar seu código',
  },
}

export const LongVideo: Story = {
  args: {
    url: '/video/long',
    thumbnailUrl: 'https://assets.tailwindcss.com/templates/compass/video-placeholder.png',
    duration: 7215, // 2:00:15
    title: 'Curso Completo de Python',
    subtitle: 'Do básico ao avançado',
  },
}

export const ExternalLink: Story = {
  args: {
    url: 'https://youtube.com/watch?v=example',
    target: '_blank',
    thumbnailUrl: 'https://assets.tailwindcss.com/templates/compass/video-placeholder.png',
    duration: 600, // 10:00
    title: 'Assistir no YouTube',
    subtitle: 'Aula externa sobre programação',
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <VideoCard
        url="/video/1"
        thumbnailUrl="https://assets.tailwindcss.com/templates/compass/video-placeholder.png"
        duration={1845}
        title="Introdução a Programação"
        subtitle="Módulo 1"
      />
      <VideoCard
        url="/video/2"
        thumbnailUrl="https://assets.tailwindcss.com/templates/compass/video-placeholder.png"
        duration={2130}
        title="Estruturas de Controle"
        subtitle="Módulo 2"
      />
      <VideoCard
        url="/video/3"
        thumbnailUrl="https://assets.tailwindcss.com/templates/compass/video-placeholder.png"
        duration={1920}
        title="Funções"
        subtitle="Módulo 3"
      />
      <VideoCard
        url="/video/4"
        thumbnailUrl="https://assets.tailwindcss.com/templates/compass/video-placeholder.png"
        duration={2400}
        title="Estruturas de Dados"
        subtitle="Módulo 4"
      />
    </div>
  ),
}
