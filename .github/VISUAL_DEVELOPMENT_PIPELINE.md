# Trinity Academy — Visual Development Pipeline

Este documento descreve o pipeline completo de desenvolvimento de visualizações educacionais no projeto Trinity Academy.

---

## Pipeline de 3 Estágios

```
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 1: Writer Agent + educational-writer skill                  │
├─────────────────────────────────────────────────────────────────────┤
│ • Cria artigo educacional em MDX                                    │
│ • Estrutura pedagógica: hook, objetivos, conteúdo, exemplos        │
│ • Output: artigo completo pronto para anotação visual              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 2: Design Annotator Agent + visual-design-annotator skill  │
├─────────────────────────────────────────────────────────────────────┤
│ • Lê artigo completo da Stage 1                                    │
│ • Identifica oportunidades visuais (4 critérios de seleção)       │
│ • Insere especificações em {{ }} blocks                            │
│ • Cada spec contém: TYPE, TITLE, PURPOSE, CANVAS SIZE,            │
│   VISUAL DESCRIPTION, BEHAVIOR, STATES, LABELS, ACCESSIBILITY     │
│ • Output: artigo anotado + design decisions summary               │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 3: P5.js Developer Agent + p5js-development skill          │
├─────────────────────────────────────────────────────────────────────┤
│ • Lê artigo anotado da Stage 2                                     │
│ • Extrai cada {{ }} spec block                                     │
│ • Implementa componentes React + p5.js conforme specs              │
│ • Gerencia state com useRef (não useState)                         │
│ • Registra em mdx-components.tsx                                   │
│ • Output: componentes + mdx-components.tsx atualizado              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                      [Lesson Published]
                   Interactive visualizations
                       live in course
```

---

## Exemplo Prático: Fluxo Completo

### STAGE 1 — Writer Cria Artigo

**Input:** Requisição para escrever capítulo sobre "Pilha de Chamadas"

**Processo:** Writer agent usa `educational-writer` skill para:
- Escrever hook envolvente
- Explicar conceito com clareza
- Oferecer exemplos concretos
- Estruturar pedagogicamente

**Output:** Artigo MDX completo (sem specs ainda):

```markdown
# A Pilha de Chamadas

Quando você chama uma função, onde ela "fica" até terminar? 
Como JavaScript acompanha várias funções rodando ao mesmo tempo?

[... conteúdo educacional completo ...]

A pilha segue o princípio LIFO (Last In, First Out).
Cada vez que uma função é chamada, um novo frame é adicionado no topo.
Quando retorna, o frame é removido.
```

---

### STAGE 2 — Design Annotator Insere Specs

**Input:** Artigo completo da Stage 1

**Processo:** Design annotator agent usa `visual-design-annotator` skill para:
1. Ler artigo inteiro
2. Identificar pontos de alto impacto visual (3 máximo)
3. Escolher tipo de visualização apropriado
4. Escrever specs detalhadas e developer-ready

**Output:** Mesmo artigo com {{ }} blocks inseridos:

```markdown
# A Pilha de Chamadas

[... conteúdo ...]

A pilha segue o princípio LIFO (Last In, First Out).

{{
TYPE: Animation

TITLE: "Call Stack — Push and Pop"

EDUCATIONAL PURPOSE:
Mostrar como funções são adicionadas ao topo da pilha quando chamadas
e removidas quando retornam, reforçando o conceito LIFO.

CANVAS SIZE: 400 × 480

VISUAL DESCRIPTION:
4 retângulos representando stack frames, empilhados verticalmente.
...
[especificação completa com cores RGB, fontes, comportamentos]
}}

Cada vez que uma função é chamada...
```

---

### STAGE 3 — P5.js Developer Implementa Componentes

**Input:** Artigo anotado da Stage 2

**Processo:** P5.js developer agent usa `p5js-development` skill para:
1. Extrair {{ }} block
2. Parsear especificação
3. Implementar componente React + p5.js
4. Registrar em mdx-components.tsx
5. Validar e testar

**Output 1:** Novo arquivo ou atualizar existente — `src/components/[topic]-p5-examples.tsx`:

```typescript
"use client";

import { useRef } from "react";
import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

export function CallStackPushAndPop() {
  const stateRef = useRef({
    frames: [],
    animating: true,
    startTime: 0,
  });

  const setup = (p: p5) => {
    p.createCanvas(400, 480);
    stateRef.current.startTime = p.millis();
  };

  const draw = (p: p5) => {
    const state = stateRef.current;
    p.background(249, 250, 251); // #F9FAFB
    
    // Animação de push/pop conforme spec
    // cores exatas de spec: #374151 (gray-800), #3B82F6 (blue-500)
    // [implementação completa...]
  };

  return <P5Sketch setup={setup} draw={draw} width={400} height={480} />;
}
```

**Output 2:** Atualizar `mdx-components.tsx`:

```typescript
import {
  CallStackPushAndPop,
} from "./src/components/call-stack-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    CallStackPushAndPop,
    // ... existing components
  };
}
```

