# Trinity Academy - Arquitetura dos Scripts de Automação

## 📐 Visão Geral da Arquitetura

Os scripts são organizados em camadas para máxima reutilização e testabilidade:

```
┌─────────────────────────────────────────────────────────┐
│                    CLI Layer (TypeScript)                │
│  trinity.cli.ts | create-course.cli.ts | create-brief.cli │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  Business Logic Layer                     │
│  create-course.ts | create-lesson-brief.ts               │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │Validators│  │Utils     │  │Templates │
    │Layer     │  │Layer     │  │Layer     │
    └──────────┘  └──────────┘  └──────────┘
          │            │            │
          ├────────────┼────────────┤
          │   File System / TypeScript   │
          └──────────────────────────────┘
```

## 🏗️ Componentes

### 1. CLI Layer (`scripts/cli/`)

**Responsabilidade:** Interface de usuário (CLI)

```typescript
// trinity.cli.ts - Main entry point
// create-course.cli.ts - Phase 0 CLI
// create-lesson-brief.cli.ts - Phase 1 CLI

Responsibilities:
├─ Parse command line arguments
├─ Display help messages
├─ Handle user input
└─ Call business logic
```

**Características:**
- ✅ Parsing flexível de argumentos
- ✅ Help detalhado para cada comando
- ✅ Suporte a flags (--verbose, --skip-build)
- ✅ Exit codes apropriados

### 2. Business Logic Layer

#### `create-course.ts` (Phase 0)

```typescript
async function createCourse(
  input: CourseInput,
  options?: CreateCourseOptions
): Promise<Result>

Steps:
1. validateCourse() → CourseInput
2. createDirectories() → Directories
3. writeModuleJson() → module.json
4. registerInCourses() → courses.ts update
5. createLandingPage() → page.tsx
6. createLessonRoutes() → [slug]/page.tsx
7. validateBuild() → TypeScript + Next.js
8. reportSuccess() → Output
```

**Características:**
- ✅ Validação antes de qualquer mudança
- ✅ Operações atômicas (tudo ou nada)
- ✅ Relatórios detalhados
- ✅ Recuperação de erros

#### `create-lesson-brief.ts` (Phase 1)

```typescript
async function createLessonBrief(
  input: LessonInput,
  options?: CreateLessonBriefOptions
): Promise<Result>

Steps:
1. validateLesson() → LessonInput
2. generateBrief() → LessonBrief JSON
3. saveBrief() → .trinity/lesson-briefs/
4. generatePlanningDoc() → .trinity/lesson-plans/
5. reportSuccess() → Output
```

**Características:**
- ✅ Validação estruturada
- ✅ Geração de documentação
- ✅ Arquivamento organizado
- ✅ Pronto para Phase 2

### 3. Validators Layer

#### `validators/course-validator.ts`

```typescript
validateCourse(input: CourseInput): ValidationError[]

Validations:
├─ Course ID
│  ├─ kebab-case format
│  ├─ 3-50 characters
│  └─ unique (not in courses.ts)
├─ Title
│  └─ 3-100 characters
├─ Description
│  └─ 50-500 characters
├─ Background Image
│  └─ valid URL
└─ Initial Modules (optional)
   ├─ unique IDs
   └─ required fields
```

#### `validators/lesson-validator.ts`

```typescript
validateLesson(input: LessonInput): ValidationError[]

Validations:
├─ Chapter ID
│  ├─ kebab-case or charpter-N
│  └─ required
├─ Chapter Title
│  └─ 5-100 characters
├─ Description
│  └─ 10-300 characters
├─ Objectives (required)
│  ├─ 1-5 objectives
│  └─ 5-150 chars each
└─ Prerequisites (optional)
   └─ max 5 items
```

### 4. Utils Layer

#### `utils/file-utils.ts`

```typescript
Core Functions:
├─ ensureDir(path) → Create directory
├─ fileExists(path) → Check file
├─ dirExists(path) → Check directory
├─ readFile(path) → Read file
├─ writeFile(path, content) → Write file
├─ readJSON(path) → Parse JSON
├─ writeJSON(path, data) → Write JSON
├─ courseExists(id) → Check in courses.ts
├─ getExistingCourseIds() → List all IDs
└─ getTemplate(name) → Load template
```

**Features:**
- ✅ Safe file operations
- ✅ Atomic writes
- ✅ Error handling
- ✅ Template loading

#### `utils/string-utils.ts`

