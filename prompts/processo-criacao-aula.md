# Processo de Criação de Aula — Trinity Academy

Este documento descreve o passo a passo completo para criar um novo capítulo (aula) no projeto Trinity Academy. Contém **todos os padrões, exemplos reais e contexto** necessários para que a criação de uma aula possa ser feita de forma autônoma, sem precisar consultar outros arquivos do projeto.

---

## Visão Geral da Arquitetura

```
trinity-academy/
  mdx-components.tsx             ← Registro global de componentes MDX (imports + useMDXComponents)
  src/
    data/
      lessons.ts                 ← getLesson(), getLessonContent(), tipos Module/Lesson
      quizzes.ts                 ← getQuiz(), validateQuizData(), tipos Quiz/Question/Alternative
      lessons/{curso}/
        module.json              ← Registro de módulos e aulas do curso
        charpter-N.mdx           ← Conteúdo da aula em MDX
      quizzes/{curso}/
        quiz-N.json              ← Perguntas do quiz da aula
    components/
      {nome}-p5-examples.tsx     ← Componentes p5.js para visualizações interativas
      p5-sketch.tsx              ← Componente wrapper do p5.js (usado internamente)
      MarkdownTable.tsx          ← Componente para tabelas formatadas com markdown
    app/(sidebar)/{curso}/
      [slug]/page.tsx            ← Rota dinâmica — resolve QUALQUER charpter-N automaticamente
```

### Fluxo de Resolução (Não precisa criar rotas!)

1. O usuário acessa `/redes-de-computadores/charpter-3`
2. O `[slug]/page.tsx` chama `getLesson('redes-de-computadores', 'charpter-3')`
3. `getLesson` busca em `module.json` a entrada com `id: "charpter-3"`
4. `getLessonContent` faz `import('@/data/lessons/redes-de-computadores/charpter-3.mdx')`
5. Se `quizId: "quiz-3"`, chama `getQuiz('redes-de-computadores', 'quiz-3')`
6. O MDX é renderizado com os componentes de `mdx-components.tsx`

---

## Passo a Passo

### 1. Criar o arquivo de visualizações p5.js

**Caminho:** `src/components/{nome-do-tema}-p5-examples.tsx`

**Padrão completo a seguir:**
```tsx
"use client";

import { P5Sketch } from "./p5-sketch";
import type p5 from "p5";

// Visualization 1: Descrição curta do que a visualização mostra
export function NomeDaVisualizacao() {
  let time = 0;

  const setup = (p: p5) => {
    p.textFont("monospace");
  };

  const draw = (p: p5) => {
    p.background(2, 7, 19);       // Fundo escuro padrão (SEMPRE USAR)
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

    // Elementos comuns:
    // - Caixas/hosts: p.rect(x, y, w, h, 8) com stroke colorido e fill escuro
    // - Labels dentro de caixas: textSize(11), textAlign(CENTER, TOP)
    // - Sub-labels: textSize(9), fill(80)
    // - Setas/linhas: strokeWeight(2), cores da paleta
    // - Partículas animadas: usar time para posicionar com p.lerp() ou p.sin()

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

**Props do P5Sketch:**
```tsx
type P5SketchProps = {
  setup: (p: p5) => void;
  draw: (p: p5) => void;
  mousePressed?: (p: p5) => void;  // Para interatividade com clique
  width?: number;                   // Se omitido, usa 100% do container
  height?: number;                  // Padrão: 400. Típico: 280–400
  className?: string;
};
```

**Convenções visuais obrigatórias:**
- Sempre usar `"use client"` no topo
- Fundo padrão: `p.background(2, 7, 19)` (azul escuro)
- Fonte padrão: `p.textFont("monospace")`
- Paleta de cores dos elementos:
  - Azul: `[0, 150, 255]` — camada de transporte, elementos primários
  - Laranja: `[255, 180, 50]` — camada de rede, elementos secundários
  - Verde: `[100, 200, 100]` — dados da aplicação, sucesso
  - Vermelho: `[255, 100, 100]` — erros, perdas, processo 1
  - Verde claro: `[100, 255, 100]` — processo 2
  - Azul claro: `[100, 180, 255]` — processo 3
  - Roxo: `[180, 130, 255]` — elementos especiais
  - Cinza para texto secundário: `fill(80)` ou `fill(100)`
  - Fundo de caixas: `fill(15, 20, 35)` com `stroke(cor, 80)` e `strokeWeight(2)`
- Heights típicos: 280–400px
- Cada função exportada = UMA visualização independente
- Tipicamente 4–8 visualizações por aula
- Usar comentários em inglês para descrever cada visualização: `// Visualization N: Descrição`
- Animações usam `time` incrementado em `draw()` com `time += 0.015`
- Textos e labels sempre em **português**

