````markdown
# Course Creator Integration in Trinity Academy Pipeline

This document describes how the Course Creator agent fits into the overall Trinity Academy lesson creation pipeline and ecosystem.

---

## Complete Content Creation Pipeline

Trinity Academy has a **7-phase pipeline** for taking educational ideas and publishing them as interactive lessons.

### The Full Pipeline

```
┌────────────────────────────────────────────────────────────────────┐
│                      CONTENT CREATION PIPELINE                     │
└────────────────────────────────────────────────────────────────────┘

PHASE 0: COURSE SETUP ⭐ (COURSE CREATOR)
┌──────────────────────────────────────────┐
│  Course Creator Agent                    │
│  ✓ Validate course requirements          │
│  ✓ Create course infrastructure          │
│  ✓ Set up folders and metadata           │
│  ✓ Create route pages                    │
│  ✓ Validate build                        │
│  Output: Complete course skeleton        │
└──────────────────────────────────────────┘
                    ↓
        Course ready at /[course-id]
     (no lessons yet, infrastructure set)
                    ↓

PHASE 1: PLANNING & STRATEGY
┌──────────────────────────────────────────┐
│  Lesson Brief / Learning Objectives      │
│  - Topic: "Protocolo DNS"                │
│  - Course: "protocolo-dns"               │
│  - Objectives: 3-4 learning goals        │
│  - Prerequisites: Covered courses        │
└──────────────────────────────────────────┘
                    ↓

PHASE 2: CONTENT CREATION (WRITER AGENT)
┌──────────────────────────────────────────┐
│  Writer Agent                            │
│  ✓ Write MDX lesson content              │
│  ✓ Structure with headings, sections     │
│  ✓ Include narrative, explanations       │
│  ✓ Mark visual opportunities with {{}}   │
│  Output: Annotated MDX file              │
└──────────────────────────────────────────┘
                    ↓

PHASE 3: VISUAL DESIGN (DESIGN ANNOTATOR)
┌──────────────────────────────────────────┐
│  Design Annotator Agent                  │
│  ✓ Identify high-impact visual spots     │
│  ✓ Write {{ SPEC }} blocks               │
│  ✓ Specify: type, size, behavior, labels│
│  Output: Annotated MDX with specs        │
└──────────────────────────────────────────┘
                    ↓

PHASE 4: VISUALIZATION (P5.JS DEVELOPER)
┌──────────────────────────────────────────┐
│  P5.js Developer Agent                   │
│  ✓ Parse {{ SPEC }} blocks               │
│  ✓ Build p5.js components                │
│  ✓ Implement setup/draw/interaction      │
│  ✓ Register in mdx-components.tsx        │
│  Output: TSX component file              │
└──────────────────────────────────────────┘
                    ↓

PHASE 5: QUIZ CREATION (QUIZ DEVELOPER)
┌──────────────────────────────────────────┐
│  Quiz Developer Agent                    │
│  ✓ Design 8-12 learning questions        │
│  ✓ Create plausible distractors          │
│  ✓ Write educational explanations        │
│  ✓ Validate JSON structure               │
│  Output: Quiz JSON file                  │
└──────────────────────────────────────────┘
                    ↓

PHASE 6: INTEGRATION (INTEGRATION ORCHESTRATOR)
┌──────────────────────────────────────────┐
│  Integration Orchestrator Agent          │
│  ✓ Receive all upstream outputs          │
│  ✓ Write 3 files atomically              │
│  ✓ Update module.json metadata           │
│  ✓ Register components                   │
│  ✓ Validate build                        │
│  Output: Integrated lesson + report      │
└──────────────────────────────────────────┘
                    ↓

PHASE 7: DEPLOYMENT & PUBLICATION
┌──────────────────────────────────────────┐
│  Git / GitHub / CI-CD                    │
│  ✓ Commit integrated files               │
│  ✓ Create PR for review                  │
│  ✓ Run tests and checks                  │
│  ✓ Deploy to staging / production        │
│  Output: Lesson live on Trinity          │
└──────────────────────────────────────────┘
                    ↓

RESULT: Course with Lessons
┌──────────────────────────────────────────┐
│  https://trinity.academy/protocolo-dns/  │
│  charpter-1 [Content+Visuals+Quiz]       │
│  charpter-2 [Content+Visuals+Quiz]       │
│  charpter-3 [...]                        │
└──────────────────────────────────────────┘
```

