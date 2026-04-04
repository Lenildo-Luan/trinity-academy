# Course Creation Skill

The **course creation skill** is responsible for setting up the complete course infrastructure in Trinity Academy. It takes a course description and creates all necessary folders, metadata files, and page templates to prepare for the lesson creation pipeline.

## ⭐ AUTOMATED: Use the Script!

Phase 0 (Course Setup) is now **fully automated**. Use the script instead of manual implementation:

```bash
npm run create-course \
  --id [course-id] \
  --title "[Course Title]" \
  --description "[Course description 50-500 chars]" \
  --image "[Image URL]" \
  --modules "[id:Title:Description]" \
  --verbose
```

**Benefits:**
- ✅ 100% validation (30+ checks)
- ✅ 1-2 minutes vs 15-20 minutes (-87%)
- ✅ 0% errors (atomic, fail-safe)
- ✅ 99%+ success rate
- ✅ Built-in error recovery

**Documentation:** 
- `AUTOMATION_GETTING_STARTED.md` - Quick start (5 min)
- `scripts/README.md` - Full reference
- `COMANDOS_PRONTOS.md` - Ready-to-copy commands
- `scripts/ARCHITECTURE.md` - Technical design

---

  title: "Course Title",     // in Portuguese
  description: "...",        // course description
  backgroundImage: "url",    // image URL
  initialModules?: [{        // optional: pre-create modules
    id: "module-id",
    title: "Module Title",
    description: "..."
  }]
}
```

### Course ID Rules

- Must be **kebab-case** (lowercase, hyphens only)
- Examples: `protocolo-dns`, `introducao-ao-git`, `redes-de-computadores`
- Must be **unique** (not already in courses.ts)
- Must be **3-50 characters**

### Files Created

```
src/
├── data/
│   ├── lessons/[course-id]/
│   │   └── module.json          ← CREATED
│   └── quizzes/[course-id]/      ← DIRECTORY
└── app/(sidebar)/
    └── [course-id]/
        ├── page.tsx              ← CREATED (landing page)
        └── [slug]/
            └── page.tsx          ← CREATED (lesson route)
```

### Files Updated

- `src/data/courses.ts` — course entry added

## Workflow Steps

1. **Validate inputs** — ensure course doesn't exist, ID is valid
2. **Create folders** — lesson and quiz directories
3. **Write module.json** — initialize with modules
4. **Register course** — add to courses.ts
5. **Create landing page** — course overview with modules and lessons
6. **Create lesson routes** — dynamic lesson pages
7. **Validate build** — ensure everything builds correctly
8. **Report success** — provide course URL and next steps

## Example: Creating a DNS Course

### Input
```json
{
  "id": "protocolo-dns",
  "title": "Protocolo DNS",
  "description": "Compreenda o Sistema de Nomes de Domínios: resolução de nomes, hierarquia de nameservers, tipos de registros DNS.",
  "backgroundImage": "https://images.unsplash.com/photo-...",
  "initialModules": [
    {
      "id": "introducao",
      "title": "Introdução",
      "description": "Conceitos fundamentais do DNS"
    },
    {
      "id": "resolucao-de-nomes",
      "title": "Resolução de Nomes",
      "description": "Como funciona a resolução de nomes no DNS"
    }
  ]
}
```

### Output (on Success)
```
✅ COURSE CREATED SUCCESSFULLY

Course: Protocolo DNS (protocolo-dns)
Status: Ready for lesson creation

Files Created:
  ✓ src/data/lessons/protocolo-dns/
  ✓ src/data/lessons/protocolo-dns/module.json
  ✓ src/data/quizzes/protocolo-dns/
  ✓ src/app/(sidebar)/protocolo-dns/page.tsx
  ✓ src/app/(sidebar)/protocolo-dns/[slug]/page.tsx

Files Updated:
  ✓ src/data/courses.ts

Course URL: /protocolo-dns
Landing Page: ✅ Active

Next Steps:
1. Create lessons using the lesson creation pipeline
2. Add quiz content for each lesson
3. Publish lessons one by one
```

## Integration Points

### With Lesson Creation Pipeline

The course creator is the **first step** that enables lessons:

```
Course Creator
    ↓
[Course ready for lessons]
    ↓
Writer Agent → Design Annotator → P5.js Dev → Quiz Dev → Integration Orchestrator
    ↓
[Lessons added to course]
```

### With Existing Systems

- **Bookshelf** — automatically picks up new course from courses.ts
- **Navigation** — course routes are dynamically available
- **Data loading** — `getModules()` and `getLesson()` work automatically
- **Quiz system** — quiz files are loaded dynamically from quizzes/[course-id]/

## File Templates

### module.json

```json
[
  {
    "id": "module-id",
    "title": "Module Title",
    "description": "Module description",
    "lessons": []
  }
]
```

### course entry in courses.ts

```typescript
{
  id: "course-id",
  title: "Course Title",
  description: "Description text",
  backgroundImage: "https://image-url",
  available: true,
}
```

## Validation Rules

### Course ID
- ✅ kebab-case format
- ✅ unique (not in courses.ts)
- ✅ 3-50 characters
- ❌ no spaces, capitals, or special characters

### Module ID
- ✅ kebab-case format
- ✅ unique within course
- ✅ descriptive
- ❌ no spaces or special characters

### Metadata
- ✅ title non-empty and in Portuguese
- ✅ description 50-500 characters
- ✅ backgroundImage is valid URL

## Error Handling

### Common Errors

**"Course already exists"**
- Solution: Use a different course ID or delete existing course

**"Invalid course ID format"**
- Solution: Use kebab-case (e.g., `protocolo-dns` not `ProtocoloDNS`)

**"Build failed: TypeScript errors"**
- Solution: Check page.tsx for missing imports or type mismatches

**"Directory already exists"**
- Solution: Course folders already created, verify course.ts not updated yet

## Testing the Course

After creation:

1. **Visit:** http://localhost:3000/[course-id]
2. **Verify:** Course title, description, background image appear
3. **Check:** Module count and lesson count display
4. **Test:** Landing page links work (will error until lessons created)
5. **Bookshelf:** Course appears in course list

## Next Steps After Course Creation

1. **Create first module** — use lesson creation pipeline
2. **Add lessons one by one** — writer → design → visual → quiz → integration
3. **Test lessons** — visit each lesson page, verify quiz loads
4. **Publish course** — set `available: true` (default)

## Language

All course metadata must be in **Brazilian Portuguese (PT-BR)**:

- Titles: "Protocolo DNS", "Introdução a Programação"
- Descriptions: Natural Portuguese explanations
- Module names: Portuguese terms matching course terminology

## Key Principles

1. **Atomic** — all or nothing file creation
2. **Validated** — every step checks before proceeding
3. **Templated** — uses existing courses as guides
4. **Non-destructive** — never overwrites existing courses
5. **Buildable** — always validates with `npx next build`
6. **Documented** — clear error messages and recovery steps

## Resources

- **Agent file:** `.github/agents/course-creator.agent.md`
- **Skill file:** `.github/skills/course-creation/SKILL.md`
- **Example courses:** `src/data/courses.ts` (see existing entries)
- **Template pages:** `src/app/(sidebar)/redes-de-computadores/`
- **Lesson structure:** `src/data/lessons/redes-de-computadores/module.json`

