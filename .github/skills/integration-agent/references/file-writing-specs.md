# File Writing Specifications

This document provides exact specifications for writing the three files atomically during the integration process.

---

## Overview

The integration agent writes three files in this order:

1. **P5 Components File** — `src/components/[topic]-p5-examples.tsx`
2. **MDX Lesson File** — `src/data/lessons/[course]/[chapterId].mdx`
3. **Quiz JSON File** — `src/data/quizzes/[course]/[quizId].json`

**Critical rule:** If any file write fails, stop immediately and report the error. Do NOT proceed to metadata updates (Steps 3-4).

---

## File 1: P5 Components File

### Path Determination

**Input:** `chapterId` (e.g., "chapter-4", "lesson-dns", "routing-basics")

**Output path:** `src/components/[topic-from-chapterId]-p5-examples.tsx`

**Algorithm:**
1. Extract the topic name from `chapterId` directly (no transformation needed)
2. Convert hyphens to lowercase (already expected to be lowercase)
3. Append `-p5-examples.tsx` suffix
4. Path: `src/components/{topic}-p5-examples.tsx`

**Examples:**
| chapterId | topic | file path |
|-----------|-------|-----------|
| `chapter-4` | `chapter-4` | `src/components/chapter-4-p5-examples.tsx` |
| `dns-protocol` | `dns-protocol` | `src/components/dns-protocol-p5-examples.tsx` |
| `routing-basics` | `routing-basics` | `src/components/routing-basics-p5-examples.tsx` |

### File Structure

**Content source:** `p5ComponentsCode` (complete TSX file content from visual agent)

**Expected structure:**
```typescript
"use client";

import React, { /* dependencies */ } from "react";
import P5Sketch from "./p5-sketch";
import clsx from "clsx";

// Component 1
export function ComponentName1() {
  // Implementation
  return <P5Sketch setup={...} draw={...} />;
}

// Component 2
export function ComponentName2() {
  // Implementation
  return <P5Sketch setup={...} draw={...} />;
}

// Export all components as named exports
```

### Validation Before Writing

1. **Not empty** — File must have content (> 100 characters)
2. **Valid TypeScript** — Must not have syntax errors in component structure
3. **Named exports** — Every component in `p5ComponentNames` must be exported
4. **P5Sketch import** — File must import `P5Sketch` from `./p5-sketch`
5. **Client-side directive** — File must start with `"use client";`

### File Writing

1. **Create directory** if it doesn't exist: `src/components/`
2. **Write file** with UTF-8 encoding
3. **Add newline at EOF** (required by project conventions)
4. **No formatting** — Use content as-is from visual agent (they handle formatting)

### Error Handling

```
✗ File too small
  → Content < 100 characters
  → Likely incomplete from upstream agent
  → Recovery: Request complete component code from visual agent

✗ Directory doesn't exist
  → src/components/ directory missing
  → Should never happen in Trinity codebase
  → Recovery: Create directory and retry

✗ Permission denied
  → No write permission to src/components/
  → System or file permission issue
  → Recovery: Check file system permissions, retry

✗ Named exports missing
  → p5ComponentNames includes "ComponentA" but file doesn't export it
  → Component registration will fail in next step
  → Recovery: Verify component names with visual agent
```

---

## File 2: MDX Lesson File

### Path Determination

**Inputs:**
- `course` (e.g., "redes-de-computadores")
- `chapterId` (e.g., "dns-protocol")

**Output path:** `src/data/lessons/{course}/{chapterId}.mdx`

**Example:** `src/data/lessons/redes-de-computadores/dns-protocol.mdx`

### File Structure

**Content source:** `mdxContent` (complete MDX content from content agent)

**Expected structure:**
```mdx
# Título da Aula

Conteúdo introdutório...

## Seção 1

Conteúdo da seção 1...

<ComponentName />

## Seção 2

Conteúdo da seção 2...

## Quiz

[Instrções para quiz...]
```

### Validation Before Writing

1. **Not empty** — File must have content (> 200 characters)
2. **Valid MDX** — Must be parseable MDX (no syntax errors)
3. **Component usage** — All components used must be in `p5ComponentNames`
4. **Markdown structure** — Should have headings, paragraphs, lists (standard markdown)
5. **Portuguese content** — Content should be in PT-BR (verify by sampling)

### File Writing

1. **Create directory** if it doesn't exist: `src/data/lessons/{course}/`
2. **Write file** with UTF-8 encoding
3. **Add newline at EOF** (required by project conventions)
4. **Preserve formatting** — Use content exactly as provided by content agent

### Error Handling

```
✗ File too small
  → Content < 200 characters
  → Likely incomplete from upstream agent
  → Recovery: Request complete lesson content from content agent

✗ Directory doesn't exist
  → Course directory doesn't exist in src/data/lessons/
  → Either course name is wrong or directory not created yet
  → Recovery: Create course directory and retry, or verify course name

✗ Invalid component reference
  → MDX uses <UnknownComponent /> that's not in p5ComponentNames
  → Component won't be available when lesson is rendered
  → Recovery: Verify component names with visual agent

✗ Permission denied
  → No write permission to lesson directory
  → System or file permission issue
  → Recovery: Check file system permissions, retry
```

---

## File 3: Quiz JSON File

### Path Determination

**Inputs:**
- `course` (e.g., "redes-de-computadores")
- `quizId` (e.g., "quiz-dns-protocol")

**Output path:** `src/data/quizzes/{course}/{quizId}.json`

**Example:** `src/data/quizzes/redes-de-computadores/quiz-dns-protocol.json`

### File Structure

**Content source:** `quizData` (parsed quiz object from quiz agent)

