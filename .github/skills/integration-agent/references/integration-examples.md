# Integration Examples

This file contains real examples of successful integrations in Trinity Academy, showing exactly what the integration agent must produce.

---

## Example 1: Complete Integration for "DNS Protocol" Lesson

This example shows a complete lesson integration with content, visuals, and quiz.

### Input State

```typescript
const integrationState = {
  course: "redes-de-computadores",
  chapterId: "dns-protocol",
  chapterTitle: "Protocolo DNS",
  description: "Entenda como o DNS traduz nomes de domínio em endereços IP",
  quizId: "quiz-dns-protocol",
  mdxContent: "... full MDX content with <DNSQueryVisualization /> component ...",
  p5ComponentsCode: "... full TSX file with named exports ...",
  p5ComponentNames: ["DNSQueryVisualization", "DNSZoneVisualizer"],
  quizData: { id: "quiz-dns-protocol", ... }
}
```

### Step 2: Files Created

**1. `src/components/dns-protocol-p5-examples.tsx`**
```typescript
"use client";

import React, { useRef } from "react";
import P5Sketch from "./p5-sketch";

export function DNSQueryVisualization() {
  // Implementation...
}

export function DNSZoneVisualizer() {
  // Implementation...
}
```

**2. `src/data/lessons/redes-de-computadores/dns-protocol.mdx`**
```mdx
# Protocolo DNS

DNS (Domain Name System) é o protocolo responsável...

<DNSQueryVisualization />

## Resolvendo Nomes de Domínio

Quando você acessa um site...

<DNSZoneVisualizer />

## Quiz

[Quiz content...]
```

**3. `src/data/quizzes/redes-de-computadores/quiz-dns-protocol.json`**
```json
{
  "id": "quiz-dns-protocol",
  "courseId": "redes-de-computadores",
  "title": "Quiz: Protocolo DNS",
  "description": "Teste seu entendimento do DNS",
  "timeLimit": 600,
  "questions": [
    {
      "id": "q1",
      "text": "O que o DNS traduz?",
      "type": "single-choice",
      "options": [...],
      "correctAnswer": "opt-1",
      "explanation": "..."
    }
  ]
}
```

### Step 3: module.json Updated

**Before:**
```json
[
  {
    "id": "camada-aplicacao",
    "name": "Camada de Aplicação",
    "lessons": [
      {
        "id": "http-protocol",
        "title": "Protocolo HTTP",
        "description": "...",
        "video": null,
        "quizId": "quiz-http"
      }
    ]
  }
]
```

**After:** (new lesson appended)
```json
[
  {
    "id": "camada-aplicacao",
    "name": "Camada de Aplicação",
    "lessons": [
      {
        "id": "http-protocol",
        "title": "Protocolo HTTP",
        "description": "...",
        "video": null,
        "quizId": "quiz-http"
      },
      {
        "id": "dns-protocol",
        "title": "Protocolo DNS",
        "description": "Entenda como o DNS traduz nomes de domínio em endereços IP",
        "video": null,
        "quizId": "quiz-dns-protocol"
      }
    ]
  }
]
```

### Step 4: mdx-components.tsx Updated

**Before:**
```typescript
import { DijkstraRoutingStepSimulator } from "./src/components/routing-fundamentals-p5-examples";
import { HttpRequestVisualization } from "./src/components/http-protocol-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DijkstraRoutingStepSimulator,
    HttpRequestVisualization,
    ...components,
  };
}
```

**After:** (new imports and registrations)
```typescript
import { DijkstraRoutingStepSimulator } from "./src/components/routing-fundamentals-p5-examples";
import { HttpRequestVisualization } from "./src/components/http-protocol-p5-examples";
import { DNSQueryVisualization, DNSZoneVisualizer } from "./src/components/dns-protocol-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DijkstraRoutingStepSimulator,
    HttpRequestVisualization,
    DNSQueryVisualization,
    DNSZoneVisualizer,
    ...components,
  };
}
```

### Step 5: Build Validation

```bash
$ npx next build
▲ Next.js 15.1.2

✓ Compiled successfully
✓ Linting and checking validity of types
  ✓ Test files created 0
  ✓ Creating an optimized production build
✓ Running tests
  ✓ All tests passed

✓ Export successful. Files written to `.next`
```

Exit code: 0 ✅

### Step 6: Success Report

```json
{
  "success": true,
  "timestamp": "2026-03-28T10:15:42Z",
  "files_created": [
    "src/components/dns-protocol-p5-examples.tsx",
    "src/data/lessons/redes-de-computadores/dns-protocol.mdx",
    "src/data/quizzes/redes-de-computadores/quiz-dns-protocol.json"
  ],
  "files_updated": [
    "src/data/lessons/redes-de-computadores/module.json",
    "mdx-components.tsx"
  ],
  "lesson_url": "/redes-de-computadores/dns-protocol",
  "summary": "✅ Lesson created successfully. 3 files created, 2 files updated. Build passed. Lesson live at /redes-de-computadores/dns-protocol"
}
```