---

## Course Creator's Role

### Where Course Creator Sits

**Course Creator = Phase 0 (before all other agents)**

```
[USER REQUIREMENT]
  "Create a course about DNS"
        ↓
  [COURSE CREATOR] ← You are here!
  (Creates infrastructure)
        ↓
  [Course ready]
        ↓
  [WRITER AGENT]
  (Creates lesson content)
        ↓
  [Rest of pipeline...]
```

### What Course Creator Enables

The Course Creator **unlocks** the lesson creation pipeline by:

1. **Creating course structure** — folders and metadata files
2. **Registering course** — makes it visible in the app
3. **Creating route pages** — lesson URLs become accessible
4. **Validating build** — ensures no TypeScript errors
5. **Preparing for lessons** — module.json ready for lessons

### What Comes After

Once a course is created:

- **Writers** can create lesson content (MDX files)
- **Designers** can annotate visual specifications
- **P5.js developers** can implement visualizations
- **Quiz developers** can create assessments
- **Integration orchestrators** can combine everything

---

## Agent Responsibilities

### Course Creator is Responsible For:

```
✅ DO THIS (Course Creator's Job)
├─ Create course folders
├─ Write module.json
├─ Register course in courses.ts
├─ Create landing page
├─ Create lesson routes
├─ Validate build
└─ Report success/failure
```

### Course Creator is NOT Responsible For:

```
❌ DON'T DO THIS (Other agents' jobs)
├─ Write lesson content (→ Writer)
├─ Design visualizations (→ P5.js Dev)
├─ Create quiz questions (→ Quiz Dev)
├─ Implement p5.js (→ P5.js Dev)
├─ Design visual specs (→ Design Annotator)
└─ Integrate artifacts (→ Integration Orchestrator)
```

---

## Data Flow

### Input to Course Creator

```json
{
  "id": "protocolo-dns",
  "title": "Protocolo DNS",
  "description": "...",
  "backgroundImage": "https://...",
  "initialModules": [
    {
      "id": "introducao",
      "title": "Introdução",
      "description": "..."
    }
  ]
}
```

### Output from Course Creator

```
Files Created:
  → src/data/lessons/protocolo-dns/module.json
  → src/app/(sidebar)/protocolo-dns/page.tsx
  → src/app/(sidebar)/protocolo-dns/[slug]/page.tsx

Directories Created:
  → src/data/lessons/protocolo-dns/
  → src/data/quizzes/protocolo-dns/

Files Updated:
  → src/data/courses.ts

Ready For:
  → Writer (creates MDX content)
  → Design Annotator (annotates visuals)
  → P5.js Developer (creates components)
  → Quiz Developer (creates quizzes)
  → Integration Orchestrator (combines all)
```

---

## Workflow: Creating a Course and Its Lessons

### Step 1: Course Creation (Course Creator)

```
Input: Course description
  ↓
Course Creator validates and creates infrastructure
  ↓
Output: Course ready at /protocolo-dns
  Status: No lessons yet, but routes exist
```

**Time:** ~30 seconds

**Files:** 5 created/updated

### Step 2: First Lesson (Lesson Pipeline)

```
Input: Lesson topic "Resolução de Nomes"
  ↓
Writer → content
Design Annotator → specs
P5.js Dev → visualizations
Quiz Dev → questions
Integration Orchestrator → combines all
  ↓
Output: Lesson live at /protocolo-dns/charpter-1
  Status: Full content, visuals, quiz
```

**Time:** ~2-3 hours (collaborative effort)

**Files:** 5 created (content, visual, quiz, updated module.json, mdx-components.tsx)

### Step 3: Additional Lessons

```
Repeat Step 2 for each lesson
  ↓
Output: Complete course with multiple lessons
  Status: Ready for students
```

---

## File Dependencies

### After Course Creator Runs

