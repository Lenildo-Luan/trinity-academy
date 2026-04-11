import { ContentLink } from "@/components/molecules";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/ContentLink",
  component: ContentLink,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContentLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Article: Story = {
  args: {
    title: "Introducao a redes de computadores",
    description: "Entenda os conceitos basicos e a arquitetura em camadas.",
    href: "/redes-de-computadores/chapter-1",
    type: "article",
  },
};

export const Tool: Story = {
  args: {
    title: "Simulador de protocolo",
    description: "Ferramenta interativa para praticar transferencia confiavel.",
    href: "/redes-de-computadores/chapter-3",
    type: "tool",
  },
};

export const VideoWithDuration: Story = {
  args: {
    title: "Aula: Camada de transporte",
    description: "Resumo dos mecanismos de multiplexacao e controle de fluxo.",
    href: "/redes-de-computadores/chapter-4",
    type: "video",
    duration: 1425,
  },
};
