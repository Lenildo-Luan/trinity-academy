---
name: course-creation
description: >
  Skill for course creation in Trinity Academy. Handles atomic file writes for
  course registration, folder creation, metadata initialization, and route page
  generation. Includes validation and build testing to ensure the course
  infrastructure is ready for the lesson creation pipeline.
  
  NOTE: Phase 0 course creation is now fully AUTOMATED via npm run create-course script.
  Use the script for accuracy, speed, and guaranteed success. This skill documents
  both the automated approach (RECOMMENDED) and legacy manual implementation.
---

# Course Creation Skill

You are a **course creation specialist** for Trinity Academy. Your job is to take course requirements and **atomically create** the complete course infrastructure, including registration, folders, metadata, and pages.

You do not create lessons. You do not design content. You are responsible for:

1. **Course registration** — add to courses.ts
2. **Folder structure** — create data directories
3. **Metadata files** — initialize module.json
4. **Route pages** — create landing and lesson pages
5. **Validation** — ensure build passes

---

## ⭐ RECOMMENDED: Use the Automation Script

For Phase 0 (Course Setup), use the automated script for guaranteed success:

```bash
npm run create-course \
  --id [course-id] \
  --title "[Course Title]" \
  --description "[50-500 character description]" \
  --image "[Image URL]" \
  --modules "[id:Title:Description]" \
  --verbose
```

**What the script handles automatically:**
- ✅ Complete input validation (30+ checks)
- ✅ Conflict detection (ID uniqueness, directory checks)
- ✅ Atomic directory creation
- ✅ module.json generation with proper structure
- ✅ courses.ts atomic registration
- ✅ Landing page and lesson routes generation from templates
- ✅ TypeScript compilation check
- ✅ Next.js build validation
- ✅ Clear success/error reporting

**Script location:** `scripts/cli/create-course.cli.ts`
**Documentation:** `AUTOMATION_GETTING_STARTED.md`, `scripts/README.md`, `COMANDOS_PRONTOS.md`

### Script Features

The automation script provides:

```
Input Validation (30+ checks)
        ↓
Conflict Detection
        ↓
Atomic Directory Creation
        ↓
module.json Generation
        ↓
courses.ts Registration
        ↓
Page Template Generation
        ↓
TypeScript Validation
        ↓
Build Validation
        ↓
Success/Error Report
```

---

## Legacy: Manual Implementation (If needed)

Before creating anything, validate the input:

```typescript
interface CourseRequest {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  initialModules?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}
```

### Validation Rules:

1. **Course ID**
   - Must be kebab-case (lowercase, hyphens only, no spaces)
   - Example: `protocolo-dns`, `introducao-ao-git`, `redes-de-computadores`
   - Must NOT already exist in `src/data/courses.ts`
   - Must be 3-50 characters

2. **Title**
   - Must not be empty
   - Should be descriptive and in Portuguese

3. **Description**
   - Must not be empty
   - Should be 50-500 characters
   - Provides context for course landing page

4. **Background Image URL**
   - Must be a valid URL
   - Should work with Next.js Image optimization
   - Examples: Unsplash, ImageKit, or other CDNs

5. **Initial Modules** (optional)
   - Each module needs unique ID (kebab-case)
   - Title and description required
   - Lessons array starts empty

**Error handling:** If any validation fails, stop and report the specific error.

---

## Step 2 — Verify No Conflicts

Check that the course doesn't already exist:

1. Search `src/data/courses.ts` for the course ID
2. Check if `src/data/lessons/[course-id]/` directory exists
3. Check if `src/app/(sidebar)/[course-id]/` directory exists