---

## Example 2: Error Scenario — Duplicate Component Registration

This example shows how the integration agent handles an error.

### Error Condition

During Step 4 (Update mdx-components.tsx), the agent detects that one of the component names already exists in the file:

**Component to register:** `HTTPRequest`
**Found in existing code:** `import { HTTPRequest } from "./src/components/http-protocol-p5-examples";`

### Error Report

```json
{
  "success": false,
  "error_type": "DuplicateComponentError",
  "error_message": "Component name 'HTTPRequest' already registered in mdx-components.tsx",
  "failed_at_step": 4,
  "location": {
    "file": "mdx-components.tsx",
    "component": "HTTPRequest"
  },
  "details": "The component 'HTTPRequest' is already imported and exported from './src/components/http-protocol-p5-examples'. This suggests either a duplicate lesson or a naming conflict.",
  "files_created": [
    "src/components/network-requests-p5-examples.tsx",
    "src/data/lessons/redes-de-computadores/network-requests.mdx",
    "src/data/quizzes/redes-de-computadores/quiz-network-requests.json"
  ],
  "files_updated": [],
  "recovery_steps": [
    "1. Review the p5 component names with the visual agent — ensure no naming conflicts",
    "2. Rename conflicting components (e.g., 'HTTPRequest' → 'HTTPRequestDetailed')",
    "3. Re-run the integration with updated component names",
    "4. If the component is truly a duplicate, reuse the existing component instead of creating new one"
  ]
}
```

---

## Example 3: Error Scenario — Build Failure

This example shows how the agent handles a TypeScript error during build validation.

### Error Condition

Component is registered in mdx-components.tsx but not properly exported from the component file.

### Error Report

```json
{
  "success": false,
  "error_type": "BuildError",
  "error_message": "Build failed with exit code 1",
  "failed_at_step": 5,
  "details": "TypeScript error in mdx-components.tsx:\n  Line 42: Cannot find name 'CachingAnimationV2'. Did you mean 'CachingAnimation'?",
  "files_created": [
    "src/components/caching-concepts-p5-examples.tsx",
    "src/data/lessons/redes-de-computadores/caching-concepts.mdx",
    "src/data/quizzes/redes-de-computadores/quiz-caching.json"
  ],
  "files_updated": [
    "src/data/lessons/redes-de-computadores/module.json"
  ],
  "recovery_steps": [
    "1. Check the actual exported component name in src/components/caching-concepts-p5-examples.tsx",
    "2. The registration lists 'CachingAnimationV2' but the file exports 'CachingAnimation'",
    "3. Update p5ComponentNames to use correct name: ['CachingAnimation'] instead of ['CachingAnimationV2']",
    "4. Re-run integration with corrected component names"
  ]
}
```

---

## Example 4: Metadata Update Edge Case — New Module

This example shows handling a lesson that belongs to a NEW module (rare but possible).

### Scenario

The lesson belongs to a course module that doesn't exist yet in `module.json`.

### Error Report

```json
{
  "success": false,
  "error_type": "ModuleNotFoundError",
  "error_message": "Course module not found in src/data/lessons/redes-de-computadores/module.json",
  "failed_at_step": 3,
  "details": "Looking for module containing lesson 'quantum-networking', but no module with semantic ID 'computacao-quantica' exists. New modules should be created by the course coordinator.",
  "files_created": [
    "src/components/quantum-networking-p5-examples.tsx",
    "src/data/lessons/redes-de-computadores/quantum-networking.mdx",
    "src/data/quizzes/redes-de-computadores/quiz-quantum-networking.json"
  ],
  "files_updated": [],
  "recovery_steps": [
    "1. The lesson files were created successfully",
    "2. To complete integration, contact the course coordinator",
    "3. They should add the new module 'computacao-quantica' to module.json",
    "4. Then add the lesson entry for 'quantum-networking' to that module",
    "5. After module.json is updated, re-run 'npx next build' to confirm"
  ]
}
```

---

## Validation Checklist

Use this checklist when reviewing an integration:

- [ ] **File paths** — All three files created in correct locations
- [ ] **Module.json** — Lesson entry added with correct ID, title, description, quizId
- [ ] **No duplicates** — No duplicate lesson IDs in the module
- [ ] **Quiz reference** — Quiz ID matches the file created
- [ ] **Component registration** — All components imported and exported in mdx-components.tsx
- [ ] **Spread operator** — `...components,` remains last in return object
- [ ] **Imports** — New import added after last p5-examples import
- [ ] **JSON validity** — Quiz JSON is well-formed
- [ ] **Build passes** — `npx next build` exits with code 0
- [ ] **No orphans** — All registered components are actually exported from component file
- [ ] **Accessibility** — Components follow a11y guidelines
- [ ] **Performance** — Build completes in < 120 seconds