```
courses.ts
  ↓
  ├─ defines: id, title, description, backgroundImage
  └─ used by: Bookshelf, Course page, Navigation
             (all load course from this registry)

module.json (in lessons/[course-id]/)
  ↓
  ├─ initially: empty modules with no lessons
  ├─ updated by: Integration Orchestrator (adds lessons)
  └─ used by: Course page (displays modules/lessons)

page.tsx (in [course-id]/)
  ↓
  ├─ reads from: courses.ts, module.json
  ├─ displays: course overview, modules, lessons
  └─ links to: lesson pages

[slug]/page.tsx (in [course-id]/[slug]/)
  ↓
  ├─ reads from: module.json, lesson content (MDX)
  ├─ displays: lesson content, video, quiz
  └─ loads: quiz from quizzes/[course-id]/
```

---

## Integration Points with Lesson Pipeline

### Module.json Updates

As lessons are created by the pipeline:

```
INITIAL (Course Creator):
[
  {
    "id": "introducao",
    "title": "Introdução",
    "description": "...",
    "lessons": []           ← Empty initially
  }
]

AFTER LESSON 1 (Integration Orchestrator):
[
  {
    "id": "introducao",
    "title": "Introdução",
    "description": "...",
    "lessons": [
      {
        "id": "charpter-1",
        "title": "Resolução de Nomes",
        "description": "...",
        "video": null,
        "quizId": "quiz-charpter-1"
      }
    ]
  }
]
```

The module.json **evolves** as lessons are added.

---

## Cascading Dependencies

### Course Creation Enables Everything

```
PHASE 0: Course Creator
  ├─ Creates folders
  ├─ Creates module.json (empty)
  ├─ Creates route pages
  └─ Registers course
       ↓ (enables)
       
PHASE 1-6: Lesson Pipeline
  ├─ Writer creates content
  ├─ Design Annotator annotates
  ├─ P5.js Dev builds visuals
  ├─ Quiz Dev creates questions
  └─ Integration Orchestrator combines
       ↓ (adds to)
       
PHASE 7: Deployment
  ├─ Commits to Git
  ├─ Runs CI/CD tests
  └─ Deploys to production
       ↓ (results in)
       
LIVE COURSE
  └─ Available at /[course-id]
     (with lessons, visuals, quizzes)
```

### Without Course Creator

If you skip course creation:

```
❌ Folders don't exist
❌ Routes don't work
❌ Course not registered
❌ Lesson creation fails
  (can't create lesson.mdx without folder)
❌ Build breaks
  (missing routes, missing registrations)
```

**Course Creator is CRITICAL FIRST STEP.**

---

## Quality Assurance Checkpoints

### Course Creator Validates:

```
✓ Input validation
  └─ ID format, uniqueness, metadata completeness

✓ File operations
  └─ All files created successfully

✓ TypeScript compilation
  └─ npx tsc --noEmit (exit 0)

✓ Next.js build
  └─ npx next build (exit 0)

✓ Route accessibility
  └─ Pages render correctly (if tested)

✓ No overwrites
  └─ Won't replace existing courses
```

### Lesson Pipeline Validates:

```
✓ Content quality (Writer)
✓ Visual specifications (Design Annotator)
✓ Component implementation (P5.js Dev)
✓ Quiz structure (Quiz Dev)
✓ Atomic integration (Integration Orchestrator)
✓ Build passes (Integration Orchestrator)
✓ Lesson accessibility (Integration Orchestrator)
```

---

## Error Handling & Recovery

### If Course Creator Fails

At any validation or file creation step:

```
❌ Failure at Step X (e.g., module.json write fails)

Recovery Options:
1. Fix the issue (e.g., invalid course ID)
2. Retry course creation
3. Manual intervention if needed:
   - rm -rf src/data/lessons/[course-id]
   - rm -rf src/data/quizzes/[course-id]
   - rm -rf src/app/(sidebar)/[course-id]
   - Edit src/data/courses.ts to remove entry
4. Retry again

Build Failure:
  Indicates TypeScript error in generated page.tsx
  Usually: missing import or hardcoded value not updated
  → Agent should fix and retry
```

### If Lesson Pipeline Fails

```
❌ If integration fails at any step

Recovery:
1. Fix the upstream issue (content, visual spec, quiz structure)
2. Re-run that agent
3. Integration orchestrator re-runs
4. Module.json updated once successful

Partial Creation:
  If some lessons created but others fail:
  → Remove failed lessons, retry those agents
  → Keep successful lessons intact
```

---

## Monitoring and Metrics

### After Course Creation

Course immediately available:

```
Dashboard Stats:
  Course ID: protocolo-dns
  Modules: 1
  Lessons: 0
  Quizzes: 0
  Students Enrolled: 0
  Avg Completion: N/A (no lessons)

As lessons are added:
  Lessons: increases
  Quizzes: increases
  Students can enroll
  Completion rates appear
```

### Course Visibility

```
✅ Bookshelf (course list)
   Shows: title, description, background image, module count

✅ Navigation
   Course appears in course list

✅ Direct URL
   /protocolo-dns (works immediately)

✅ Search (if implemented)
   Course discoverable by title/description
```

---

## Best Practices

### When Creating a Course

1. **Choose a good ID** — kebab-case, descriptive, unique
   - ✅ `protocolo-dns`
   - ❌ `DNS`, `ProtocolDNS`, `protocol_dns`

2. **Write clear description** — 50-500 characters, Portuguese
   - ✅ "Compreenda o Sistema de Nomes de Domínios..."
   - ❌ "Learn DNS" (too short, English)

3. **Use quality background image** — relevant, accessible, optimized
   - ✅ Unsplash, ImageKit with CDN
   - ❌ Local file, broken URL, wrong aspect ratio

4. **Create at least one module** — course needs structure
   - ✅ `[{id: "introducao", title: "Introdução", ...}]`
   - ❌ `[]` (empty modules array)

5. **Validate build after creation** — ensure no errors
   - ✅ `npm run build` (exit 0)
   - ❌ Ignored build errors

### When Creating Lessons

6. **Follow course structure** — add lessons to existing modules
   - ✅ Update module.json with lesson entries
   - ❌ Create new unexpected modules

7. **Use consistent naming** — charpter-1, charpter-2, etc.
   - ✅ `charpter-1` (following project convention, despite typo)
   - ❌ `lesson-1`, `ch1`, `chapter-1`

8. **Test each lesson** — visit /course-id/lesson-id
   - ✅ Content, visuals, quiz all load
   - ❌ Broken images, missing components

---

## Troubleshooting Reference

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Course ID already exists" | ID in courses.ts | Choose different ID |
| "Invalid course ID format" | Not kebab-case | Fix to `course-id` |
| "Build failed: TypeScript" | Error in page.tsx | Check imports, hardcoded values |
| "Module.json invalid JSON" | Syntax error | Validate JSON structure |
| "Directory exists" | Partial creation | Delete folders, retry |
| "Background image 404" | Invalid URL | Use valid image CDN |

---

## Artifacts and Documentation

### Course Creator Deliverables

```
Agent Files:
  .github/agents/course-creator.agent.md
    → Agent definition, mission, inputs/outputs

Skill Files:
  .github/skills/course-creation/
    ├─ SKILL.md (detailed implementation)
    ├─ README.md (quick reference)
    └─ references/
        ├─ course-creation-context.md (this file)
        ├─ examples.md (practical examples)
        └─ pipeline-integration.md (pipeline overview)

Created Course Files:
  src/data/lessons/[course-id]/
    └─ module.json
  
  src/data/quizzes/[course-id]/
    (directory only)
  
  src/app/(sidebar)/[course-id]/
    ├─ page.tsx (landing page)
    └─ [slug]/
        └─ page.tsx (lesson route)
  
  src/data/courses.ts
    (updated with course entry)
```

---

## Next Steps After Course Creation

1. ✅ **Course created** ← You are here
2. → **Create first lesson** (use writer agent + pipeline)
3. → **Test lesson** (visit /course-id/charpter-1)
4. → **Create more lessons** (repeat pipeline)
5. → **Monitor metrics** (track student progress)
6. → **Iterate and improve** (update lessons based on feedback)

---

## Summary

**Course Creator is the foundation of Trinity Academy's content creation pipeline.**

It takes a course description and creates the complete infrastructure needed for lessons to be built. Without course creation, the entire lesson pipeline cannot function.

The agent is designed to be:
- **Autonomous** — requires only course metadata, no manual file creation
- **Atomic** — all-or-nothing, preventing partial/broken states
- **Validated** — every step checked, build confirmed
- **Clear** — detailed error messages and recovery instructions
- **Integrated** — seamlessly connects to lesson pipeline

Once a course is created, it immediately becomes part of the Trinity Academy ecosystem, available in the bookshelf and accessible to the entire lesson creation pipeline.
````

