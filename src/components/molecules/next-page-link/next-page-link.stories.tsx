import { NextPageLink } from "@/components/molecules";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/NextPageLink",
  component: NextPageLink,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NextPageLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Camada de enlace",
    description: "Veja enquadramento, deteccao de erros e acesso ao meio.",
    href: "/redes-de-computadores/chapter-2",
  },
};

export const LongDescription: Story = {
  args: {
    title: "Modelos de servico de rede",
    description:
      "Compare abordagens orientadas a conexao e sem conexao, com foco em latencia, confiabilidade e throughput.",
    href: "/redes-de-computadores/chapter-6",
  },
};
