# Processo de Criação de Aula — Trinity Academy

Este documento descreve o passo a passo completo para criar um novo capítulo (aula) no projeto Trinity Academy. Use-o como referência para manter consistência e agilizar a criação de futuras aulas.

---

## Visão Geral da Arquitetura

```
src/
  data/
    lessons/{curso}/
      module.json            ← Registro de módulos e aulas
      charpter-N.mdx         ← Conteúdo da aula em MDX
    quizzes/{curso}/
      quiz-N.json            ← Perguntas do quiz da aula
  components/
    {nome}-p5-examples.tsx   ← Componentes p5.js para visualizações
    p5-sketch.tsx            ← Componente wrapper do p5.js
    MarkdownTable.tsx        ← Componente para tabelas formatadas
mdx-components.tsx           ← Registro global de componentes MDX
```

## Passo a Passo

### 1. Criar o arquivo de visualizações p5.js

**Caminho:** `src/components/{nome-do-tema}-p5-examples.tsx`

**Padrão a seguir:**
```tsx
"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

export function NomeDaVisualizacao() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);       // Fundo escuro padrão
    time += 0.015;                 // Incremento de tempo para animações

    const w = p.width;
    const h = p.height;

    // Título
    p.noStroke();
    p.fill(200);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.text("Título da Visualização", w / 2, 10);

    // ... lógica de desenho ...

    // Info rodapé
    p.noStroke();
    p.fill(100);
    p.textSize(9);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("Texto explicativo resumido", w / 2, h - 6);
  };

  return <P5Sketch setup={setup} draw={draw} height={340} />;
}
```

**Convenções importantes:**
- Sempre usar `"use client"` no topo
- Fundo padrão: `p.background(2, 7, 19)` (azul escuro)
- Fonte padrão: `p.textFont("monospace")`
- Paleta de cores dos elementos:
  - Azul: `[0, 150, 255]` — camada de transporte
  - Laranja: `[255, 180, 50]` — camada de rede
  - Verde: `[100, 200, 100]` — dados da aplicação
  - Vermelho: `[255, 100, 100]` — processo 1
  - Verde claro: `[100, 255, 100]` — processo 2
  - Azul claro: `[100, 180, 255]` — processo 3
- Heights típicos: 280–400px
- Cada componente exporta UMA visualização
- Tipicamente 4–6 visualizações por aula

### 2. Registrar componentes no MDX

**Arquivo:** `mdx-components.tsx` (raiz do projeto)

Duas alterações necessárias:

**a) Adicionar import (junto aos outros imports de p5):**
```tsx
import {
  NomeDaVisualizacao1,
  NomeDaVisualizacao2,
} from "./src/components/{nome}-p5-examples";
```

**b) Adicionar ao objeto retornado por `useMDXComponents`:**
```tsx
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // ...componentes existentes...
    NomeDaVisualizacao1,
    NomeDaVisualizacao2,
    ...components,  // ← sempre manter por último
  };
}
```

### 3. Criar o conteúdo MDX da aula

**Caminho:** `src/data/lessons/{curso}/charpter-N.mdx`

> **Nota:** O projeto usa `charpter` (typo intencional mantido por consistência).

**Estrutura padrão do conteúdo:**

```mdx
# Título do Capítulo

Parágrafo introdutório contextualizando o tema, conectando ao capítulo anterior.

## Seção Principal 1

Explicação teórica com termos em **negrito** e *itálico* para conceitos-chave.

> Citação/destaque para definições importantes.

<NomeDaVisualizacao />

<MarkdownTable
  headers={["Coluna 1", "Coluna 2", "Coluna 3"]}
  rows={[
    ["**Termo**", "Descrição", "Detalhe"],
    ["**Termo 2**", "Descrição 2", "Detalhe 2"],
  ]}
/>

## Seção Principal 2

... mais conteúdo ...

### Subseção

... detalhes ...

## Resumo da Aula

- Ponto resumido 1
- Ponto resumido 2
- Ponto resumido 3
```

