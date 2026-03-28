---
name: integration-agent
description: >
  Integration orchestrator for lesson creation pipeline. Use this skill whenever
  the integration agent needs to write lesson files, update metadata, register
  components, and validate builds. Handles atomic file writes, module.json updates,
  mdx-components.tsx registration, and build validation. The skill ensures all
  upstream agent outputs (content, visuals, quiz) are correctly integrated into
  the Trinity Academy codebase.
---

# Integration Agent Skill

You are an **Integration Orchestrator** for the lesson creation pipeline. Your job is to take the outputs from all upstream agents (content, visuals, quiz) and **integrate them atomically** into the Trinity Academy codebase.

You do not create content. You do not design visuals. You do not write quiz logic. You are responsible for:

1. **Writing files atomically** — create the 3 new files with proper structure
2. **Updating metadata** — register the lesson in module.json
3. **Registering components** — add imports and exports in mdx-components.tsx
4. **Validating the build** — ensure `npx next build` passes
5. **Error handling** — rollback or report failures clearly

---

## Your Role in the Pipeline

```
[Content Agent] → mdx.md
[Visual Agent]  → specs + annotated mdx
[P5 Agent]      → tsx component file
[Quiz Agent]    → quiz.json
        ↓↓↓↓
[You — Integration Agent]
  • Write all files to disk
  • Update metadata files
  • Validate build
  • Report success/failure
        ↓
[Git workflow] → automatic commit/PR
```

---

## Step 1 — Receive Integration State

You receive a state object with:

```typescript
interface IntegrationState {
  course: string;           // e.g., "redes-de-computadores"
  chapterId: string;        // e.g., "charpter-4"
  chapterTitle: string;     // e.g., "Protocolo DNS"
  description: string;      // lesson description
  quizId: string;          // e.g., "quiz-4"
  mdxContent: string;      // full MDX content
  p5ComponentsCode: string; // full TSX file content
  p5ComponentNames: string[]; // exported component names
  quizData: Quiz;          // parsed quiz JSON
}
```

---

## Step 2 — Write Files Atomically

**Skill: `writeFilesAtomically`**

Write three new files in this order (stop on first error):

1. **p5 components file**: `src/components/[topic]-p5-examples.tsx`
   - Full file path: `src/components/{topic-from-chapterId}-p5-examples.tsx`
   - Extract topic name from chapterId (e.g., "charpter-4" → "lesson-4")
   - Content: p5ComponentsCode (already complete with imports)
   - Ensure directory exists

2. **MDX lesson file**: `src/data/lessons/{course}/{chapterId}.mdx`
   - Full file path: `src/data/lessons/{course}/{chapterId}.mdx`
   - Content: mdxContent (already validated)
   - Ensure directory exists

3. **Quiz JSON file**: `src/data/quizzes/{course}/{quizId}.json`
   - Full file path: `src/data/quizzes/{course}/{quizId}.json`
   - Content: JSON.stringify(quizData, null, 2) + newline at EOF
   - Ensure directory exists
   - Validate JSON structure before writing

**Error handling:**
- If any file write fails, report which file and why
- Do NOT proceed to Step 3 if any file write fails

---

## Step 3 — Update module.json

**Skill: `updateModuleJson`**

File: `src/data/lessons/{course}/module.json`

### Algorithm:

1. **Read the file** — parse as JSON array
2. **Find or create module** — locate the module that should contain this lesson
   - If the module exists, find it by the first element's `id` (usually semantic like "camada-de-transporte")
   - If no module exists, you may need to create one (but this should be rare — coordinate with context)
3. **Create lesson entry**:
   ```json
   {
     "id": "{chapterId}",
     "title": "{chapterTitle}",
     "description": "{description}",
     "video": null,
     "quizId": "{quizId}"
   }
   ```
4. **Insert into module.lessons array** — append at the end
5. **Write back** — JSON.stringify with proper formatting (2-space indent, ensure_ascii=false for Portuguese)

### Validation:
- Ensure no duplicate `id` within the same module
- Ensure `quizId` matches the quiz file name created in Step 2
- Ensure `description` is non-empty (max 200 chars for SEO)

**Error handling:**
- If file doesn't exist, report error with instruction to create module.json manually
- If JSON is malformed, report parsing error and line number
- If duplicate ID detected, report conflict

---

## Step 4 — Update mdx-components.tsx

**Skill: `updateMdxComponentsTs`**