**Output 3:** Resumo de implementação:

```
## Implementação Concluída

Componente: CallStackPushAndPop
Tipo: Animation
Spec: Call Stack — Push and Pop

✓ Canvas 400×480 (conforme spec)
✓ Cores RGB exatas (#F9FAFB background, #374151 frames, #3B82F6 highlight)
✓ Animação automática com loop
✓ 60 FPS performance validada
✓ Acessibilidade: contrast ratio 4.5:1 (WCAG AA)
✓ Registrado em mdx-components.tsx
✓ Pronto para uso em MDX
```

---

## Estrutura de Arquivos

```
trinity-academy/
├── .github/
│   ├── agents/
│   │   ├── writer.agent.md              ← Stage 1
│   │   ├── design-annotator.agent.md    ← Stage 2
│   │   └── p5js-developer.agent.md      ← Stage 3
│   └── skills/
│       ├── educational-writer/
│       │   └── SKILL.md
│       ├── visual-design-annotator/
│       │   ├── SKILL.md
│       │   └── references/
│       │       └── spec-examples.md
│       └── p5js-development/
│           ├── SKILL.md                 ← Nova
│           └── references/ (opcional)
├── src/
│   ├── components/
│   │   ├── p5-sketch.tsx                ← Wrapper genérico
│   │   ├── [topic]-p5-examples.tsx      ← Componentes específicos por tópico
│   │   │   (routing-fundamentals-p5-examples.tsx, image-digitization-p5-examples.tsx, ...)
│   │   └── ... outros componentes
│   └── data/
│       └── lessons/
│           └── [course]/
│               └── [slug].mdx            ← Artigos com {{ }} specs
└── mdx-components.tsx                    ← Registro de todos os componentes

```

---

## Checklist de Uso Correto

### Para o Writer Agent:
- [ ] Usa skill `educational-writer`
- [ ] Produz artigo pedagogicamente estruturado
- [ ] Linguagem clara e acessível
- [ ] Pronto para next stage (anotação visual)

### Para o Design Annotator Agent:
- [ ] Usa skill `visual-design-annotator`
- [ ] Lê artigo completo antes de anotar
- [ ] Seleciona apenas 1–3 visuais de alto impacto
- [ ] Escreve {{ }} specs com todos os campos obrigatórios
- [ ] Specs são **unambíguas e developer-ready**
- [ ] Insere specs em pontos naturais do artigo (após parágrafos)

### Para o P5.js Developer Agent:
- [ ] Usa skill `p5js-development`
- [ ] Extrai specs com precisão dos {{ }} blocks
- [ ] Implementa conforme spec exatamente (cores, layout, comportamento)
- [ ] Usa `useRef` para state animado, não `useState`
- [ ] Registra componente em `mdx-components.tsx`
- [ ] Valida performance, acessibilidade, TypeScript
- [ ] Entrega resumo claro da implementação

---

## Características Principais da P5.js Skill

### Cobertura Completa:
✓ Leitura e parsing de specs  
✓ Padrões de componentes (static, animation, interactive, step-by-step)  
✓ State management com p5  
✓ Integração com projeto (P5Sketch wrapper, mdx-components.tsx)  
✓ Cores, texto, formas, animações, interação  
✓ Acessibilidade (contrast, motion, keyboard)  
✓ Troubleshooting e quality checklist  

### Padrões Prontos para Usar:
- Pattern 1: Static Illustration
- Pattern 2: Auto-Playing Animation
- Pattern 3: Interactive with React Controls
- Pattern 4: Step-by-Step Animation

### Recursos de Referência:
- p5.js API docs
- Trinity's P5Sketch wrapper
- Existing component examples
- Tailwind color reference

---

## Próximas Etapas Opcionais

1. **Criar arquivo de referências para p5js-development skill**
   - Localização: `.github/skills/p5js-development/references/`
   - Conteúdo: Exemplos worked-out de specs implementadas
   - Padrão: Similar a `visual-design-annotator/references/spec-examples.md`

2. **Criar agent para p5js-developer** ✓ (já feito)
   - Nome: `p5js-developer.agent.md`
   - Descreve: uso obrigatório de `p5js-development` skill

3. **Documentar convenções Trinity em p5js-development skill** ✓ (já feito)
   - Cores Tailwind → RGB conversions
   - Naming patterns para componentes
   - File organization
   - Registration pattern em mdx-components.tsx

---

## Conclusão

Agora você tem um sistema completo e estruturado para:

1. **Escrever** artigos educacionais pedagogicamente sólidos
2. **Anotar** onde visuais agregam valor, com specs detalhadas
3. **Desenvolver** visualizações p5.js production-ready a partir de specs

Cada stage é autossuficiente, mas conectado. Os agentes sabem exatamente o que fazer e quais skills usar. As skills fornecem instruções passo a passo e padrões prontos para uso.

**Resultado:** Visualizações educacionais de alta qualidade, consistentes com a arquitetura Trinity, e prontas para produção.