**Padrões comuns de elementos visuais:**
```tsx
// Host/Caixa
p.fill(15, 20, 35);
p.stroke(0, 150, 255, 80);
p.strokeWeight(2);
p.rect(x, y, width, height, 8);  // cantos arredondados com 8px

// Nuvem de rede no meio
p.fill(20, 30, 50, 150);
p.stroke(80, 80, 120, 60);
p.strokeWeight(1);
p.ellipse(cloudX, cloudY, 120, 70);

// Pacote/datagrama animado
const progress = (time * speed) % 1;
const px = p.lerp(startX, endX, progress);
const py = p.lerp(startY, endY, progress);
p.fill(0, 150, 255);
p.noStroke();
p.rect(px - 15, py - 8, 30, 16, 4);

// Seta
p.stroke(0, 150, 255, 150);
p.strokeWeight(2);
p.line(x1, y1, x2, y2);
// Ponta da seta com p.triangle()
```

### 2. Registrar componentes no MDX

**Arquivo:** `mdx-components.tsx` (raiz do projeto)

Duas alterações obrigatórias:

**a) Adicionar import (junto aos outros imports de p5, no final do bloco de imports):**
```tsx
import {
  NomeDaVisualizacao1,
  NomeDaVisualizacao2,
  NomeDaVisualizacao3,
} from "./src/components/{nome}-p5-examples";
```

**b) Adicionar ao objeto retornado por `useMDXComponents` (ANTES de `...components`):**
```tsx
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // ...todos os componentes existentes...
    NomeDaVisualizacao1,
    NomeDaVisualizacao2,
    NomeDaVisualizacao3,
    ...components,  // ← SEMPRE manter como último item
  };
}
```

> **IMPORTANTE:** O `...components` DEVE ser o último item. Componentes novos são adicionados imediatamente antes dele.

### 3. Criar o conteúdo MDX da aula

**Caminho:** `src/data/lessons/{curso}/charpter-N.mdx`

> **Nota:** O projeto usa `charpter` (typo intencional mantido por consistência em todo o codebase).

**Estrutura padrão completa do conteúdo:**

```mdx
# Título do Capítulo

Parágrafo introdutório contextualizando o tema, conectando ao capítulo anterior. Deve mencionar brevemente o que foi visto antes e introduzir o que será explorado agora. Use **negrito** para conceitos-chave e termos técnicos na primeira ocorrência.

## Seção Principal 1

Explicação teórica com termos em **negrito** e *itálico* para conceitos-chave.

> Citação/destaque para definições importantes ou resumos que o aluno deve memorizar.

<NomeDaVisualizacao />

Parágrafo após a visualização explicando o que o aluno deve observar nela.

<MarkdownTable
  headers={["Coluna 1", "Coluna 2", "Coluna 3"]}
  rows={[
    ["**Termo**", "Descrição", "Detalhe"],
    ["**Termo 2**", "Descrição 2", "Detalhe 2"],
  ]}
/>

## Seção Principal 2

... mais conteúdo ...

### Subseção 2.1

... detalhes ...

<OutraVisualizacao />

<MarkdownTable
  headers={["Header 1", "Header 2"]}
  rows={[
    ["Valor 1", "Valor 2"],
  ]}
/>

> Blockquotes para pontos-chave, definições ou resumos parciais.

## Seção Principal 3

... conteúdo ...

## Resumo da Aula

Neste capítulo, exploramos/estudamos [tema]:

- **Ponto 1:** Descrição resumida do conceito mais importante.
- **Ponto 2:** Descrição resumida.
- **Ponto 3:** Descrição resumida.
- **Ponto 4:** Descrição resumida.
- **Ponto 5:** Descrição resumida.
- **Ponto 6:** Descrição resumida.
```

