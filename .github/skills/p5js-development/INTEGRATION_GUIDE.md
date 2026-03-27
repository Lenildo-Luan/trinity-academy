# Integration with Trinity Academy Copilot Instructions

This document maps how the new p5js-development skill integrates with Trinity Academy's existing copilot instructions and project conventions.

---

## Where P5.js Development Fits

The existing `copilot-instructions.md` already documents:

✓ Build/test/lint commands  
✓ Route organization (auth, centered, sidebar layouts)  
✓ MDX content system (lessons, metadata, loading)  
✓ **P5.js Integration Pattern** (component-based wrapper)  
✓ Supabase integration  
✓ Component conventions  
✓ Shared utilities and hooks  

**New:** The `p5js-development` skill now formalizes and extends the P5.js section with:
- Detailed workflow for reading specifications
- Complete implementation patterns
- State management best practices
- Integration checklist
- Quality validation

---

## Alignment with Existing P5.js Section

### From copilot-instructions.md (P5.js Integration Pattern):

```
**Core wrapper** (`src/components/p5-sketch.tsx`):
- Generic reusable component that accepts setup(), draw(), mousePressed() callbacks
- Client-side only (uses dynamic import)
- Manages p5 instance lifecycle with proper cleanup

**Specialized components** (34+ files like `routing-fundamentals-p5-examples.tsx`):
- Domain-specific visualizations for each course topic
- Export multiple named components
- Used directly in MDX via mdx-components.tsx registration

**To add a new P5 visualization**:
1. Create component in `src/components/[topic]-p5-examples.tsx`
2. Use `<P5Sketch>` wrapper with setup/draw functions
3. Export the component
4. Register in `mdx-components.tsx`
5. Use directly in lesson MDX files
```

### Enhanced by p5js-development Skill:

Now developers have:
- **Step-by-step instructions** for each phase (Steps 1–12)
- **Specification parsing** — how to extract and understand {{ }} blocks
- **Code patterns** — 4 ready-to-use patterns (static, animation, interactive, step-by-step)
- **State management rules** — when/how to use `useRef` vs `useState`
- **Color & typography** — exact RGB mappings from Trinity's Tailwind palette
- **Accessibility checklist** — WCAG AA compliance, motion sensitivity, keyboard support
- **Testing & validation** — performance, responsiveness, memory leaks

---

## File Organization (Existing + New)

### Existing Structure

```
src/
├── components/
│   ├── p5-sketch.tsx                    ← Generic wrapper
│   ├── routing-fundamentals-p5-examples.tsx
│   ├── image-digitization-p5-examples.tsx
│   └── [34+ other -p5-examples.tsx files]
├── data/lessons/[course]/
│   └── [slug].mdx                       ← Lesson content
└── ...

mdx-components.tsx                       ← Component registry
```

### New Additions

```
.github/
├── agents/
│   ├── writer.agent.md                  ← Existing
│   ├── design-annotator.agent.md        ← Existing
│   └── p5js-developer.agent.md          ← NEW
├── skills/
│   ├── educational-writer/              ← Existing
│   ├── visual-design-annotator/         ← Existing
│   └── p5js-development/                ← NEW
│       ├── SKILL.md                     ← Core instructions
│       ├── README.md                    ← Quick start
│       ├── VISUALIZATION_TYPES.md       ← Type reference
│       └── references/                  ← (Optional) worked examples
└── VISUAL_DEVELOPMENT_PIPELINE.md       ← NEW: Full pipeline overview
```

---

## Component Conventions (Unified)

From copilot-instructions.md + p5js-development skill:

### File Naming
- **Existing rule:** Lowercase with hyphens (`sidebar-layout.tsx`)
- **P5 specific:** `[topic]-p5-examples.tsx` (e.g., `routing-fundamentals-p5-examples.tsx`)

### Component Structure
- **Existing rule:** Functional components with TypeScript
- **P5 specific:**
  ```typescript
  "use client";  // required for p5
  export function MyVisualization() { }  // named export, not default
  ```

### Styling
- **Existing rule:** Tailwind CSS only, no CSS modules
- **P5 specific:** Canvas styling handled in p5 setup (`p.createCanvas()`, `p.background()`)
  - React wrapper uses Tailwind for layout/controls (`flex`, `gap`, `rounded`, etc.)

### TypeScript
- **Existing rule:** Strict mode, no `any` types
- **P5 specific:** `import type p5 from "p5"` and type all callbacks: `(p: p5) => void`

### Registration
- **Existing rule:** Import in `mdx-components.tsx`, add to `useMDXComponents()`
- **P5 specific:** **Named exports only** (no default exports from component files)

---

## MDX Usage Pattern

### Before (without specs)

```mdx
# My Lesson

Here is some content...

<MyComponent />
```

### After (with specs workflow)

1. **Writer creates** lesson in MDX
2. **Design Annotator annotates** with {{ }} specs
3. **P5.js Developer implements** from specs
4. **MDX references** by component name

```mdx
# My Lesson

Here is some educational explanation...

<VisualizationName />

This visualization shows how...
```

---

## State Management (P5 + React)

### Key Rule from copilot-instructions.md

