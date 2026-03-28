# Integration Agent Skill

**Location:** `.github/skills/integration-agent/SKILL.md`

**Purpose:** Teach an integration agent how to orchestrate the final assembly of lesson artifacts (MDX content, p5 components, quiz data) into the Trinity Academy codebase, with atomic file writes, metadata updates, component registration, and build validation.

---

## Quick Start

This skill is used by the **integration-orchestrator agent** (`.github/agents/integration-orchestrator.agent.md`).

### When to Use This Skill

Use this skill when you need to:
- Receive complete outputs from content, visual, and quiz agents
- Write three new files (MDX lesson, p5 components, quiz JSON) atomically
- Register lesson metadata in `module.json`
- Register p5 components in `mdx-components.tsx`
- Validate the Next.js build succeeds
- Report success or provide clear error diagnosis

### The Workflow

```
[Content Agent] → MDX lesson file (complete)
[Visual Agent]  → p5 component TSX file (complete)
[Quiz Agent]    → quiz JSON (complete)
        ↓↓↓↓
[You — Integration Agent]
  • Write all files atomically
  • Update metadata (module.json)
  • Register components (mdx-components.tsx)
  • Validate build (npx next build)
  • Report success/failure
        ↓
[Lesson Published] → live in Trinity Academy
```

---

## What's Inside

The skill file (`SKILL.md`) contains:

1. **Your Role in the Pipeline** — Context and responsibilities
2. **Step 1: Receive Integration State** — Understand the input format and data structure
3. **Step 2: Write Files Atomically** — Create three files in order with error handling
4. **Step 3: Update module.json** — Register the lesson in course structure
5. **Step 4: Update mdx-components.tsx** — Register component imports and exports
6. **Step 5: Validate Build** — Run `npx next build` and confirm success
7. **Step 6: Report Success** — Provide clear results or error diagnosis

---

## Key Concepts

### Atomic File Writing

All three files must be written together, or none at all:
1. **p5 components file** — `src/components/[topic]-p5-examples.tsx`
2. **MDX lesson file** — `src/data/lessons/[course]/[chapter].mdx`
3. **Quiz JSON file** — `src/data/quizzes/[course]/[quiz-id].json`

If ANY file write fails:
- Stop immediately
- Do NOT proceed to metadata updates
- Report which file failed and why
- Suggest recovery steps

### Metadata Updates

**module.json structure:**
```json
[
  {
    "id": "module-1",
    "name": "Module Name",
    "lessons": [
      {
        "id": "lesson-1",
        "title": "Lesson Title",
        "description": "Short description",
        "video": null,
        "quizId": "quiz-1"
      }
    ]
  }
]
```

Key validation:
- No duplicate lesson IDs within a module
- Quiz ID matches the quiz file created in Step 2
- Description is non-empty and < 200 chars (SEO)
- Proper JSON formatting with 2-space indentation

### Component Registration

The critical pattern in `mdx-components.tsx`:

```typescript
import { Visualization1, Visualization2 } from "./src/components/topic-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Visualization1,
    Visualization2,
    ...components,  // ← MUST be last!
  };
}
```

**Why the order matters:**
- New components are listed explicitly
- `...components,` (spread operator) must be **last** in the return object
- This ensures custom components have priority but don't break fallbacks

### Build Validation

Run `npx next build` with 120-second timeout. Exit codes:
- **0** = success ✅ All files integrated correctly
- **non-zero** = failure ❌ Build error (see stderr for details)