**Expected structure:**
```json
{
  "id": "quiz-dns-protocol",
  "courseId": "redes-de-computadores",
  "title": "Quiz: Protocolo DNS",
  "description": "Test your understanding of DNS",
  "timeLimit": 600,
  "questions": [
    {
      "id": "q1",
      "text": "Question text?",
      "type": "single-choice",
      "options": [
        {
          "id": "opt-1",
          "text": "Option 1",
          "isCorrect": true,
          "explanation": "This is correct because..."
        },
        {
          "id": "opt-2",
          "text": "Option 2",
          "isCorrect": false,
          "explanation": "This is incorrect because..."
        }
      ]
    }
  ]
}
```

### Validation Before Writing

1. **Valid JSON** — Must parse successfully as JSON
2. **Required fields** — Must include:
   - `id` (matches quizId)
   - `courseId` (matches course)
   - `title` (non-empty string)
   - `timeLimit` (positive integer)
   - `questions` (non-empty array)
3. **Question structure** — Each question must have:
   - `id` (unique within quiz)
   - `text` (non-empty string)
   - `type` (e.g., "single-choice", "multiple-choice", etc.)
   - Options with `isCorrect` flags
4. **Exactly one correct answer** — Each question must have exactly one option with `isCorrect: true`
5. **Explanations** — Every option must have an `explanation` field

### File Writing

1. **Create directory** if it doesn't exist: `src/data/quizzes/{course}/`
2. **Validate JSON** — Parse and re-stringify to ensure validity
3. **Write file** with UTF-8 encoding
4. **Formatting** — Use 2-space indentation, pretty-print
5. **Add newline at EOF** (required by project conventions)

### File Format

```bash
JSON.stringify(quizData, null, 2) + "\n"
```

### Error Handling

```
✗ Invalid JSON
  → JSON.parse() fails
  → Usually a missing comma, bracket, or quote
  → Recovery: Check quiz JSON syntax with quiz agent, fix, retry

✗ Missing required field
  → Field 'id' or 'courseId' or 'questions' missing
  → Quiz structure incomplete from upstream agent
  → Recovery: Request complete quiz JSON from quiz agent

✗ Multiple correct answers per question
  → A question has 2+ options with isCorrect: true
  → Quiz will be ambiguous
  → Recovery: Request corrected quiz from quiz agent

✗ Directory doesn't exist
  → Course directory doesn't exist in src/data/quizzes/
  → Either course name is wrong or directory not created yet
  → Recovery: Create course directory and retry

✗ Permission denied
  → No write permission to quiz directory
  → System or file permission issue
  → Recovery: Check file system permissions, retry
```

---

## Atomic Write Strategy

### What "Atomic" Means

- **All three files succeed** → Integration is complete
- **Any file fails** → Stop immediately, report error, don't update metadata
- **No partial commits** — Either all files are written or none are

### Implementation

1. **Pre-check all three files** before writing any:
   - Validate paths, content, structure
   - Ensure no syntax errors
   - Confirm no file already exists (unless overwriting is intended)

2. **Write in order:**
   - P5 components (simplest, least dependencies)
   - MDX lesson (depends on component names, not on quiz)
   - Quiz JSON (standalone, no dependencies on other files)

3. **On first error:**
   - Stop immediately
   - Report which file failed and why
   - List files that were successfully created before the failure
   - Do NOT proceed to metadata updates (Steps 3-4)
   - Do NOT attempt cleanup/rollback (human decision)

4. **On success:**
   - Confirm all three files exist and are readable
   - Proceed to Step 3 (update metadata)

### Example Flow

```
Write P5 components:    ✅ Success
Write MDX lesson:       ✅ Success
Write quiz JSON:        ❌ FAILED (JSON parse error)
  → STOP
  → Report: "Quiz JSON write failed due to syntax error on line 42"
  → DO NOT update module.json or mdx-components.tsx
  → Recovery: Fix quiz JSON syntax and retry integration
```

---

## File Encoding and Line Endings

### Text Encoding

All files use **UTF-8** encoding (no BOM):
- Supports Portuguese characters (é, ã, ç, etc.)
- Project standard across Trinity codebase

### Line Endings

All files end with a **single newline character** (`\n`):
- Unix/Linux convention (not CRLF from Windows)
- Required by project linting rules

### Verification

After writing each file, confirm:
1. File exists and is readable
2. File is not empty
3. File ends with newline (`\n`)
4. File is valid UTF-8 (no mojibake or encoding issues)

---

## Common Pitfalls

### Pitfall 1: Missing Directory

**Problem:** Trying to write to `src/data/lessons/new-course/lesson.mdx` when `new-course/` doesn't exist

**Solution:** Create parent directories if they don't exist
```python
os.makedirs("src/data/lessons/new-course", exist_ok=True)
```

### Pitfall 2: Component Names Don't Match

**Problem:** p5ComponentNames has `["Component1", "Component2"]` but component file exports different names

**Solution:** Verify component exports in the file before writing mdx-components.tsx
```typescript
// Component file exports:
export function MyVisualization() { ... }

// But p5ComponentNames says: ["Component1"]
// ❌ Mismatch → will fail in Step 4
```

### Pitfall 3: Quiz JSON with Trailing Comma

**Problem:** Hand-written quiz JSON has trailing commas: `{ "id": "q1", }`

**Solution:** Always validate JSON by parsing and re-stringifying
```python
try:
    validated = json.loads(quiz_string)
except json.JSONDecodeError as e:
    # Report error with line number
```

### Pitfall 4: Component Already Exists

**Problem:** Another lesson already created `src/components/chapter-4-p5-examples.tsx`

**Solution:** Check if file exists before writing, or verify it's intentional overwrite

### Pitfall 5: Missing Newline at EOF

**Problem:** File is written without final newline

**Solution:** Always append `\n` at the end
```python
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
    f.write('\n')  # ← Don't forget!
```