> "`"use client"` directive for interactive components (auth, P5, quiz)"

### Extended by p5js-development Skill

**For p5 visualizations:**

```typescript
"use client";  // REQUIRED

import { useRef, useState } from "react";
import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

export function MyComponent() {
  // State for animated/interactive visuals
  const stateRef = useRef({
    frameCount: 0,
    animating: true,
    // Use useRef (NOT useState) for p5-internal state
  });

  // React state for external controls (sliders, buttons)
  const [speed, setSpeed] = useState(5);

  const setup = (p: p5) => {
    // Initialize p5
  };

  const draw = (p: p5) => {
    // Read both stateRef and speed here
    const state = stateRef.current;
    // speed is in closure scope
  };

  return (
    <div>
      <P5Sketch setup={setup} draw={draw} />
      {/* React controls here, using speed/setSpeed */}
    </div>
  );
}
```

**Why useRef for p5 state:**
- p5 runs in a loop independent of React
- `useState` causes re-renders, breaking p5 instance
- `useRef` persists across frames without triggering React re-renders

---

## Shared Utilities (Hooks & Types)

From copilot-instructions.md:

```
**Hooks** (`src/hooks/`):
- useAuth() — Global auth state
- useQuizState() — Quiz management
- useUserProfile() — User data
- ... others
```

**For p5 components:**
- Generally **don't** use these hooks directly in p5 component setup/draw
- Can use them in outer component for context, then pass values to p5 via `useRef`

Example:

```typescript
import { useAuth } from "@/hooks/useAuth";

export function MyComponent() {
  const { user } = useAuth();  // React hook
  const stateRef = useRef({ userId: user?.id });

  const setup = (p: p5) => { /* ... */ };
  const draw = (p: p5) => {
    // Access userId: stateRef.current.userId
  };
}
```

---

## Build & Test Commands

From copilot-instructions.md, all existing commands still apply:

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
npm run format           # Prettier + import organization + Tailwind sorting
npx vitest              # Run tests
```

**For p5 components:**
- **No new build steps needed** — components are standard TypeScript/React
- **TypeScript:** Run `npm run lint` to catch type errors
- **Formatting:** Run `npm run format` to auto-organize imports and Tailwind classes

---

## Language & Localization

From copilot-instructions.md:

> "Content language: Lessons are primarily in Portuguese (Brazil)"

**For p5 components:**
- Code comments: English or Portuguese (follow existing file pattern)
- Canvas text labels: Follow spec language (usually PT-BR for Trinity lessons)
- Component names: English (CamelCase)

Example:

```typescript
// código em português (comentário)
p.fill(59, 130, 246);
p.text("Índice: 5", 100, 200);  // PT-BR text on canvas

export function BubbleSortAnimacao() { /* ... */ }  // Component name in English
```

---

## Turbopack & Performance Considerations

From copilot-instructions.md:

> "Turbopack enabled: Next.js uses Turbopack for faster builds"

**For p5 components:**
- Dynamic import of p5 library is already handled in `p5-sketch.tsx`
- No additional performance optimizations needed in component files
- Focus on:
  - Efficient `draw()` function (runs 60 FPS)
  - Avoid heavy computations per frame
  - Use `useRef` instead of `useState` to avoid React re-renders

---

## Version Context

From copilot-instructions.md:

- **React 19** — Latest React features available
- **Tailwind v4** — Latest version with `@tailwindcss/postcss`
- **Next.js 15+** — App Router (already in use)

**For p5 components:**
- All existing features (React hooks, Tailwind utilities) available
- p5.js library is dynamically imported client-side

---

## Summary of Alignment

| Aspect | From copilot-instructions.md | Extended by p5js-development |
|--------|------------------------------|------------------------------|
| **File structure** | Component locations | `-p5-examples.tsx` naming |
| **Component pattern** | Functional + TypeScript | `useRef` for state |
| **Styling** | Tailwind CSS only | p5 canvas + Tailwind wrapper |
| **Registration** | `mdx-components.tsx` | Named exports only |
| **Interaction** | `"use client"` directive | Setup/draw/mousePressed callbacks |
| **Build/lint** | npm commands | Same commands (no changes) |
| **Language** | PT-BR for content | PT-BR text on canvas, English code |
| **Accessibility** | General support | WCAG AA for p5 visuals |

---

## Next Steps

1. **Review existing p5 components** in `src/components/` to see patterns
2. **Read the full p5js-development skill** (`SKILL.md`) for step-by-step instructions
3. **Use the visualization types reference** (`VISUALIZATION_TYPES.md`) to choose the right pattern
4. **Follow the pipeline** (writer → design-annotator → p5js-developer)

---

## Questions?

- **How do I structure a component?** → See SKILL.md Step 2
- **What color do I use?** → See VISUALIZATION_TYPES.md color table or SKILL.md Step 6
- **How do I handle state?** → See SKILL.md Step 2, use `useRef` pattern
- **How do I register it?** → See SKILL.md Step 10
- **What's the full pipeline?** → See VISUAL_DEVELOPMENT_PIPELINE.md

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Aligned with:** copilot-instructions.md + Trinity Project Standards

