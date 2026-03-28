# Metadata Update Specifications

This document provides exact specifications for updating `module.json` and `mdx-components.tsx` during the integration process.

---

## Overview

After creating the three files atomically, the integration agent updates two metadata files:

1. **Step 3:** Update `src/data/lessons/{course}/module.json` (lesson metadata)
2. **Step 4:** Update `mdx-components.tsx` (component registration)

These updates happen sequentially. If either fails, the integration is incomplete but files are already on disk.

---

## Step 3: Update module.json

### File Location

Path: `src/data/lessons/{course}/module.json`

Example: `src/data/lessons/redes-de-computadores/module.json`

### File Structure

Module.json is a **JSON array** of modules, where each module contains a lessons array:

```json
[
  {
    "id": "module-1-id",
    "name": "Module 1 Name",
    "lessons": [
      {
        "id": "lesson-1",
        "title": "Lesson 1 Title",
        "description": "Short description of lesson 1",
        "video": null,
        "quizId": "quiz-1"
      },
      {
        "id": "lesson-2",
        "title": "Lesson 2 Title",
        "description": "Short description of lesson 2",
        "video": null,
        "quizId": "quiz-2"
      }
    ]
  },
  {
    "id": "module-2-id",
    "name": "Module 2 Name",
    "lessons": [
      {
        "id": "lesson-3",
        "title": "Lesson 3 Title",
        "description": "Short description of lesson 3",
        "video": null,
        "quizId": "quiz-3"
      }
    ]
  }
]
```

### Update Algorithm

**Input:** IntegrationState with `course`, `chapterId`, `chapterTitle`, `description`, `quizId`

**Steps:**

1. **Read file**
   - Read `src/data/lessons/{course}/module.json`
   - Parse as JSON array
   - If file doesn't exist, report error with instruction to create manually

2. **Find target module**
   - Look through the array for a module that should contain this lesson
   - Usually there's only ONE module per course
   - Pattern: First module in the array is the target
   - If multiple modules exist, use course context to determine which one

3. **Check for duplicate lesson ID**
   - Search all lessons in target module for matching `id`
   - If found, report duplicate error:
     ```
     Error: Lesson with ID 'lesson-id' already exists in module
     Location: src/data/lessons/course/module.json
     Recovery: Use different lesson ID or delete existing lesson
     ```

4. **Create lesson entry**
   ```json
   {
     "id": "{chapterId}",
     "title": "{chapterTitle}",
     "description": "{description}",
     "video": null,
     "quizId": "{quizId}"
   }
   ```
   - `id` must match `chapterId` exactly
   - `title` must match `chapterTitle` exactly
   - `description` must be 1-200 characters (for SEO)
   - `video` is always `null` (lessons without videos)
   - `quizId` must match the quiz file created in Step 2

5. **Insert into module**
   - Append new lesson to target module's `lessons` array
   - Do NOT insert in middle; always append at end
   - Preserve array structure

6. **Write back**
   - Convert to JSON with 2-space indentation
   - Use UTF-8 encoding
   - Add newline at EOF
   - Command: `JSON.stringify(modules, null, 2) + "\n"`

### Validation Checklist

Before writing back, confirm:

- [ ] Lesson ID is unique within module (no duplicates)
- [ ] All required fields present (id, title, description, quizId)
- [ ] Description is 1-200 characters
- [ ] quizId matches quiz file name (e.g., "quiz-4" → `quiz-4.json`)
- [ ] JSON is well-formed (can be re-parsed)
- [ ] Array structure preserved (modules and lessons arrays intact)
- [ ] Other lessons in module are untouched

### Real Example

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
        "description": "Entenda como o HTTP funciona...",
        "video": null,
        "quizId": "quiz-http"
      }
    ]
  }
]
```

**After (adding DNS lesson):**
```json
[
  {
    "id": "camada-aplicacao",
    "name": "Camada de Aplicação",
    "lessons": [
      {
        "id": "http-protocol",
        "title": "Protocolo HTTP",
        "description": "Entenda como o HTTP funciona...",
        "video": null,
        "quizId": "quiz-http"
      },
      {
        "id": "dns-protocol",
        "title": "Protocolo DNS",
        "description": "Entenda como o DNS traduz nomes em endereços IP",
        "video": null,
        "quizId": "quiz-dns-protocol"
      }
    ]
  }
]
```

### Error Handling

| Error | Recovery |
|-------|----------|
| File doesn't exist | Report instruction to create `module.json` manually in course directory |
| JSON parse error | Report line number and syntax error; ask to validate JSON format |
| Module not found | Identify which module should contain the lesson; report if none match |
| Duplicate lesson ID | Suggest using different lesson ID or deleting conflicting lesson |
| Invalid description | Description must be 1-200 characters; report if outside range |
| Quiz ID mismatch | Quiz ID in lesson entry must match quiz file created in Step 2 |

---

## Step 4: Update mdx-components.tsx

### File Location

Path: `mdx-components.tsx` (project root)

### File Structure

The file typically looks like:

```typescript
import type { MDXComponents } from "mdx/types";
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

### Critical Rule

**The `...components,` spread operator MUST remain as the LAST item in the return object.**

This is critical because:
- It provides a fallback for any components not explicitly registered
- If it's not last, custom components won't have priority
- Breaking this breaks the entire MDX component system

### Update Algorithm

**Input:** `p5ComponentNames` array (e.g., `["ComponentA", "ComponentB"]`) and component file name

**Steps:**

