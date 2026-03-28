# Integration Pipeline Context

This document provides visual and conceptual context for the integration orchestrator's role in the lesson creation pipeline.

---

## The Complete Lesson Creation Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    LESSON CREATION PIPELINE                     │
└─────────────────────────────────────────────────────────────────┘

PHASE 1: PLANNING & STRATEGY
┌──────────────────────────────────────────┐
│  Lesson Brief / Learning Objectives      │
│  - Topic: "Protocolo DNS"                │
│  - Course: "Redes de Computadores"       │
│  - Objectives: 3-4 specific learning goals│
│  - Prerequisites: Covered courses        │
└──────────────────────────────────────────┘
                    ↓

PHASE 2: CONTENT CREATION
┌──────────────────────────────────────────┐
│  [Content Agent / Writer]                │
│  ✓ Write MDX lesson content              │
│  ✓ Structure with headings, sections     │
│  ✓ Include narrative, explanations       │
│  ✓ Mark visual opportunities with {{}}   │
│  Output: Annotated MDX file              │
└──────────────────────────────────────────┘
                    ↓

PHASE 3: VISUAL DESIGN
┌──────────────────────────────────────────┐
│  [Design Annotator]                      │
│  ✓ Identify high-impact visual spots     │
│  ✓ Write {{ SPEC }} blocks               │
│  ✓ Specify: type, size, behavior, labels│
│  Output: Annotated MDX with specs        │
└──────────────────────────────────────────┘
                    ↓

PHASE 4: VISUALIZATION IMPLEMENTATION
┌──────────────────────────────────────────┐
│  [P5.js Developer Agent]                 │
│  ✓ Parse {{ SPEC }} blocks               │
│  ✓ Build p5.js components                │
│  ✓ Implement setup/draw/interaction      │
│  ✓ Register in mdx-components.tsx        │
│  Output: TSX component file              │
│           + updated mdx-components.tsx   │
└──────────────────────────────────────────┘
                    ↓

PHASE 5: QUIZ CREATION
┌──────────────────────────────────────────┐
│  [Quiz Developer Agent]                  │
│  ✓ Design 8-12 learning questions        │
│  ✓ Create plausible distractors          │
│  ✓ Write educational explanations        │
│  ✓ Validate JSON structure               │
│  Output: Quiz JSON file                  │
└──────────────────────────────────────────┘
                    ↓

PHASE 6: INTEGRATION ⭐ (YOUR ROLE)
┌──────────────────────────────────────────┐
│  [Integration Orchestrator]              │
│  ✓ Receive all upstream outputs          │
│  ✓ Write 3 files atomically              │
│  ✓ Update module.json metadata           │
│  ✓ Register components                   │
│  ✓ Validate Next.js build                │
│  ✓ Report success/failure                │
│  Output: Integrated lesson + report      │
└──────────────────────────────────────────┘
                    ↓

PHASE 7: DEPLOYMENT & PUBLICATION
┌──────────────────────────────────────────┐
│  [Git / GitHub / CI-CD]                  │
│  ✓ Commit integrated files                │
│  ✓ Create PR for review                  │
│  ✓ Run tests and checks                  │
│  ✓ Deploy to staging / production        │
│  Output: Lesson live on Trinity          │
└──────────────────────────────────────────┘
                    ↓