```typescript
Core Functions:
├─ kebabToPascal(str) → Convert case
├─ kebabToCamel(str) → Convert case
├─ capitalize(str) → Capitalize
├─ toIdentifier(str) → Valid TS identifier
└─ normalizeWhitespace(str) → Trim/normalize
```

### 5. Templates Layer

#### `templates/course-landing-page.template`

```typescript
Template for src/app/(sidebar)/[course-id]/page.tsx

Placeholders:
├─ {{COURSE_ID}}
├─ {{COURSE_TITLE}}
└─ {{COURSE_DESCRIPTION}}

Features:
├─ Module listing
├─ Lesson listing
├─ Statistics (modules, lessons, duration)
└─ Responsive layout
```

#### `templates/lesson-page.template`

```typescript
Template for src/app/(sidebar)/[course-id]/[slug]/page.tsx

Placeholders:
├─ {{COURSE_ID}}
└─ {{COURSE_TITLE}}

Features:
├─ Lesson metadata generation
├─ Quiz loading
├─ Breadcrumb navigation
└─ Dynamic content rendering
```

## 🔄 Data Flow

### Phase 0: Course Creation Flow

```
User Input (CLI)
    │
    ▼
parse args
    │
    ▼
createCourse(input)
    │
    ├─→ validateCourse(input)
    │       ├─→ validateCourseId()
    │       ├─→ validateTitle()
    │       ├─→ validateDescription()
    │       ├─→ validateBackgroundImage()
    │       └─→ validateModule() [optional]
    │
    ├─→ courseExists(id)? → STOP if yes
    │
    ├─→ createDirectories()
    │       ├─→ src/data/lessons/[id]/
    │       ├─→ src/data/quizzes/[id]/
    │       └─→ src/app/(sidebar)/[id]/[slug]/
    │
    ├─→ writeJSON(module.json)
    │
    ├─→ updateCoursesTS(entry)
    │
    ├─→ createLandingPage()
    │   ├─→ getTemplate('course-landing-page')
    │   ├─→ replace placeholders
    │   └─→ writeFile()
    │
    ├─→ createLessonRoutes()
    │   ├─→ getTemplate('lesson-page')
    │   ├─→ replace placeholders
    │   └─→ writeFile()
    │
    ├─→ validateBuild()
    │   ├─→ npx tsc --noEmit
    │   └─→ npx next build
    │
    └─→ reportSuccess()
            │
            ▼
        Output with files created
```

### Phase 1: Lesson Brief Flow

```
User Input (CLI)
    │
    ▼
parse args
    │
    ▼
createLessonBrief(input)
    │
    ├─→ validateLesson(input)
    │       ├─→ validateChapterId()
    │       ├─→ validateChapterTitle()
    │       ├─→ validateDescription()
    │       └─→ validateObjectives()
    │
    ├─→ generateBrief()
    │       └─→ Create LessonBrief JSON
    │
    ├─→ saveBrief()
    │   ├─→ ensureDir(.trinity/lesson-briefs/)
    │   └─→ writeJSON()
    │
    ├─→ generatePlanningDoc()
    │   └─→ Create markdown template
    │
    ├─→ savePlanningDoc()
    │   ├─→ ensureDir(.trinity/lesson-plans/)
    │   └─→ writeFile()
    │
    └─→ reportSuccess()
            │
            ▼
        Output with files created
```

## 🔐 Type Safety

All scripts use TypeScript strict mode:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**Type Definitions:**

```typescript
// Course Input/Output
interface CourseInput { ... }
interface ValidationError { field: string; message: string; }

// Lesson Input/Output
interface LessonInput { ... }
interface LessonBrief { ... }

// CLI Arguments
interface Args { ... }

// Options
interface CreateCourseOptions { skipBuildValidation?: boolean; verbose?: boolean; }
interface CreateLessonBriefOptions { verbose?: boolean; outputDir?: string; }
```

## 🧪 Testing Strategy

### Unit Tests (Future)

```typescript
// validators/__tests__/course-validator.test.ts
describe('validateCourse', () => {
  test('valid course passes validation');
  test('invalid ID format fails');
  test('duplicate course ID fails');
  test('description too short fails');
  // ... more tests
});
```

### Integration Tests (Future)

```typescript
// __tests__/create-course.integration.test.ts
describe('createCourse', () => {
  test('creates course with all files');
  test('updates courses.ts correctly');
  test('generates valid TypeScript');
  test('passes build validation');
  // ... more tests
});
```

### Manual Testing