**Boas práticas do conteúdo MDX:**
- H1 (`#`) apenas para o título principal — UM por arquivo
- H2 (`##`) para seções principais (4–8 por aula)
- H3 (`###`) para subseções dentro de H2
- Usar `<MarkdownTable>` para TODAS as tabelas (nunca markdown table nativo)
- Inserir visualizações p5.js **entre** o texto explicativo — antes ou depois da teoria que ilustram
- Usar blockquotes (`>`) para definições-chave, resumos parciais ou "regras" que o aluno deve guardar
- Finalizar SEMPRE com "## Resumo da Aula" com bullets usando **negrito** no início
- Linguagem direta, formal mas acessível para estudantes de engenharia
- Primeiro parágrafo sempre conecta ao capítulo anterior ("No capítulo anterior, vimos que...")
- Conceitos técnicos em inglês entre parênteses na primeira menção: **melhor esforço** (*best-effort*)
- Listas com `-` para items, numéricas com `1.` quando a ordem importa
- Analogias do mundo real para facilitar compreensão (correios, casas, etc.)

**Componente MarkdownTable — Interface e uso:**
```tsx
interface MarkdownTableProps {
  headers: string[];       // Array de strings para os cabeçalhos
  rows: string[][];        // Array de arrays de strings para as linhas
  className?: string;      // Classe CSS opcional
  showRowCount?: boolean;  // Mostra "Total: N registros" no rodapé
}

// Suporta markdown inline nas células:
// **negrito** → renderiza como <strong> azul
// *itálico* → renderiza como <em>
// `código` → renderiza como <code> com fundo cinza
```

**Exemplo real de uso do MarkdownTable:**
```mdx
<MarkdownTable
  headers={["Aspecto", "UDP (Sem Conexão)", "TCP (Orientado a Conexão)"]}
  rows={[
    ["**Identificação do socket**", "2-tupla: (IP dest, Porta dest)", "4-tupla: (IP orig, Porta orig, IP dest, Porta dest)"],
    ["**Sockets por porta**", "1 socket por porta — recebe de todos", "1 socket por conexão — cada cliente tem o seu"],
    ["**Uso de recursos**", "Mínimo — poucos sockets abertos", "Pode ser alto — 1 socket por cliente conectado"],
  ]}
/>
```

### 4. Criar o quiz da aula

**Caminho:** `src/data/quizzes/{curso}/quiz-N.json`

**Schema completo do quiz (tipos TypeScript de referência):**
```typescript
type Alternative = {
  id: string;          // "a1", "a2", "a3", "a4"
  text: string;        // Texto da alternativa
  isCorrect: boolean;  // Apenas UMA true por questão
  explanation?: string; // Explicação mostrada ao revisar (SEMPRE incluir)
};

type Question = {
  id: string;          // "q1", "q2", ..., "q10"
  question: string;    // Texto da pergunta
  alternatives: Alternative[];  // EXATAMENTE 4 alternativas
};

type Quiz = {
  id: string;          // "quiz-N" — deve casar com quizId no module.json
  title: string;       // "Quiz — Título do Capítulo"
  description: string; // Descrição breve do que o quiz cobre
  timeLimit: number;   // 900 (15 minutos) — SEMPRE 900
  questions: Question[];  // EXATAMENTE 10 questões
};
```

**Exemplo real completo de uma questão:**
```json
{
  "id": "q5",
  "question": "Por que o DNS utiliza o protocolo UDP em vez de TCP?",
  "alternatives": [
    {
      "id": "a1",
      "text": "Porque o DNS precisa de entrega confiável e o UDP garante isso",
      "isCorrect": false,
      "explanation": "O UDP não garante entrega confiável. O DNS usa UDP por outros motivos."
    },
    {
      "id": "a2",
      "text": "Porque o DNS só funciona em redes locais onde não há perdas",
      "isCorrect": false,
      "explanation": "O DNS funciona em toda a Internet, não apenas em redes locais. Perdas podem ocorrer e o cliente simplesmente reenvia a consulta."
    },
    {
      "id": "a3",
      "text": "Porque as consultas DNS são pequenas, independentes, e a velocidade é crítica — se a resposta não chegar, o cliente reenvia",
      "isCorrect": true,
      "explanation": "Correto! Consultas DNS são geralmente < 512 bytes, cada consulta é independente, e a velocidade é essencial pois toda navegação web começa com DNS. Se a resposta não chegar, o cliente simplesmente reenvia."
    },
    {
      "id": "a4",
      "text": "Porque o TCP não suporta o formato de mensagens do DNS",
      "isCorrect": false,
      "explanation": "O TCP suporta DNS perfeitamente (e é usado para transferências de zona e respostas grandes). O UDP é preferido por eficiência."
    }
  ]
}
```

