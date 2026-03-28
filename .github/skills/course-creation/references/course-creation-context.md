````markdown
# Course Creation Reference Guide

This document provides detailed reference information for understanding and implementing course creation in Trinity Academy.

---

## Complete Course Structure

After successful course creation, the file structure looks like this:

```
trinity-academy/
├── src/
│   ├── data/
│   │   ├── lessons/
│   │   │   ├── [existing courses...]
│   │   │   └── [course-id]/                    ← NEW COURSE
│   │   │       ├── module.json                 ← NEW FILE
│   │   │       └── (future: chapter files)
│   │   │
│   │   ├── quizzes/
│   │   │   ├── [existing courses...]
│   │   │   └── [course-id]/                    ← NEW COURSE DIR
│   │   │       └── (future: quiz files)
│   │   │
│   │   └── courses.ts                          ← UPDATED
│   │       (added course entry)
│   │
│   └── app/
│       └── (sidebar)/
│           ├── [existing courses...]
│           └── [course-id]/                    ← NEW COURSE ROUTES
│               ├── page.tsx                    ← NEW FILE (landing)
│               └── [slug]/
│                   └── page.tsx                ← NEW FILE (lessons)
│
└── .github/
    ├── agents/
    │   └── course-creator.agent.md
    └── skills/
        └── course-creation/
            ├── SKILL.md
            └── README.md
```

---

## Module.json Detailed Structure

The `module.json` file defines the course structure. Each course has one or more modules, each containing lessons.

### Structure

```json
[
  {
    "id": "module-id-1",
    "title": "Module Title",
    "description": "Module description explaining what students will learn",
    "lessons": [
      {
        "id": "lesson-id",
        "title": "Lesson Title",
        "description": "What this lesson covers",
        "video": {
          "thumbnail": "https://...",
          "duration": 300,
          "url": "https://..."
        },
        "quizId": "quiz-lesson-id"
      }
    ]
  },
  {
    "id": "module-id-2",
    "title": "Another Module",
    "description": "...",
    "lessons": []
  }
]
```

### Initial Structure (Created by Course Creator)

When a course is first created, modules have empty lessons arrays:

```json
[
  {
    "id": "introducao",
    "title": "Introdução",
    "description": "Conceitos fundamentais do protocolo DNS",
    "lessons": []
  }
]
```

### Module.json Rules

1. **Top-level is an array** — always `[...]`, even for one module
2. **Module IDs** — kebab-case, unique within course
3. **Module titles** — Portuguese, descriptive
4. **Module descriptions** — explain what students learn
5. **Lessons array** — starts empty, filled by lesson creation pipeline
6. **No comments** — JSON doesn't support comments
7. **2-space indentation** — consistent with project style
8. **Newline at EOF** — required for consistent formatting

### Real Example from Existing Course

From `src/data/lessons/redes-de-computadores/module.json`:

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
      }
    ]
  }
]
```

---

## courses.ts Structure

The `src/data/courses.ts` file contains the course registry.

### Course Type Definition

```typescript
export type Course = {
  id: string;              // kebab-case identifier
  title: string;           // Portuguese title
  description: string;     // Portuguese description
  backgroundImage: string; // image URL
  available: boolean;      // true = visible, false = hidden
};
```

### Full File Structure

```typescript
export type Course = {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  available: boolean;
};

export function getCourse(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export const courses: Course[] = [
  // ... existing courses ...
  
  // NEW COURSE ADDED HERE
  {
    id: "course-id",
    title: "Course Title",
    description: "Course description in Portuguese",
    backgroundImage: "https://...",
    available: true,
  },
];
```

### Course Entry Rules

1. **ID** — kebab-case, unique, 3-50 characters
2. **Title** — Portuguese, descriptive, not too long
3. **Description** — Portuguese, 50-500 characters, engaging
4. **Background Image** — valid URL, preferably responsive
5. **Available** — `true` (active) or `false` (hidden)
6. **Comma** — each entry except the last needs a trailing comma
7. **Indentation** — 2-space indent within object

### Example Entry

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

## Landing Page Template

The course landing page is created at `src/app/(sidebar)/[course-id]/page.tsx`.

### Template Overview

The template is copied from an existing course page (e.g., `redes-de-computadores`) and updated:

```typescript
import {
  Breadcrumb,
  BreadcrumbHome,
  Breadcrumbs,
  BreadcrumbSeparator,
} from "@/components/breadcrumbs";
import { ContentLink } from "@/components/content-link";
import { Logo } from "@/components/logo";
import { PageSection } from "@/components/page-section";
import { SidebarLayoutContent } from "@/components/sidebar-layout";
import { getModules, type Module } from "@/data/lessons";
import { getCourse } from "@/data/courses";
import { BookIcon } from "@/icons/book-icon";
import { ClockIcon } from "@/icons/clock-icon";
import { LessonsIcon } from "@/icons/lessons-icon";
import { PlayIcon } from "@/icons/play-icon";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "[COURSE TITLE]",  // ← REPLACE
  description: "[COURSE DESCRIPTION]", // ← REPLACE
};