Common build errors and fixes:
| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module` | Wrong import path | Check file path in `mdx-components.tsx` |
| `SyntaxError` in quiz.json | Malformed JSON | Validate JSON syntax (missing comma, bracket, etc.) |
| `Type 'X' is not assignable to type 'Y'` | TypeScript mismatch | Check component exports match `MDXComponents` type |
| `Property 'X' is missing from type 'Y'` | Incomplete component | Ensure component exports default + named exports |

---

## Input/Output Format

### Input State Object

```typescript
interface IntegrationState {
  course: string;           // e.g., "redes-de-computadores"
  chapterId: string;        // e.g., "chapter-4"
  chapterTitle: string;     // e.g., "Protocolo DNS"
  description: string;      // lesson description
  quizId: string;          // e.g., "quiz-4"
  mdxContent: string;      // full MDX content (complete)
  p5ComponentsCode: string; // full TSX file (complete)
  p5ComponentNames: string[]; // exported component names
  quizData: QuizJSON;       // parsed quiz data (or null)
}
```

### Output Success Object

```json
{
  "success": true,
  "timestamp": "2026-03-28T12:34:56Z",
  "files_created": [
    "src/components/lesson-4-p5-examples.tsx",
    "src/data/lessons/redes-de-computadores/chapter-4.mdx",
    "src/data/quizzes/redes-de-computadores/quiz-4.json"
  ],
  "files_updated": [
    "src/data/lessons/redes-de-computadores/module.json",
    "mdx-components.tsx"
  ],
  "lesson_url": "/redes-de-computadores/chapter-4",
  "summary": "✅ Lesson created successfully. 3 files created, 2 files updated. Build passed."
}
```

### Output Error Object

```json
{
  "success": false,
  "error_type": "BuildError",
  "error_message": "Build failed with exit code 1",
  "failed_at_step": 5,
  "details": "TypeScript error in mdx-components.tsx:...",
  "files_created": [...],
  "files_updated": [...],
  "recovery_steps": [
    "1. Check TypeScript errors in mdx-components.tsx",
    "2. Verify import paths match created component file",
    "3. Run 'npm run format' to auto-fix formatting issues"
  ]
}
```

---

## Step-by-Step Walkthrough

### Step 1: Receive and Validate Input

- Confirm you have `mdxContent` (not empty)
- Confirm you have `p5ComponentsCode` (not empty)
- Confirm you have `p5ComponentNames` (array with at least one component)
- Confirm `course` matches a directory in `src/data/lessons/`
- Confirm `quizId` is non-empty (even if `quizData` is null)

### Step 2: Write Files Atomically

**2a. Create p5 components file:**
- Path: `src/components/[topic-from-chapterId]-p5-examples.tsx`
- Extract topic name from `chapterId` (e.g., "chapter-4" → "chapter-4")
- Content: `p5ComponentsCode` (already complete)
- Ensure UTF-8 encoding, newline at EOF

**2b. Create MDX lesson file:**
- Path: `src/data/lessons/[course]/[chapterId].mdx`
- Content: `mdxContent` (already validated)
- Ensure UTF-8 encoding, newline at EOF

**2c. Create quiz JSON file:**
- Path: `src/data/quizzes/[course]/[quizId].json`
- Content: `JSON.stringify(quizData, null, 2)` + newline at EOF
- Validate JSON syntax before writing

**Error handling:**
- If any file write fails (permission denied, directory doesn't exist, etc.), report the error and STOP
- Do NOT proceed to Step 3 if Step 2 fails
- Provide the specific file path and error reason

### Step 3: Update module.json

**3a. Read file:**
- Path: `src/data/lessons/[course]/module.json`
- Parse as JSON array
- Report error if file not found or malformed

**3b. Find or create module:**
- Locate the module that should contain this lesson
- If module doesn't exist, this is an error (coordinator should create manually)

**3c. Create lesson entry:**
```json
{
  "id": "{chapterId}",
  "title": "{chapterTitle}",
  "description": "{description}",
  "video": null,
  "quizId": "{quizId}"
}
```

**3d. Validate and insert:**
- Ensure no duplicate `id` in the module
- Ensure `quizId` matches the file created in Step 2
- Append to `module.lessons` array
- Write back with JSON formatting (2-space indent, UTF-8)

### Step 4: Update mdx-components.tsx

**4a. Read file:**
- Path: `mdx-components.tsx` (project root)
- Locate the `useMDXComponents` function

**4b. Add imports:**
- Generate: `import { Component1, Component2 } from "./src/components/[filename]";`
- Insert after the last p5-examples import
- Ensure blank line between import blocks

**4c. Register components:**
- Add each component name before `...components,`
- Example: `Component1,` on its own line
- Preserve indentation and syntax

**4d. Validate:**
- Ensure `...components,` is still the last item in return object
- Ensure no duplicate component names
- Validate TypeScript syntax

### Step 5: Validate Build

**5a. Run build:**
```bash
npx next build
```
- Capture stdout and stderr
- Wait for completion (max 120 seconds)

**5b. Check exit code:**
- 0 = success ✅
- non-zero = failure ❌

**5c. Report results:**
- If success: "Build passed. All files integrated."
- If failure: Show last 50 lines of stderr and suggest fixes

### Step 6: Report Results

If ALL steps succeed, return success object with:
- File paths created and updated
- Lesson URL (e.g., `/course-id/chapter-id`)
- Summary message

If ANY step fails, return error object with:
- Error type and message
- Which step failed
- Files created so far (for manual recovery)
- Recovery steps to fix and retry

---

## Tips for Success

1. **Validate inputs first** — Don't assume upstream agents produced valid output
2. **Read existing files completely** — Don't guess structure; read the whole file before editing
3. **Preserve formatting** — Match indentation, line breaks, quote styles in existing code
4. **Test regex carefully** — If searching/replacing, verify on existing code first
5. **Use atomic writes** — Write all files or none; never partially complete
6. **Validate JSON** — Parse and re-stringify before writing to ensure validity
7. **Check file existence** — Confirm `module.json` and `mdx-components.tsx` exist before reading
8. **Report clearly** — Always explain WHAT failed, WHERE, and HOW to fix it

---

## Related Documentation

- **Integration Orchestrator Agent:** `.github/agents/integration-orchestrator.agent.md`
- **Trinity Architecture:** `copilot-instructions.md` (lesson structure, routes, components)
- **MDX System:** `.github/skills/educational-writer/SKILL.md`
- **P5.js Components:** `.github/skills/p5js-development/SKILL.md`
- **Quiz System:** `.github/skills/quiz-development/SKILL.md`