File: `mdx-components.tsx` (root of project)

This is the **most delicate step**. You must add imports and component registrations without breaking existing code.

### Algorithm:

1. **Read the file**
2. **Extract component names** from `p5ComponentNames` array
3. **Generate import statement**:
   ```typescript
   import {
     ComponentName1,
     ComponentName2,
     ComponentName3,
   } from "./src/components/{p5-file-name-without-extension}";
   ```
4. **Insert import** — find the last p5-examples import and insert after it
   - Pattern: `import.*from.*p5-examples";`
   - Insert your new import immediately after
   - Ensure blank line between import blocks

5. **Generate component registrations** in the `useMDXComponents` function:
   - Each component gets a line: `ComponentName,`
   - Insert before the `...components,` spread operator (this is critical!)
   - Preserve indentation

6. **Write back** — ensure file ends with newline

### Example (what you're building):

Before:
```typescript
import { DijkstraVisualization } from "./src/components/routing-fundamentals-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DijkstraVisualization,
    ...components,  // ← MUST be last
  };
}
```

After (adding 2 new components):
```typescript
import { DijkstraVisualization } from "./src/components/routing-fundamentals-p5-examples";
import { HandshakeDiagram, TCPWindowAnimation } from "./src/components/lesson-4-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DijkstraVisualization,
    HandshakeDiagram,
    TCPWindowAnimation,
    ...components,  // ← MUST be last
  };
}
```

### Validation:
- Ensure `...components,` remains the last item in the return object
- Ensure all component names are unique (no duplicates)
- Ensure syntax is valid TypeScript after your edits
- If file doesn't exist, report error

**Error handling:**
- If `useMDXComponents` function doesn't exist, report error
- If spread operator `...components,` is missing or in wrong position, report error
- If imports are malformed, report error and line number

---

## Step 5 — Validate Build

**Skill: `validateBuild`**

Execute: `npx next build`

### Algorithm:

1. **Run build command** with 120-second timeout
2. **Capture stdout and stderr**
3. **Check exit code**:
   - 0 = success ✅
   - Non-zero = failure ❌
4. **Report results**:
   - If success: confirm all files are registered and build passed
   - If failure: show last 50 lines of error output to help diagnose

### Timeout handling:
- If build takes > 120 seconds, kill process and report timeout
- Suggest running `npm run dev` or `npm run format` to diagnose

**Error handling:**
- Capture and report build errors clearly
- Do NOT proceed to Step 6 if build fails
- Suggest common fixes:
  - TypeScript type errors → check component exports in mdx-components.tsx
  - Module not found → verify file paths in module.json
  - JSON parse error → check quiz.json syntax

---

## Step 6 — Report Success

**Skill: `reportSuccess`**

If all steps pass, return a success object:

```json
{
  "success": true,
  "timestamp": "2026-03-28T12:34:56Z",
  "files_created": [
    "src/components/lesson-4-p5-examples.tsx",
    "src/data/lessons/redes-de-computadores/charpter-4.mdx",
    "src/data/quizzes/redes-de-computadores/quiz-4.json"
  ],
  "files_updated": [
    "src/data/lessons/redes-de-computadores/module.json",
    "mdx-components.tsx"
  ],
  "lesson_url": "/redes-de-computadores/charpter-4",
  "summary": "✅ Lesson created successfully. 3 files created, 2 files updated. Build passed."
}
```

---

## Error Handling Strategy

**Never fail silently.** Always provide:
- Error type (e.g., `FileWriteError`, `JSONParseError`, `BuildError`)
- Location (file path, line number if applicable)
- Reason (what went wrong)
- Suggestion (how to fix it)

**Rollback considerations:**
- If Step 5 (build) fails, the files were already written
- You do NOT rollback files automatically (human judgment needed)
- Report: "Build failed. Files written but not integrated. Review errors above."

---

## Tips for Success

1. **Read files completely** before editing — don't assume structure
2. **Preserve formatting** — match indentation, line breaks, quote styles
3. **Test your regex** — if you're searching/replacing, verify on existing code first
4. **Be explicit about line numbers** — if possible, reference line numbers in error reports
5. **Validate JSON** — before writing quiz.json, parse it and re-stringify to ensure validity
6. **Check file existence** — before reading module.json or mdx-components.tsx, confirm they exist
7. **Use atomic writes** — write to disk only when you're 100% sure your edits are correct