function formatDuration(seconds: number): string {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds % 3600) / 60);

  return h > 0 ? (m > 0 ? `${h} hr ${m} min` : `${h} hr`) : `${m} min`;
}

export default async function Page() {
  const course = getCourse('[course-id]'); // ← REPLACE
  let modules: Module[] = await getModules('[course-id]'); // ← REPLACE
  let lessons = modules.flatMap(({ lessons }) => lessons);
  let duration = lessons.reduce(
    (sum, { video }) => sum + (video?.duration ?? 0),
    0,
  );

  return (
    <SidebarLayoutContent
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbHome href={'/[course-id]'}>[COURSE TITLE]</BreadcrumbHome> {/* ← REPLACE */}
          <BreadcrumbSeparator />
          <Breadcrumb>Conteúdo</Breadcrumb>
        </Breadcrumbs>
      }
    >
      {/* ... rest of page ... */}
    </SidebarLayoutContent>
  );
}
```

### Key Changes When Creating

1. **Line `export const metadata: Metadata = {`**
   - Change `title: "[OLD COURSE]"` → `title: "[NEW COURSE TITLE]"`
   - Change `description: "..."` → actual course description

2. **Line `const course = getCourse('...');`**
   - Change `getCourse('[old-course-id]')` → `getCourse('[new-course-id]')`

3. **Line `let modules: Module[] = await getModules('...');`**
   - Change `getModules('[old-course-id]')` → `getModules('[new-course-id]')`

4. **Breadcrumbs section**
   - Change breadcrumb href `/[old-course-id]` → `/{new-course-id}`
   - Change breadcrumb text to new course title

5. **First lesson link (usually near bottom)**
   - Change link href `/[old-course-id]/charpter-1` → `/{new-course-id}/charpter-1`

---

## Lesson Route Template

The lesson route is created at `src/app/(sidebar)/[course-id]/[slug]/page.tsx`.

### Template Overview

Similar to landing page, but handles dynamic lesson loading:

```typescript
import {
  Breadcrumb,
  BreadcrumbHome,
  Breadcrumbs,
  BreadcrumbSeparator,
} from "@/components/breadcrumbs";
import { NextPageLink } from "@/components/next-page-link";
import { QuizSection } from "@/components/quiz-section";
import { SidebarLayoutContent } from "@/components/sidebar-layout";
import TableOfContents from "@/components/table-of-contents";
import { Video } from "@/components/video-player";
import { getLesson, getLessonContent } from "@/data/lessons";
import { getQuiz } from "@/data/quizzes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  let lesson = await getLesson('[course-id]', (await params).slug); // ← REPLACE
  return {
    title: `${lesson?.title} - [COURSE TITLE]`, // ← REPLACE
    description: lesson?.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const moduleName = '[course-id]'; // ← REPLACE
  let slug = (await params).slug;
  let lesson = await getLesson('[course-id]', slug); // ← REPLACE

  if (!lesson) {
    notFound();
  }

  let Content = await getLessonContent(`${moduleName}/${slug}`);
  let quiz = lesson.quizId
    ? await getQuiz('[course-id]', lesson.quizId) // ← REPLACE
    : null;

  return (
    <SidebarLayoutContent
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbHome href={'/[course-id]'}>[COURSE TITLE]</BreadcrumbHome> {/* ← REPLACE */}
          <BreadcrumbSeparator className="max-md:hidden" />
          <Breadcrumb>{lesson.title}</Breadcrumb>
        </Breadcrumbs>
      }
    >
      {/* ... rest of page ... */}
      {quiz && (
        <div className="mt-16">
          <QuizSection
            quiz={quiz}
            lessonId={lesson.id}
            courseId="[course-id]" // ← REPLACE
          />
        </div>
      )}
      {/* ... rest of page ... */}
    </SidebarLayoutContent>
  );
}
```

### Key Changes When Creating

1. **`generateMetadata` function**
   - Line `let lesson = await getLesson('[course-id]', ...)`
   - Line `title: \`...- [COURSE TITLE]\`` (display title)

2. **`Page` component**
   - Line `const moduleName = '[course-id]';`
   - Line `let lesson = await getLesson('[course-id]', ...)`
   - Line `await getQuiz('[course-id]', ...)`

3. **Breadcrumbs**
   - Line `<BreadcrumbHome href={'/[course-id]'}>`
   - Text content for breadcrumb