RESULT: Live Lesson with Content + Visuals + Quiz
┌──────────────────────────────────────────┐
│  https://trinity.edu/redes/dns-protocol  │
│                                          │
│  [Content]  [P5 Visualizations]  [Quiz]  │
└──────────────────────────────────────────┘
```

---

## Integration Agent's Responsibilities

Your role is **PHASE 6: INTEGRATION**. You are the bridge between individual agent outputs and a cohesive, tested, deployable lesson.

### What You Receive (Inputs)

```typescript
IntegrationState {
  // Lesson metadata
  course: "redes-de-computadores",
  chapterId: "dns-protocol",
  chapterTitle: "Protocolo DNS",
  description: "Entenda como o DNS...",

  // Content artifact
  mdxContent: "# Protocolo DNS\n\nDNS é...\n\n<DNSQuery />\n...",

  // Visual artifact
  p5ComponentsCode: "export function DNSQuery() { ... }",
  p5ComponentNames: ["DNSQuery", "DNSResolver"],

  // Quiz artifact
  quizData: {
    id: "quiz-dns",
    courseId: "redes-de-computadores",
    title: "Quiz: DNS",
    questions: [...]
  }
}
```

### What You Produce (Outputs)

```typescript
IntegrationSuccess {
  success: true,
  files_created: [
    "src/components/dns-protocol-p5-examples.tsx",
    "src/data/lessons/redes-de-computadores/dns-protocol.mdx",
    "src/data/quizzes/redes-de-computadores/quiz-dns.json"
  ],
  files_updated: [
    "src/data/lessons/redes-de-computadores/module.json",
    "mdx-components.tsx"
  ],
  lesson_url: "/redes-de-computadores/dns-protocol",
  summary: "✅ Lesson created successfully..."
}
```

---

## Critical Handoff Points

### Handoff FROM Content Agent

**What you receive:**
- Complete `.mdx` file content (not just outline)
- All sections: introduction, explanations, examples
- Component placeholders: `<ComponentName />`
- References to quiz and visual elements

**What to verify:**
- MDX is complete and ready to publish
- Component names match what visual agent will provide
- Portuguese content is correct
- No broken references or missing sections

### Handoff FROM Visual Agent

**What you receive:**
- Complete `.tsx` file with p5 components
- All components properly exported as named exports
- Already updated `mdx-components.tsx` (but you'll replace your version)
- Imports and dependencies included

**What to verify:**
- Component names match p5ComponentNames array
- All required imports present (`p5-sketch`, React, etc.)
- TypeScript syntax is valid
- Client-side directive present (`"use client"`)

### Handoff FROM Quiz Agent

**What you receive:**
- Complete `quiz.json` file
- Validated JSON structure
- All questions with correct/incorrect explanations
- Time limit and metadata

**What to verify:**
- JSON is syntactically valid
- Quiz ID matches expected format
- Course ID matches integration context
- All questions have exactly one correct answer

---

## Atomic Integration Concept

### Why "Atomic"?

In the context of lesson creation, **atomic** means:

1. **All-or-nothing** — Either all three files are created, or none are
2. **No partial state** — Never leave the codebase in an incomplete state
3. **Stop on error** — If file 2 fails, don't proceed to file 3
4. **Single transaction** — All changes succeed together or fail together

### Why This Matters

Imagine if files were created independently:
- MDX created ✓
- P5 component created ✓
- Quiz created ✗ (fails)

Result: Lesson references components that are there, but quiz fails to load. Broken state.

Instead, with atomic writes:
- All three created ✓ OR all three fail ✗
- No partial states
- Metadata updates only happen after all files succeed

### Implementation Pattern

```
PRE-VALIDATION (check all inputs)
  ✓ MDX content valid?
  ✓ P5 code valid?
  ✓ Quiz JSON valid?
  If any fails → STOP and report error