**Boas práticas do conteúdo:**
- H1 (`#`) apenas para o título principal — um por arquivo
- H2 (`##`) para seções principais
- H3 (`###`) para subseções
- Usar `<MarkdownTable>` para comparações e dados tabulares
- Inserir visualizações p5.js entre o texto explicativo (antes ou depois da teoria que ilustram)
- Usar blockquotes (`>`) para definições-chave ou resumos importantes
- Finalizar com "Resumo da Aula" em bullets
- Linguagem direta, formal mas acessível para estudantes de engenharia

### 4. Criar o quiz da aula

**Caminho:** `src/data/quizzes/{curso}/quiz-N.json`

**Schema do quiz:**
```json
{
  "id": "quiz-N",
  "title": "Quiz — Título do Capítulo",
  "description": "Descrição breve do que o quiz cobre.",
  "timeLimit": 900,
  "questions": [
    {
      "id": "q1",
      "question": "Texto da pergunta?",
      "alternatives": [
        {
          "id": "a1",
          "text": "Alternativa incorreta",
          "isCorrect": false,
          "explanation": "Por que está errada."
        },
        {
          "id": "a2",
          "text": "Alternativa correta",
          "isCorrect": true,
          "explanation": "Por que está certa."
        },
        {
          "id": "a3",
          "text": "Alternativa incorreta",
          "isCorrect": false,
          "explanation": "Por que está errada."
        },
        {
          "id": "a4",
          "text": "Alternativa incorreta",
          "isCorrect": false,
          "explanation": "Por que está errada."
        }
      ]
    }
  ]
}
```

**Convenções do quiz:**
- `timeLimit`: 900 segundos (15 minutos) padrão
- 10 questões por quiz
- 4 alternativas por questão (a1–a4)
- Apenas 1 correta (`isCorrect: true`)
- Cada alternativa tem `explanation` (mostrada ao revisar)
- IDs: `q1`–`q10` para questões, `a1`–`a4` para alternativas
- Misturar questões conceituais, práticas e de cenário
- Posição da alternativa correta deve variar (não sempre a2)

### 5. Registrar a aula no module.json

**Caminho:** `src/data/lessons/{curso}/module.json`

Adicionar ao array `lessons` do módulo correspondente:

```json
{
  "id": "charpter-N",
  "title": "Título do Capítulo",
  "description": "Descrição curta do conteúdo abordado.",
  "video": null,
  "quizId": "quiz-N"
}
```

**Campos:**
- `id`: deve corresponder ao nome do arquivo MDX (sem extensão)
- `title`: título exibido na sidebar e na página
- `description`: resumo curto para listagem
- `video`: URL do vídeo ou `null` se não houver
- `quizId`: deve corresponder ao `id` dentro do JSON do quiz

### 6. Verificar o build

```bash
npx next build
```

**Não é necessário** criar rotas — o dynamic route `src/app/(sidebar)/{curso}/[slug]/page.tsx` resolve automaticamente qualquer novo `charpter-N` via `getLesson()` e `getLessonContent()`.

---

## Checklist Rápido

- [ ] Componente p5.js criado em `src/components/{nome}-p5-examples.tsx`
- [ ] Componentes importados e registrados em `mdx-components.tsx`
- [ ] Arquivo MDX criado em `src/data/lessons/{curso}/charpter-N.mdx`
- [ ] Quiz criado em `src/data/quizzes/{curso}/quiz-N.json`
- [ ] Aula registrada em `src/data/lessons/{curso}/module.json`
- [ ] Build executado com sucesso (`npx next build`)

---

## Arquivos Criados por Aula (Exemplo)

Para a aula "Multiplexação e Demultiplexação" (charpter-2):

| Arquivo | Descrição |
|---------|-----------|
| `src/components/multiplexing-demux-p5-examples.tsx` | 6 visualizações p5.js |
| `src/data/lessons/redes-de-computadores/charpter-2.mdx` | Conteúdo MDX da aula |
| `src/data/quizzes/redes-de-computadores/quiz-2.json` | Quiz com 10 questões |
| `src/data/lessons/redes-de-computadores/module.json` | Atualizado com nova entrada |
| `mdx-components.tsx` | Atualizado com imports e registros |

Total: **3 arquivos novos** + **2 arquivos editados** por aula.