```bash
# Test Phase 0
npm run create-course \
  --id test-course \
  --title "Test Course" \
  --description "This is a test course with enough characters to pass validation." \
  --image "https://images.unsplash.com/..." \
  --verbose

# Test Phase 1
npm run create-lesson-brief \
  --course test-course \
  --chapter charpter-1 \
  --title "Test Lesson" \
  --description "Test lesson description with enough characters." \
  --objectives "Objective 1|Objective 2" \
  --verbose

# Verify files created
ls -la src/data/lessons/test-course/
ls -la src/data/quizzes/test-course/
ls -la src/app/\(sidebar\)/test-course/

# Verify courses.ts was updated
grep "test-course" src/data/courses.ts

# Verify build still passes
npm run build
```

## 🚀 Performance

### Timing Expectations

| Operation | Time | Bottleneck |
|-----------|------|-----------|
| Validate input | <100ms | Regex patterns |
| Create directories | <100ms | File system |
| Write module.json | <50ms | JSON serialization |
| Update courses.ts | <200ms | File parsing |
| Generate pages | <100ms | Template replacement |
| TypeScript check | 5-10s | tsc compilation |
| Next.js build | 30-60s | Full build |
| **Total (with build)** | **35-70s** | **Next.js build** |
| **Total (skip build)** | **<1s** | **File operations** |

### Optimization Opportunities

1. **Parallel build validation** - Run tsc and next build in parallel
2. **Incremental builds** - Only validate changed files
3. **Cache templates** - Load templates once per session
4. **Lazy validation** - Optional lazy validation mode

## 📦 Dependencies

### Runtime Dependencies

```json
{
  "node": ">=16.0.0",
  "typescript": "^5.x"
}
```

### No External Dependencies

Scripts use only Node.js built-in modules:
- `fs` - File system
- `path` - Path utilities
- `child_process` - Execute commands

## 🔧 Configuration

### Environment Variables

Currently, none required. Future possibilities:

```bash
TRINITY_SKIP_BUILD=true       # Skip build validation
TRINITY_VERBOSE=true          # Always verbose output
TRINITY_OUTPUT_DIR=./.trinity # Change output directory
```

### Config File (Future)

```json
// trinity.config.json (optional)
{
  "validate": {
    "strictMode": true,
    "checkUniqueness": true
  },
  "build": {
    "skipValidation": false,
    "timeout": 120000
  }
}
```

## 🔌 Integration Points

### With Next.js

- Reads templates and injects into `src/app/`
- Runs `npx tsc --noEmit` and `npx next build`
- Uses path aliases from `tsconfig.json` in templates

### With Git (Future)

```bash
# Auto-commit created files
git add src/data/courses.ts
git commit -m "chore: add course 'protocolo-dns'"
```

### With Agents (Future)

```typescript
// Integration with AI agents
import { createCourse } from './scripts/create-course';

const result = await createCourse(agentInput);
if (result.success) {
  // Agent can continue to next phase
  triggerWriterAgent(courseId);
}
```

## 🎯 Future Enhancements

1. **Interactive CLI** - Prompts instead of flags
2. **Config file support** - `.trinity/config.json`
3. **Git integration** - Auto-commit files
4. **Dry run mode** - Show what would be created
5. **Rollback capability** - Undo course creation
6. **Progress tracking** - Show step-by-step progress
7. **Parallel operations** - Run independent steps in parallel
8. **Template catalog** - Multiple template options
9. **Validation plugins** - Custom validators
10. **Export formats** - JSON/YAML output for CI/CD

## 📊 Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Single Responsibility** | Each module has one job |
| **Separation of Concerns** | CLI ≠ Logic ≠ Validation ≠ Utils |
| **No Side Effects** | Pure functions where possible |
| **Type Safety** | Strict TypeScript |
| **Error Handling** | Validation before mutation |
| **Atomicity** | All-or-nothing operations |
| **Reusability** | Shared utilities and validators |
| **Testability** | Mockable dependencies |
| **Extensibility** | Plugin-ready architecture |
| **Documentation** | Self-documenting code |

## 📝 Summary

The automation scripts follow **clean architecture principles** with clear separation between:

- **Presentation** (CLI layer)
- **Business Logic** (create-* functions)
- **Validation** (validators)
- **Infrastructure** (file utils, templates)

This makes the code:
- ✅ Easy to test
- ✅ Easy to extend
- ✅ Easy to reuse
- ✅ Easy to maintain
- ✅ Type-safe
- ✅ Resilient to errors