ATOMIC WRITE
  Write file 1: p5 components
    ✓ Success → continue
    ✗ Failure → STOP (don't write 2, 3)
  
  Write file 2: MDX lesson
    ✓ Success → continue
    ✗ Failure → STOP (don't write 3)
  
  Write file 3: Quiz JSON
    ✓ Success → proceed to metadata updates
    ✗ Failure → STOP (files 1-2 are written but not integrated)

METADATA UPDATES (only if all files succeeded)
  Update module.json
  Update mdx-components.tsx

BUILD VALIDATION
  Run `npx next build`
  ✓ Success → Integration complete!
  ✗ Failure → Report error with recovery steps
```

---

## File System Layout After Integration

After a successful integration of "Protocolo DNS" lesson:

```
trinity-academy/
├── src/
│   ├── components/
│   │   ├── ... (existing components)
│   │   └── dns-protocol-p5-examples.tsx         ← NEW FILE
│   │
│   ├── data/
│   │   ├── lessons/
│   │   │   ├── redes-de-computadores/
│   │   │   │   ├── module.json                  ← UPDATED
│   │   │   │   ├── ... (existing lessons)
│   │   │   │   └── dns-protocol.mdx             ← NEW FILE
│   │   │   └── ... (other courses)
│   │   │
│   │   └── quizzes/
│   │       ├── redes-de-computadores/
│   │       │   ├── ... (existing quizzes)
│   │       │   └── quiz-dns-protocol.json       ← NEW FILE
│   │       └── ... (other courses)
│   │
│   └── ... (other src files)
│
├── mdx-components.tsx                           ← UPDATED
└── ... (other project files)
```

---

## Error Recovery Flowchart

```
Integration Request
        ↓
Validate Inputs
  ├─ MDX valid? ──┐
  ├─ P5 code?    │
  └─ Quiz JSON?──┘
        │
        ├─❌ Invalid → Report error, STOP
        │
        ✓ Valid
        ↓
Write File 1 (P5 Components)
        │
        ├─❌ Failed → Report error, don't proceed
        │            Files written: [1]
        │            Recovery: Fix issue, retry
        │
        ✓ Success
        ↓
Write File 2 (MDX Lesson)
        │
        ├─❌ Failed → Report error, don't proceed
        │            Files written: [1, 2]
        │            Recovery: Fix issue, retry
        │
        ✓ Success
        ↓
Write File 3 (Quiz JSON)
        │
        ├─❌ Failed → Report error, don't proceed
        │            Files written: [1, 2, 3]
        │            Recovery: Fix issue, retry
        │
        ✓ Success
        ↓
Update module.json
        │
        ├─❌ Failed → Report error
        │            Files created: [1, 2, 3]
        │            Files updated: []
        │            Recovery: Manual module.json update
        │
        ✓ Success
        ↓
Update mdx-components.tsx
        │
        ├─❌ Failed → Report error
        │            Files created: [1, 2, 3]
        │            Files updated: [module.json]
        │            Recovery: Manual mdx-components update
        │
        ✓ Success
        ↓
Validate Build (npx next build)
        │
        ├─❌ Failed → Report error with diagnostics
        │            Files created/updated: [all]
        │            Recovery: Fix TypeScript/JSON errors, retry
        │
        ✓ Success (exit code 0)
        ↓
Integration Complete ✅
  • 3 files created
  • 2 files updated
  • Build passed
  • Lesson ready for publication
```

---

## Success Criteria

An integration is **successful** when:

1. ✅ All three files created without errors
2. ✅ module.json updated with correct lesson entry
3. ✅ mdx-components.tsx updated with correct imports/exports
4. ✅ Build validation passes (exit code 0)
5. ✅ No TypeScript errors or warnings
6. ✅ No JSON syntax errors
7. ✅ Lesson is accessible at expected URL
8. ✅ All visual components render correctly

---

## Interaction with Other Agents

### Before Integration

You **receive outputs** from upstream agents:

```
[Content Agent] writes → You receive: mdxContent
[Visual Agent]  writes → You receive: p5ComponentsCode, p5ComponentNames
[Quiz Agent]    writes → You receive: quizData
```

You do **NOT**:
- Edit upstream agent outputs
- Create or modify lesson content
- Design or implement visualizations
- Write quiz questions or logic

### After Integration

You **enable downstream processes**:

```
You create/update files → [Build validation] → [Git workflow] → [Deployment]
```

---

## Key Principles

1. **Separation of Concerns** — You don't create content; you assemble it
2. **Atomicity** — All files succeed together or fail together
3. **Validation** — Every step is validated before proceeding
4. **Clear Error Reporting** — Every failure includes recovery instructions
5. **No Assumptions** — Verify all inputs and file structures
6. **Preservation** — Don't break existing lessons or configurations
7. **Consistency** — Follow project conventions (formatting, naming, encoding)