**Convenções obrigatórias do quiz:**
- `timeLimit`: SEMPRE 900 segundos (15 minutos)
- EXATAMENTE 10 questões por quiz (`q1`–`q10`)
- EXATAMENTE 4 alternativas por questão (`a1`–`a4`)
- Apenas 1 correta (`isCorrect: true`) por questão — as outras 3 são `false`
- TODA alternativa tem `explanation` (mostrada ao revisar respostas)
- Explicação da correta começa com "Correto! ..." e expande o conceito
- Explicação das incorretas explica **por que está errada** e qual seria o correto
- IDs sequenciais: `q1`–`q10` para questões, `a1`–`a4` para alternativas
- A posição da alternativa correta DEVE VARIAR (não sempre a2 ou a3)
- Misturar tipos de questões:
  - Conceituais: "O que é...", "Qual é a principal..."
  - Práticas/cenário: "Um servidor recebe 3 clientes...", "Dois segmentos chegam..."
  - Comparativas: "Qual a diferença entre...", "Por que X usa Y em vez de Z?"
  - Verdadeiro/Falso reformuladas: "Qual das afirmações é VERDADEIRA?"

**Validações automáticas (feitas por `validateQuizData`):**
- Quiz deve ter `id`, `title`, `description` (strings não vazias)
- `timeLimit` deve ser número positivo
- `questions` deve ser array não vazio
- Cada questão deve ter `id`, `question` (strings), e `alternatives` (array)
- Sem IDs duplicados (nem de questões, nem de alternativas dentro de uma questão)
- Pelo menos 1 alternativa correta por questão
- Pelo menos 2 alternativas por questão

### 5. Registrar a aula no module.json

**Caminho:** `src/data/lessons/{curso}/module.json`

O arquivo tem a seguinte estrutura (array de módulos):

```json
[
  {
    "id": "nome-do-modulo",
    "title": "Título do Módulo",
    "description": "Descrição do módulo.",
    "lessons": [
      {
        "id": "charpter-1",
        "title": "Título do Capítulo 1",
        "description": "Descrição curta.",
        "video": null,
        "quizId": "quiz-1"
      }
    ]
  }
]
```

Adicionar ao array `lessons` do módulo correspondente:

```json
{
  "id": "charpter-N",
  "title": "Título do Capítulo",
  "description": "Descrição curta do conteúdo abordado (1-2 frases).",
  "video": null,
  "quizId": "quiz-N"
}
```

**Campos:**
- `id`: DEVE corresponder ao nome do arquivo MDX (sem extensão) → `charpter-N`
- `title`: título exibido na sidebar e na página
- `description`: resumo curto para listagem e SEO (máx ~200 caracteres)
- `video`: `{ thumbnail: string, duration: number, url: string }` ou `null` se não houver vídeo
- `quizId`: DEVE corresponder ao `id` dentro do arquivo JSON do quiz → `quiz-N`