1. **Read file**
   - Read `mdx-components.tsx` from project root
   - If file doesn't exist, report error (should always exist)

2. **Find last p5-examples import**
   - Search for the pattern: `import.*from.*p5-examples";`
   - Locate the LAST occurrence
   - This is where you'll insert the new import

3. **Generate new import statement**
   ```typescript
   import { ComponentA, ComponentB } from "./src/components/[component-filename]";
   ```
   - Component filename from chapterId: `{chapterId}-p5-examples`
   - Component names from p5ComponentNames array
   - Format: comma-separated with proper spacing
   - If multiple components: multiline format
     ```typescript
     import {
       ComponentA,
       ComponentB,
       ComponentC,
     } from "./src/components/[filename]";
     ```

4. **Insert import**
   - Insert after the last p5-examples import
   - Preserve blank line between import groups
   - Pattern to find: Last line matching `import.*p5-examples";`
   - Insert new import on the next line

5. **Find useMDXComponents function**
   - Locate the function definition: `export function useMDXComponents(...)`
   - Find the return statement: `return { ... }`
   - Find the spread operator: `...components,`

6. **Register components**
   - Add each component name as a separate line before `...components,`
   - Format: `ComponentName,` on its own line
   - Preserve indentation (usually 2 spaces)
   - Example:
     ```typescript
     return {
       DijkstraRoutingStepSimulator,
       HttpRequestVisualization,
       ComponentA,
       ComponentB,
       ...components,
     };
     ```

7. **Validate**
   - Ensure `...components,` is still the LAST item
   - Ensure all component names are unique (no duplicates)
   - Ensure syntax is valid TypeScript
   - Ensure indentation is consistent

8. **Write back**
   - Use UTF-8 encoding
   - Add newline at EOF
   - Preserve original formatting and line breaks

### Real Example

**Before:**
```typescript
import type { MDXComponents } from "mdx/types";
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

**After (adding DNS visualizations):**
```typescript
import type { MDXComponents } from "mdx/types";
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

### Validation Checklist

Before writing back, confirm:

- [ ] `...components,` remains as the LAST item in return object
- [ ] All component names in p5ComponentNames are registered
- [ ] No duplicate component names across all registrations
- [ ] All registered components actually exist in the imported file
- [ ] Import statement is syntactically valid TypeScript
- [ ] Indentation is consistent (2 spaces)
- [ ] Blank lines between import groups are preserved
- [ ] File ends with newline

### Error Handling

| Error | Recovery |
|-------|----------|
| File not found | Report: mdx-components.tsx doesn't exist (should always exist) |
| useMDXComponents not found | Report: function structure has changed; manual intervention needed |
| `...components` missing | Report: spread operator is missing; cannot safely register components |
| `...components` not last | Report: spread operator must be last item; reposition it before registering new components |
| Duplicate component names | Report: component already registered; verify with visual agent for naming conflict |
| Invalid TypeScript | Report: syntax error in import or registration; show example fix |

---

## Multi-Component Registration Example

When registering multiple components from the same file:

### Option 1: Single-line import (for 1-2 components)
```typescript
import { DNSQuery, DNSZone } from "./src/components/dns-protocol-p5-examples";
```

### Option 2: Multi-line import (for 3+ components)
```typescript
import {
  DNSQuery,
  DNSZone,
  DNSResolver,
  DNSCache,
} from "./src/components/dns-protocol-p5-examples";
```

### Then register all in useMDXComponents:
```typescript
return {
  // ... existing components ...
  DNSQuery,
  DNSZone,
  DNSResolver,
  DNSCache,
  ...components,
};
```

---

## Common Pitfalls

### Pitfall 1: Forgetting the Spread Operator

**Problem:** After update, `...components,` is removed or forgotten

```typescript
return {
  ComponentA,
  ComponentB,
  // ❌ Missing ...components
};
```

**Solution:** Always preserve `...components,` as the LAST item

### Pitfall 2: Moving Spread Operator

**Problem:** New components are added after `...components,`

```typescript
return {
  ComponentA,
  ...components,
  ComponentB,  // ❌ WRONG! Should be before ...components
};
```

**Solution:** Insert new components BEFORE `...components,`

### Pitfall 3: Duplicate Registration

**Problem:** Component registered twice

```typescript
return {
  ComponentA,
  ComponentA,  // ❌ Duplicate!
  ...components,
};
```

**Solution:** Verify component names are unique before registering

### Pitfall 4: Component Not Exported

**Problem:** Register component that doesn't exist in component file

```typescript
// mdx-components.tsx tries to register:
import { NonExistent } from "./src/components/dns-protocol-p5-examples";

// But component file doesn't export it
export function DNSQuery() { ... }
export function DNSZone() { ... }
// ❌ No NonExistent export
```

**Solution:** Verify all component names in p5ComponentNames actually exist in component file

### Pitfall 5: Wrong File Path

**Problem:** Import path doesn't match created component file

```typescript
// Created file: src/components/dns-protocol-p5-examples.tsx
// But import tries: "./src/components/dns-p5-examples"
// ❌ Path mismatch
```

**Solution:** Use exact filename from Step 2 (p5 components file creation)

---

## Testing the Integration

After updating both files, verify:

1. **mdx-components.tsx syntax** — Should have no TypeScript errors
2. **All imports resolve** — Component files exist and export registered names
3. **Build passes** — `npx next build` should succeed
4. **Lessons load** — Navigate to lesson URL and verify content loads
5. **Components render** — Visual components should display correctly in lesson


