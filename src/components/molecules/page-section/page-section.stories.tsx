import type { Meta, StoryObj } from '@storybook/react'
import { PageSection, VideoCard } from '@/components/molecules'

const meta = {
  title: 'Components/PageSection',
  component: PageSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Módulo 1',
    children: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          Este é o conteúdo da seção. Você pode adicionar qualquer tipo de conteúdo aqui,
          incluindo texto, imagens, vídeos e muito mais.
        </p>
        <p>
          O layout é responsivo e se adapta automaticamente a diferentes tamanhos de tela.
        </p>
      </div>
    ),
  },
}

export const WithList: Story = {
  args: {
    title: 'Tópicos',
    children: (
      <div className="text-gray-700 dark:text-gray-300">
        <ul className="list-disc pl-5 space-y-2">
          <li>Variáveis e tipos de dados</li>
          <li>Operadores aritméticos</li>
          <li>Estruturas condicionais</li>
          <li>Laços de repetição</li>
          <li>Funções</li>
        </ul>
      </div>
    ),
  },
}

export const WithVideos: Story = {
  args: {
    title: 'Aulas',
    children: (
      <div className="grid gap-6 sm:grid-cols-2">
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
          title="Primeiros Passos"
          subtitle="Módulo 1"
        />
      </div>
    ),
  },
}

export const WithRichContent: Story = {
  args: {
    title: 'Sobre o Curso',
    children: (
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-2">
            O que você vai aprender
          </h3>
          <p>
            Neste curso, você aprenderá os fundamentos da programação de forma prática e
            objetiva.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-2">
            Pré-requisitos
          </h3>
          <p>Não é necessário conhecimento prévio em programação.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-2">
            Duração
          </h3>
          <p>O curso tem aproximadamente 20 horas de conteúdo em vídeo.</p>
        </div>
      </div>
    ),
  },
}

export const MultipleSections: Story = {
  args: {
    title: 'Multiple Sections Example',
  },
  render: () => (
    <div className="space-y-8">
      <PageSection title="Introdução">
        <p className="text-gray-700 dark:text-gray-300">
          Bem-vindo ao curso de Introdução a Programação. Aqui você aprenderá os conceitos
          fundamentais.
        </p>
      </PageSection>
      <PageSection title="Módulos">
        <div className="grid gap-6 sm:grid-cols-2">
          <VideoCard
            url="/video/1"
            thumbnailUrl="https://assets.tailwindcss.com/templates/compass/video-placeholder.png"
            duration={1845}
            title="Módulo 1"
            subtitle="Fundamentos"
          />
          <VideoCard
            url="/video/2"
            thumbnailUrl="https://assets.tailwindcss.com/templates/compass/video-placeholder.png"
            duration={2130}
            title="Módulo 2"
            subtitle="Estruturas"
          />
        </div>
      </PageSection>
      <PageSection title="Recursos">
        <div className="text-gray-700 dark:text-gray-300">
          <ul className="list-disc pl-5 space-y-2">
            <li>Material de apoio em PDF</li>
            <li>Exercícios práticos</li>
            <li>Projetos finais</li>
          </ul>
        </div>
      </PageSection>
    </div>
  ),
}