**Exemplo real do module.json atual (redes-de-computadores):**
```json
[
  {
    "id": "camada-de-transporte",
    "title": "Camada de Transporte",
    "description": "Compreenda a camada de transporte do modelo TCP/IP: comunicação lógica entre processos, multiplexação/demultiplexação, e os protocolos TCP e UDP.",
    "lessons": [
      {
        "id": "charpter-1",
        "title": "Introdução aos Serviços e Protocolos de Transporte",
        "description": "Função da camada de transporte, distinção entre camada de transporte e de rede, analogia das casas e cartas, e introdução aos protocolos TCP e UDP.",
        "video": null,
        "quizId": "quiz-1"
      },
      {
        "id": "charpter-2",
        "title": "Multiplexação e Demultiplexação",
        "description": "Como um host gerencia múltiplos fluxos de dados: multiplexação no emissor, demultiplexação no receptor, demux UDP (porta destino) e demux TCP (4-tupla).",
        "video": null,
        "quizId": "quiz-2"
      },
      {
        "id": "charpter-3",
        "title": "Protocolo UDP",
        "description": "O UDP como protocolo de melhor esforço: vantagens (baixa latência, sem handshake, cabeçalho pequeno), casos de uso (streaming, DNS, SNMP, HTTP/3), estrutura do segmento e mecanismo de checksum.",
        "video": null,
        "quizId": "quiz-3"
      }
    ]
  }
]
```

### 6. Verificar o build

```bash
npx next build
```

**Não é necessário** criar rotas — o dynamic route `src/app/(sidebar)/{curso}/[slug]/page.tsx` resolve automaticamente qualquer novo `charpter-N`.

---

## Checklist Rápido

- [ ] Componente p5.js criado em `src/components/{nome}-p5-examples.tsx`
- [ ] Componentes importados e registrados em `mdx-components.tsx` (import + useMDXComponents)
- [ ] Arquivo MDX criado em `src/data/lessons/{curso}/charpter-N.mdx`
- [ ] Quiz criado em `src/data/quizzes/{curso}/quiz-N.json` (10 questões, 4 alternativas cada)
- [ ] Aula registrada em `src/data/lessons/{curso}/module.json` (nova entrada no array lessons)
- [ ] Build executado com sucesso

---

## Arquivos por Aula

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `src/components/{nome}-p5-examples.tsx` | **CRIAR** | 4–8 visualizações p5.js |
| `src/data/lessons/{curso}/charpter-N.mdx` | **CRIAR** | Conteúdo MDX da aula |
| `src/data/quizzes/{curso}/quiz-N.json` | **CRIAR** | Quiz com 10 questões |
| `src/data/lessons/{curso}/module.json` | **EDITAR** | Adicionar entrada no array lessons |
| `mdx-components.tsx` | **EDITAR** | Adicionar import + registrar componentes |

Total: **3 arquivos novos** + **2 arquivos editados** por aula.

---

## Referência: Estrutura Atual do mdx-components.tsx

O arquivo `mdx-components.tsx` na raiz do projeto segue este padrão:

```tsx
// === IMPORTS ===
import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import React, { ReactNode } from "react";
import { createHighlighter, Highlighter } from "shiki";
import theme from "./src/app/syntax-theme.json";
import { P5Sketch } from "./src/components/p5-sketch";
import { MarkdownTable } from "./src/components/MarkdownTable";

// Imports de p5 por curso/módulo (um bloco por arquivo de componente):
import { Comp1, Comp2 } from "./src/components/{nome}-p5-examples";
// ... mais imports ...

// === FUNÇÕES INTERNAS (não alterar) ===
// getTextContent, generateId, getHighlighter, CodeBlock

// === COMPONENTES MDX ===
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ..., h2: ..., h3: ..., h4: ...,  // Headings com id automático
    img: ...,                              // Imagens com suporte a dark/light
    pre: ...,                              // Code blocks com syntax highlighting

    // Componentes reutilizáveis:
    P5Sketch,
    MarkdownTable,

    // Componentes p5 por aula (ordem de adição):
    // ... curso 1 ...
    // ... curso 2 ...
    Comp1,
    Comp2,
    // NOVOS COMPONENTES VÃO AQUI ↑

    ...components,  // ← SEMPRE ÚLTIMO
  };
}
```

---

## Referência: Exemplo Completo de MDX (Capítulo Real)

Abaixo está a estrutura do `charpter-2.mdx` (Multiplexação e Demultiplexação) como referência de tamanho e estilo:

```mdx
# Multiplexação e Demultiplexação

No capítulo anterior, vimos que a camada de transporte fornece **comunicação lógica entre processos**. Mas como exatamente um host com dezenas de aplicações rodando simultaneamente — navegador, e-mail, streaming, jogos — consegue **enviar e receber dados** de todas elas ao mesmo tempo, usando uma única conexão de rede? [...]

## O Problema: Múltiplos Processos, Uma Rede

[Parágrafo contextualizando o problema]

> Como **combinar** dados de múltiplos processos para envio (multiplexação) e **distribuir** os dados recebidos ao processo correto (demultiplexação)?

## Multiplexação no Emissor

[Explicação teórica com lista numerada]

<MultiplexingSender />

### O Papel do Cabeçalho de Transporte

<SegmentHeaderPorts />

<MarkdownTable
  headers={["Campo", "Tamanho", "Função na Multiplexação/Demultiplexação"]}
  rows={[
    ["**Porta de Origem**", "16 bits (0–65535)", "Identifica o processo remetente..."],
    ["**Porta de Destino**", "16 bits (0–65535)", "Identifica o processo destinatário..."],
  ]}
/>

> Sem os números de porta no cabeçalho, a camada de transporte não teria como saber para qual processo entregar os dados.

## Demultiplexação no Receptor

[Explicação]

<DemultiplexingReceiver />

### Como o Socket é Identificado?

<MarkdownTable
  headers={["Protocolo", "Identificação do Socket", "Campos Utilizados"]}
  rows={[
    ["**UDP**", "Apenas pela **porta de destino**", "IP destino + Porta destino (2-tupla)"],
    ["**TCP**", "Pela **4-tupla completa**", "IP origem + Porta origem + IP destino + Porta destino"],
  ]}
/>

## Demultiplexação sem Conexão (UDP)

[Explicação detalhada com subseções]

<UDPDemultiplexing />

### Consequência Importante

[Exemplo com tabela de datagramas]

## Demultiplexação Orientada a Conexão (TCP)

<TCPDemultiplexing />

### Por que a 4-Tupla?

[Explicação com tabela de conexões]

## Comparação: UDP vs TCP na Demultiplexação

<UDPvsTCPDemuxComparison />

<MarkdownTable
  headers={["Aspecto", "UDP (Sem Conexão)", "TCP (Orientado a Conexão)"]}
  rows={[
    ["**Identificação do socket**", "2-tupla: (IP dest, Porta dest)", "4-tupla: ..."],
    [...mais linhas...],
  ]}
/>

## Exemplo Prático: Servidor Web com Múltiplos Clientes

[Cenário real consolidando todos os conceitos]

## Resumo da Aula

Neste capítulo, exploramos os mecanismos de multiplexação e demultiplexação:

- **Multiplexação (emissor):** A camada de transporte coleta dados de múltiplos sockets...
- **Demultiplexação (receptor):** A camada de transporte examina a porta de destino...
- **Campos essenciais:** Porta de origem (16 bits) e porta de destino (16 bits)...
- **UDP (sem conexão):** A demultiplexação usa apenas a **porta de destino**...
- **TCP (orientado a conexão):** A demultiplexação usa a **4-tupla completa**...
- **Consequência prática:** Um servidor TCP cria um novo socket para cada cliente...
```

**Observações sobre o MDX:**
- Tamanho típico: 150–300 linhas
- 4–8 visualizações p5.js por aula
- 4–10 tabelas MarkdownTable por aula
- 2–6 blockquotes por aula
- Sempre termina com "Resumo da Aula" em bullets
- Cada seção H2 costuma ter 1-2 visualizações e/ou 1-2 tabelas

---

## Referência: Exemplo Completo de Quiz (Quiz Real)

Abaixo está a estrutura completa do `quiz-2.json` como referência:

```json
{
  "id": "quiz-2",
  "title": "Quiz — Multiplexação e Demultiplexação",
  "description": "Teste seus conhecimentos sobre multiplexação no emissor, demultiplexação no receptor, demultiplexação UDP (sem conexão) e TCP (orientada a conexão com 4-tupla).",
  "timeLimit": 900,
  "questions": [
    {
      "id": "q1",
      "question": "O que é multiplexação no contexto da camada de transporte?",
      "alternatives": [
        { "id": "a1", "text": "Dividir um segmento grande em vários segmentos menores para transmissão", "isCorrect": false, "explanation": "Isso se chama fragmentação, não multiplexação. A multiplexação trata de combinar dados de múltiplos processos." },
        { "id": "a2", "text": "Coletar dados de múltiplos sockets, encapsulá-los em segmentos com cabeçalho (portas) e entregá-los à camada de rede", "isCorrect": true, "explanation": "Correto! A multiplexação no emissor recolhe dados de vários processos (sockets), adiciona cabeçalhos com portas de origem e destino, e entrega tudo à camada de rede." },
        { "id": "a3", "text": "Enviar o mesmo segmento para múltiplos destinatários simultaneamente", "isCorrect": false, "explanation": "Isso seria multicast ou broadcast, não multiplexação de transporte." },
        { "id": "a4", "text": "Criptografar dados de múltiplas aplicações em um único fluxo seguro", "isCorrect": false, "explanation": "Criptografia é função do TLS/SSL, não do mecanismo de multiplexação da camada de transporte." }
      ]
    },
    "... mais 9 questões seguindo o mesmo padrão ..."
  ]
}
```

**Distribuição ideal de respostas corretas no quiz:**
- q1: a2, q2: a3, q3: a2, q4: a3, q5: a2, q6: a2, q7: a3, q8: a2, q9: a2, q10: a2
- Variar! Não colocar todas as corretas na mesma posição. Ideal: ~2-3 em a1, ~3-4 em a2, ~2-3 em a3, ~1-2 em a4

---

## Referência: Nomenclatura de Arquivos p5

Exemplos reais do projeto:

| Aula | Arquivo p5 | Nº Visualizações |
|------|-----------|-------------------|
| Introdução à Camada de Transporte | `transport-layer-p5-examples.tsx` | 6 |
| Multiplexação e Demultiplexação | `multiplexing-demux-p5-examples.tsx` | 6 |
| Protocolo UDP | `udp-protocol-p5-examples.tsx` | 6 |

Padrão: `{tema-em-kebab-case}-p5-examples.tsx`

---

## Referência: Nomes de Componentes p5

Os nomes dos componentes exportados devem ser em PascalCase e descritivos:

| Arquivo | Componentes Exportados |
|---------|----------------------|
| `transport-layer-p5-examples.tsx` | `LogicalCommunication`, `HouseLetterAnalogy`, `TransportVsNetworkLayer`, `TCPvsUDP`, `MultiplexingDemux`, `SegmentEncapsulation` |
| `multiplexing-demux-p5-examples.tsx` | `MultiplexingSender`, `DemultiplexingReceiver`, `UDPDemultiplexing`, `TCPDemultiplexing`, `UDPvsTCPDemuxComparison`, `SegmentHeaderPorts` |
| `udp-protocol-p5-examples.tsx` | `UDPBestEffort`, `UDPNoHandshake`, `UDPSegmentStructure`, `UDPChecksumDemo`, `UDPUseCases`, `UDPvsTPHeaderSize` |

Padrão: PascalCase, sem prefixo de curso, descritivo do conceito visualizado.

---

## Sequência de Capítulos Existentes (Camada de Transporte)

Para manter continuidade entre capítulos:

| # | Capítulo | Conceitos-chave | Conecta ao próximo com... |
|---|---------|----------------|--------------------------|
| 1 | Introdução aos Serviços e Protocolos de Transporte | Comunicação lógica, transporte vs rede, analogia casas/cartas, TCP vs UDP, mux/demux, portas, encapsulamento | "Vimos multiplexação/demultiplexação brevemente; no próximo capítulo, aprofundaremos" |
| 2 | Multiplexação e Demultiplexação | Mux no emissor, demux no receptor, demux UDP (porta destino), demux TCP (4-tupla), socket de boas-vindas | "Vimos que UDP usa apenas porta de destino; agora vamos estudar o UDP em profundidade" |
| 3 | Protocolo UDP | UDP melhor esforço, vantagens (sem handshake, cabeçalho 8B, sem congestionamento), casos de uso (DNS, streaming, SNMP, HTTP/3), estrutura do segmento, checksum | Próximo capítulo deve conectar ao tema seguinte |

> O primeiro parágrafo de cada capítulo SEMPRE referencia o capítulo anterior para criar continuidade narrativa.
