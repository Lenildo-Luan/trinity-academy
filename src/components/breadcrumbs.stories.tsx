import type { Meta, StoryObj } from '@storybook/react'
import {
  Breadcrumbs,
  BreadcrumbHome,
  Breadcrumb,
  BreadcrumbSeparator,
} from './breadcrumbs'

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
      <BreadcrumbSeparator />
      <Breadcrumb href="/module1">Módulo 1</Breadcrumb>
      <BreadcrumbSeparator />
      <Breadcrumb>Lição Atual</Breadcrumb>
    </Breadcrumbs>
  ),
}

export const TwoLevels: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
      <BreadcrumbSeparator />
      <Breadcrumb>Módulo Atual</Breadcrumb>
    </Breadcrumbs>
  ),
}

export const DeepNesting: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
      <BreadcrumbSeparator />
      <Breadcrumb href="/module1">Módulo 1: Introdução</Breadcrumb>
      <BreadcrumbSeparator />
      <Breadcrumb href="/module1/chapter1">Capítulo 1: Conceitos Básicos</Breadcrumb>
      <BreadcrumbSeparator />
      <Breadcrumb href="/module1/chapter1/lesson1">Lição 1: Variáveis</Breadcrumb>
      <BreadcrumbSeparator />
      <Breadcrumb>Exercício 1</Breadcrumb>
    </Breadcrumbs>
  ),
}

export const LongText: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
      <BreadcrumbSeparator />
      <Breadcrumb href="/module">
        Módulo com um título extremamente longo que pode ser truncado
      </Breadcrumb>
      <BreadcrumbSeparator />
      <Breadcrumb>
        Outra página com título muito longo para demonstrar truncamento
      </Breadcrumb>
    </Breadcrumbs>
  ),
}

export const OnlyHome: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbHome href={'/introducao-a-programacao'}>Introdução a Programação</BreadcrumbHome>
    </Breadcrumbs>
  ),
}
