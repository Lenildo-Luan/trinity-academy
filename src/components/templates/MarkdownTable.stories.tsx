import { MarkdownTable } from "@/components/templates";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/MarkdownTable",
  component: MarkdownTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarkdownTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headers: ["Conceito", "Descricao", "Complexidade"],
    rows: [
      ["Busca linear", "Varre item a item da lista", "O(n)"],
      ["Busca binaria", "Requer dados ordenados", "O(log n)"],
      ["Merge sort", "Divide e conquista estavel", "O(n log n)"],
    ],
  },
};

export const WithMarkdownAndRowCount: Story = {
  args: {
    headers: ["**Algoritmo**", "*Uso principal*", "`Big O`"],
    rows: [
      [
        "**Dijkstra**",
        "Menor caminho em grafos com pesos nao negativos",
        "`O((V + E) log V)`",
      ],
      ["*Bellman-Ford*", "Suporta pesos negativos", "`O(VE)`"],
      ["`BFS`", "Caminho minimo em grafo nao ponderado", "`O(V + E)`"],
    ],
    showRowCount: true,
  },
};