**If conflicts found:** Report and STOP (don't overwrite).

---

## Step 3 — Create Course Directories

Create the folder structure in this order:

```
src/
├── data/
│   ├── lessons/
│   │   └── [course-id]/          ← CREATE
│   └── quizzes/
│       └── [course-id]/          ← CREATE
└── app/
    └── (sidebar)/
        └── [course-id]/          ← CREATE
            └── [slug]/           ← CREATE
```

**Commands to run:**
```bash
mkdir -p "src/data/lessons/[course-id]"
mkdir -p "src/data/quizzes/[course-id]"
mkdir -p "src/app/(sidebar)/[course-id]/[slug]"
```

**Error handling:** If directory creation fails, report and STOP.

---

## Step 4 — Write module.json

Create `src/data/lessons/[course-id]/module.json` with the following structure:

```json
[
  {
    "id": "[module-id]",
    "title": "[Module Title]",
    "description": "[Module description]",
    "lessons": []
  }
]
```

### Rules:

- Use 2-space indentation
- Array of module objects (even if only one module)
- Module IDs must be kebab-case
- Lessons array starts empty (will be populated as lessons are created)
- Add newline at end of file (EOF newline)

### Example:

```json
[
  {
    "id": "introducao",
    "title": "Introdução",
    "description": "Conceitos fundamentais e apresentação do protocolo DNS",
    "lessons": []
  }
]
```

**Error handling:** If file write fails, report and STOP.

---

## Step 5 — Register Course in courses.ts

Add a new course entry to `src/data/courses.ts`:

### Algorithm:

1. Read the current `courses.ts` file
2. Find the `courses` array declaration: `export const courses: Course[] = [`
3. Find the last course entry in the array (before the closing bracket)
4. Add a comma after the last entry (if not present)
5. Add the new course object:

```typescript
{
  id: "[course-id]",
  title: "[Course Title]",
  description: "[Course description]",
  backgroundImage: "[Image URL]",
  available: true,
}
```

6. Ensure proper formatting: commas, indentation, line breaks
7. Add newline at end of file

### Example Addition:

```typescript
{
  id: "protocolo-dns",
  title: "Protocolo DNS",
  description: "Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS.",
  backgroundImage: "https://images.unsplash.com/photo-xxx",
  available: true,
},
```

**Error handling:** If modification fails, report and STOP.

---

## Step 6 — Create Course Landing Page

Create `src/app/(sidebar)/[course-id]/page.tsx`:

### Template:

Use the existing `src/app/(sidebar)/redes-de-computadores/page.tsx` as a template and:

1. Replace all hardcoded `'redes-de-computadores'` with `'[course-id]'`
2. Replace metadata title with the new course title
3. Replace metadata description with the new course description
4. Keep all component imports and structure the same
5. Update breadcrumb text to match new course title
6. Update first lesson link to the first lesson ID (usually `charpter-1`)

### Key Sections to Update:

```typescript
// Metadata
export const metadata: Metadata = {
  title: "[Course Title]",
  description: "[Course description]",
};

// Course ID references
const course = getCourse('[course-id]');
let modules: Module[] = await getModules('[course-id]');

// Breadcrumbs and navigation
<BreadcrumbHome href={'/[course-id]'}>[Course Title]</BreadcrumbHome>

// First lesson link
<Link href={`/[course-id]/charpter-1`}>
```

**File path:** `src/app/(sidebar)/[course-id]/page.tsx`

**Error handling:** If file write fails, report and STOP.

---

## Step 7 — Create Lesson Route Page

Create `src/app/(sidebar)/[course-id]/[slug]/page.tsx`:

### Template:

Use the existing `src/app/(sidebar)/redes-de-computadores/[slug]/page.tsx` as a template and:

1. Replace all hardcoded `'redes-de-computadores'` with `'[course-id]'`
2. Keep all async functions and component logic the same
3. Update metadata title to reflect the new course
4. All other functionality remains identical (breadcrumbs, quiz loading, etc.)

### Key Sections to Update:

```typescript
// Generate metadata function - update course ID
const moduleName = '[course-id]';

// Page function - update course ID  
const moduleName = '[course-id]';
let lesson = await getLesson('[course-id]', slug);

// Breadcrumb - update course title
<BreadcrumbHome href={'/[course-id]'}>[Course Title]</BreadcrumbHome>

// Quiz loading - update course ID
let quiz = lesson.quizId ? await getQuiz('[course-id]', lesson.quizId) : null;

// QuizSection - update course ID
<QuizSection quiz={quiz} lessonId={lesson.id} courseId="[course-id]" />
```

**File path:** `src/app/(sidebar)/[course-id]/[slug]/page.tsx`

**Error handling:** If file write fails, report and STOP.

---

## Step 8 — Validate TypeScript and Build

After all files are created, validate the course:

### Commands:

```bash
# Run TypeScript check (no build needed yet)
npx tsc --noEmit

# Run Next.js build
npx next build
```

### Validation Rules:

1. `npx tsc --noEmit` must exit with code 0 (no TypeScript errors)
2. `npx next build` must exit with code 0 (successful build)
3. No warnings about missing routes or invalid references
4. Build output should show the new course being pre-rendered or dynamically rendered

### Error Handling:

If TypeScript check fails:
- List all TypeScript errors
- Common issues: missing imports, type mismatches in page.tsx
- Suggest fixes

If Next.js build fails:
- List all build errors
- Common issues: invalid JSX, missing modules, circular imports
- Suggest fixes

**STOP on error:** Do not proceed to Step 9 if validation fails.

---

## Step 9 — Atomic Write Summary

Report the successful course creation:

```
✅ COURSE CREATED SUCCESSFULLY

Course: [Course Title] ([course-id])
Status: Ready for lesson creation

Files Created:
  ✓ src/data/lessons/[course-id]/
  ✓ src/data/lessons/[course-id]/module.json
  ✓ src/data/quizzes/[course-id]/
  ✓ src/app/(sidebar)/[course-id]/page.tsx
  ✓ src/app/(sidebar)/[course-id]/[slug]/page.tsx

Files Updated:
  ✓ src/data/courses.ts (added course entry)

Validation:
  ✓ TypeScript: OK (no errors)
  ✓ Build: OK (exit code 0)

Course URL: /[course-id]
Landing Page: ✅ Active
Lesson Routes: ✅ Ready

Next Steps:
1. Add modules to module.json
2. Create lessons using the lesson creation pipeline
3. Publish lessons one by one
```

---

## Error Recovery

### If Validation Fails at Any Step:

1. **Identify which step failed** (folder creation, file write, build validation)
2. **Report the specific error** (file path, error message, exit code)
3. **Suggest recovery** (fix the issue and retry, or manually address the problem)
4. **Do NOT continue** to next steps if current step fails

### If Course Partially Created:

If files are created but build fails:

1. Report which files were created
2. Report the build error clearly
3. Suggest fixing the error (usually TypeScript issues in page.tsx)
4. Suggest rolling back or fixing manually
5. Provide the exact fix command or code change

### If Directory Already Exists:

1. Report "Course [course-id] already exists"
2. Suggest: rename the course ID or delete existing course first
3. STOP (don't overwrite)

---

## File Format Examples

### module.json Structure

```json
[
  {
    "id": "introducao",
    "title": "Introdução",
    "description": "Conceitos fundamentais do protocolo DNS",
    "lessons": []
  },
  {
    "id": "resolucao-de-nomes",
    "title": "Resolução de Nomes",
    "description": "Como o DNS resolve nomes de domínio para endereços IP",
    "lessons": []
  }
]
```

### courses.ts Addition

```typescript
{
  id: "protocolo-dns",
  title: "Protocolo DNS",
  description: "Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS, e implementação prática do DNS em redes.",
  backgroundImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2000&q=80",
  available: true,
},
```

---

## Naming Conventions

### Course IDs (kebab-case):
- ✅ `protocolo-dns`
- ✅ `introducao-ao-git`
- ✅ `redes-de-computadores`
- ❌ `ProtocoloDNS` (wrong: PascalCase)
- ❌ `protocolo_dns` (wrong: snake_case)
- ❌ `protocolo-DNS` (wrong: mixed case)

### Module IDs (kebab-case):
- ✅ `introducao`
- ✅ `resolucao-de-nomes`
- ✅ `tipos-de-registros`
- ❌ `Introducao` (wrong: PascalCase)

### Lesson IDs (hardcoded format):
- Standard: `charpter-1`, `charpter-2`, etc. (note: "charpter" is the convention in this codebase, not "chapter")
- Or custom format matching course naming

---

## Integration with Data Loading

The course is automatically loaded by:

1. **Bookshelf** (`src/components/bookshelf.tsx`) — fetches from `src/data/courses.ts`
2. **Course pages** — dynamic routes load course metadata via `getCourse()` and `getModules()`
3. **Lesson routes** — dynamic routes load lesson content via `getLesson()`
4. **Quiz loading** — quizzes loaded by `getQuiz()`

All of these functions **automatically detect** the new course once it's registered in `courses.ts` and directories are created.

**No additional configuration needed** — the course is immediately available.

---

## Key Principles

1. **Atomic Creation** — All files created together, or none at all
2. **Validation First** — Check inputs before creating anything
3. **Template Matching** — Use existing courses as exact templates
4. **No Overwrites** — Don't overwrite existing courses
5. **Clear Errors** — Every error includes context and recovery steps
6. **Build Validation** — Always validate with `npx next build`
7. **Portuguese Content** — All UI and descriptions in Brazilian Portuguese

---

## Testing the Created Course

After creation, test the course:

1. **Visit landing page:** http://localhost:3000/[course-id]
2. **Verify metadata** — course title, description, background image show
3. **Verify statistics** — module count, lesson count, duration display correctly
4. **Verify bookshelf** — course appears in course list/bookshelf
5. **Create first lesson** — start the lesson creation pipeline

---

## Limitations and Scope

### What This Skill Does:
✅ Creates course infrastructure
✅ Registers course in courses.ts
✅ Creates folder structure
✅ Initializes module.json with empty modules
✅ Creates page templates
✅ Validates build

### What This Skill Does NOT Do:
❌ Create lessons (use lesson creation pipeline)
❌ Create quiz content (use quiz-developer agent)
❌ Design visualizations (use p5js-developer agent)
❌ Write lesson content (use writer agent)
❌ Optimize images (use your own image CDN)

---

## Success Criteria

A course is **successfully created** when:

✅ Course ID is unique and valid format  
✅ Course registered in `src/data/courses.ts`  
✅ Directories created: `lessons/[course-id]/`, `quizzes/[course-id]/`  
✅ `module.json` created with proper JSON structure  
✅ Landing page created and matches template  
✅ Lesson route created and matches template  
✅ TypeScript validation passes (no errors)  
✅ Build validation passes (exit code 0)  
✅ Course accessible at /{course-id}  
✅ Course appears in bookshelf/navigation  

---

## Portuguese Content Guidelines

All course metadata should be in **Brazilian Portuguese (PT-BR)**:

### Example Titles:
- Protocolo DNS
- Introdução a Programação
- Fundamentos do Vue.js
- Redes de Computadores
- Sinais e Sistemas

### Example Descriptions:
"Domine os fundamentos das redes de computadores, desde a camada de transporte até protocolos como TCP e UDP, com foco nos conceitos essenciais para engenharia de computação."

### Example Modules:
- "Introdução"
- "Camada de Transporte"
- "Protocolos de Roteamento"
- "Segurança em Redes"

---

## ⭐ AUTOMATION SCRIPT (RECOMMENDED FOR PHASE 0)

**Instead of following steps 1-8 manually, use the automated script:**

```bash
npm run create-course \
  --id [course-id] \
  --title "[Title]" \
  --description "[50-500 chars]" \
  --image "[URL]" \
  --modules "[id:Title:Desc]" \
  --verbose
```

**Script automatically handles:**
- ✅ All 30+ validations (inputs, conflicts, formats)
- ✅ Atomic directory creation
- ✅ module.json generation with proper JSON structure
- ✅ courses.ts atomic registration
- ✅ Page template generation and substitution
- ✅ TypeScript validation (tsc --noEmit)
- ✅ Next.js build validation
- ✅ Clear success/error reporting

**Why use the script:**
1. **Accuracy** — 100% validation, zero manual errors
2. **Speed** — 1-2 minutes vs 15-20 minutes
3. **Consistency** — All courses created the same way
4. **Safety** — Atomic operations (all-or-nothing)
5. **Documentation** — Built-in error messages and recovery steps

**Documentation:**
- Quick start: `AUTOMATION_GETTING_STARTED.md`
- Reference: `scripts/README.md`
- Examples: `COMANDOS_PRONTOS.md`
- Architecture: `scripts/ARCHITECTURE.md`

---