4. **QuizSection props**
   - Line `courseId="[course-id]"`

---

## Naming Conventions and Standards

### Course IDs

**Format:** kebab-case (lowercase, hyphens only)

**Examples (valid):**
- `protocolo-dns`
- `introducao-a-programacao`
- `redes-de-computadores`
- `sinais-e-sistemas`
- `git-fundamentals`

**Examples (invalid):**
- `ProtocoloDNS` ❌ (PascalCase)
- `protocolo_dns` ❌ (snake_case)
- `protocolo dns` ❌ (spaces)
- `DNS-Protocol` ❌ (mixed case)

### Module IDs

**Format:** kebab-case, descriptive within course context

**Examples (valid):**
- `introducao`
- `camada-de-transporte`
- `protocolos-de-roteamento`
- `seguranca-em-redes`

**Examples (invalid):**
- `Module1` ❌ (PascalCase, not descriptive)
- `introduction` ❌ (English when Portuguese expected)

### Titles (in Portuguese)

**Format:** Natural Portuguese, capitalized properly

**Examples (valid):**
- "Protocolo DNS"
- "Introdução a Programação"
- "Fundamentos do Vue.js"
- "Sinais e Sistemas"
- "Redes de Computadores"

**Examples (invalid):**
- "protocolo dns" ❌ (not capitalized)
- "DNS Protocol" ❌ (English)
- "PROTOCOLO DNS" ❌ (all caps)

### Descriptions (in Portuguese)

**Format:** Natural Portuguese, engaging, 50-500 characters

**Examples (valid):**
- "Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS."
- "Domine os fundamentos das redes de computadores, desde a camada de transporte até protocolos como TCP e UDP."

**Examples (invalid):**
- Too short: "Learn DNS" ❌
- Too long: (500+ characters) ❌
- Not Portuguese: "Understanding DNS" ❌

---

## Background Image Guidelines

### Requirements

1. **Valid URL** — must be accessible and work with Next.js Image optimization
2. **Aspect Ratio** — typically landscape (16:9 or similar)
3. **Dimensions** — 1200px+ width recommended
4. **Optimization** — use CDN or image optimization service
5. **Copyright** — must be freely usable (stock images recommended)

### Recommended Sources

1. **Unsplash** — https://unsplash.com/ (free, high quality)
   - Example: `https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2000&q=80`

2. **ImageKit** — image optimization service used in project
   - Example: `https://ik.imagekit.io/qfmgarse7/...`

3. **Pexels** — https://www.pexels.com/ (free stock photos)

### Image URL Format

```
https://[source]/[path]?auto=format&fit=crop&w=2000&q=80
```

### Examples for Different Courses

| Course | Image URL | Description |
|--------|-----------|-------------|
| Protocolo DNS | `https://images.unsplash.com/photo-1635070041078-e363dbe005cb` | Network/server related |
| Intro Programação | `https://images.unsplash.com/photo-1517694712202-14dd7270c5e1` | Code/development |
| Vue.js | `https://images.unsplash.com/photo-1517694712202...` | Web development |
| Redes | `https://images.unsplash.com/photo-1516321318423-f06f70504ba0` | Network topology |

---

## Course Creation Workflow Diagram

```
START
  │
  ├─→ User provides course description
  │
  ├─→ Course Creator Agent receives input
  │
  ├─→ Validate inputs
  │   ├─ Check ID format (kebab-case)
  │   ├─ Check uniqueness (not in courses.ts)
  │   ├─ Check required fields
  │   └─ Validate metadata
  │
  ├─→ Create folder structure
  │   ├─ mkdir src/data/lessons/[course-id]/
  │   ├─ mkdir src/data/quizzes/[course-id]/
  │   └─ mkdir src/app/(sidebar)/[course-id]/[slug]/
  │
  ├─→ Write module.json
  │   └─ Create with initial modules
  │
  ├─→ Register course in courses.ts
  │   └─ Add course entry to array
  │
  ├─→ Create landing page
  │   └─ Create src/app/(sidebar)/[course-id]/page.tsx
  │
  ├─→ Create lesson routes
  │   └─ Create src/app/(sidebar)/[course-id]/[slug]/page.tsx
  │
  ├─→ Validate build
  │   ├─ npx tsc --noEmit
  │   └─ npx next build
  │
  ├─→ Report success
  │   └─ Course ready at /{course-id}
  │
  └─→ END (Ready for lesson creation pipeline)
```

---

## Integration with Lesson Creation Pipeline

The course creator is the **foundation** for the lesson pipeline:

```
┌─────────────────────────────────────────┐
│ COURSE CREATION (You Are Here)          │
│ ✓ Course infrastructure                  │
│ ✓ Folder structure ready                 │
│ ✓ Routes created                         │
│ ✓ Build validates                        │
└─────────────────────────────────────────┘
                    ↓
        Ready for lesson creation
                    ↓
┌─────────────────────────────────────────┐
│ LESSON CREATION PIPELINE                │
│ Phase 1: Writer creates content          │
│ Phase 2: Design Annotator adds specs     │
│ Phase 3: P5.js Developer implements      │
│ Phase 4: Quiz Developer creates tests    │
│ Phase 5: Integration Orchestrator joins  │
└─────────────────────────────────────────┘
                    ↓
        Lessons added to course
                    ↓
┌─────────────────────────────────────────┐
│ DEPLOYMENT & PUBLICATION                │
│ ✓ Course live at /[course-id]            │
│ ✓ Lessons visible in course              │
│ ✓ Quizzes functional                     │
│ ✓ Students can enroll and learn          │
└─────────────────────────────────────────┘
```

---

## Files Reference

### New Agent File

**Location:** `.github/agents/course-creator.agent.md`

Defines:
- Agent mission and capabilities
- Input requirements
- Output specification
- Quality criteria
- Integration with lesson pipeline

### New Skill File

**Location:** `.github/skills/course-creation/SKILL.md`

Contains detailed implementation:
- Step-by-step process
- Validation rules
- File structure details
- Error handling
- Code examples

### This Reference Guide

**Location:** `.github/skills/course-creation/references/course-creation-context.md`

Provides:
- Visual workflow diagrams
- Template code examples
- File structure details
- Naming conventions
- Integration points

### README

**Location:** `.github/skills/course-creation/README.md`

Quick reference with:
- What the skill handles
- Quick examples
- Testing procedures
- Next steps

---

## Success Indicators

A successful course creation includes:

✅ **Infrastructure Ready**
- Course appears in bookshelf
- Landing page loads with course metadata
- Module structure visible

✅ **Routes Functional**
- Landing page at /{course-id}
- Route to first lesson works (shows lesson page, no content yet)

✅ **Metadata Correct**
- Course title, description, and image display
- Module titles and descriptions correct
- Statistics calculated correctly

✅ **Ready for Lessons**
- module.json properly formatted for lesson creation
- Lesson routes ready to accept lesson files
- Quiz directories ready for quiz files

---

## Troubleshooting

### "Course ID already exists"

**Problem:** The course ID is already registered in courses.ts.

**Solution:** 
1. Choose a different course ID
2. Or, use `rm -rf` to delete old course directories and edit courses.ts to remove the entry
3. Then retry course creation

### "Invalid course ID format"

**Problem:** The course ID doesn't follow kebab-case (e.g., `ProtocoloDNS` instead of `protocolo-dns`).

**Solution:**
1. Use only lowercase, hyphens, and alphanumeric characters
2. Examples: `protocolo-dns`, `introducao-ao-git`, `redes-de-computadores`

### "Build failed: TypeScript errors"

**Problem:** TypeScript compilation failed when validating the created pages.

**Solution:**
1. Check page.tsx for missing imports
2. Ensure course IDs are correctly updated throughout the file
3. Verify function calls match actual function signatures
4. Common fixes: add missing imports, fix property access

### "Directory already exists"

**Problem:** The course directories were partially created before failure.

**Solution:**
1. `rm -rf src/data/lessons/[course-id]`
2. `rm -rf src/data/quizzes/[course-id]`
3. `rm -rf src/app/\(sidebar\)/[course-id]`
4. Remove course entry from courses.ts
5. Retry course creation

---

## Appendix: Environment Variables

No special environment variables needed for course creation. The skill uses:

- `src/data/courses.ts` — course registry
- `src/data/lessons/` — lesson metadata and content
- `src/data/quizzes/` — quiz JSON files
- `src/app/(sidebar)/` — route pages

All paths are relative to project root.

---

## Appendix: Language Reference

All content created must be in **Brazilian Portuguese (PT-BR)**:

### Common Terminology

| English | Portuguese |
|---------|-----------|
| Course | Curso |
| Lesson | Aula |
| Module | Módulo |
| Quiz | Questionário |
| Introduction | Introdução |
| Fundamentals | Fundamentos |
| Protocol | Protocolo |
| Network | Rede |
| Programming | Programação |

### Example Course Names

- "Protocolo DNS" (DNS Protocol)
- "Introdução a Programação" (Introduction to Programming)
- "Fundamentos do Vue.js" (Vue.js Fundamentals)
- "Redes de Computadores" (Computer Networks)
- "Sinais e Sistemas" (Signals and Systems)

---

## Document Version

- Version: 1.0
- Last Updated: March 2026
- Created for Trinity Academy Course Creator Agent
````

