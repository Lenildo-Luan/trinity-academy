# Lesson Planning Skill

The **lesson planning skill** is responsible for creating structured lesson briefs for Trinity Academy. It takes lesson requirements and creates a detailed brief with learning objectives, prerequisites, and planning documentation.

This is **Phase 1 of the content creation pipeline**, preparing inputs for the Writer Agent (Phase 2).

## ⭐ AUTOMATED: Use the Script!

Phase 1 (Lesson Planning) is now **fully automated**. Use the script instead of manual planning:

```bash
npm run create-lesson-brief \
  --course [course-id] \
  --chapter [chapter-id] \
  --title "[Chapter Title]" \
  --description "[10-300 chars]" \
  --objectives "[Objective 1|Objective 2|Objective 3]" \
  --prerequisites "[Prereq 1|Prereq 2]" \
  --verbose
```

**Benefits:**
- ✅ 100% validation
- ✅ Structured output (JSON + Markdown)
- ✅ ~10 seconds vs manual planning
- ✅ 99%+ success rate
- ✅ Automatic archiving

**Documentation:**
- `AUTOMATION_GETTING_STARTED.md` - Quick start (5 min)
- `scripts/README.md` - Full reference
- `COMANDOS_PRONTOS.md` - Ready-to-copy commands

---

## What This Skill Handles

- ✅ **Lesson brief creation** — structured JSON with metadata
- ✅ **Learning objectives** — define 1-5 specific, measurable goals
- ✅ **Prerequisites** — list required prior knowledge (optional)
- ✅ **Planning documentation** — Markdown guide for content creation
- ✅ **Archive organization** — `.trinity/lesson-briefs/` and `.trinity/lesson-plans/`

## What This Skill Does NOT Handle

- ❌ Writing lesson content (use Writer Agent)
- ❌ Designing visualizations (use Design Annotator)
- ❌ Creating quiz questions (use Quiz Developer)
- ❌ Implementing visualizations (use P5.js Developer)
- ❌ Integrating artifacts (use Integration Orchestrator)

---

## Quick Reference

### Input Requirements

```typescript
{
  courseId: string;           // e.g., "protocolo-dns"
  chapterId: string;          // e.g., "charpter-1"
  chapterTitle: string;       // e.g., "Introdução ao DNS"
  description: string;        // 10-300 characters
  objectives: string[];       // 1-5 learning objectives
  prerequisites?: string[];   // 0-5 prerequisites (optional)
}
```

### Files Created

```
.trinity/
├── lesson-briefs/
│   └── [course-id]/
│       └── [chapter-id].json      ← Brief with metadata
└── lesson-plans/
    └── [course-id]/
        └── [chapter-id].md        ← Planning document
```

### Brief JSON Structure

```json
{
  "courseId": "protocolo-dns",
  "chapterId": "charpter-1",
  "chapterTitle": "Introdução ao DNS",
  "description": "Aprenda os fundamentos do DNS.",
  "objectives": ["Objetivo 1", "Objetivo 2"],
  "prerequisites": ["Pré-req 1"],
  "createdAt": "2026-04-04T..."
}
```

---

## Validation Rules

### Chapter ID
- Must be kebab-case or `charpter-N` format
- Examples: `charpter-1`, `introducao-ao-dns`
- Must be unique within course

### Title
- 5-100 characters
- In Portuguese
- Clear and descriptive

### Description
- 10-300 characters
- Summarizes lesson content
- Examples:
  - "Aprenda os fundamentos do DNS."
  - "Configure Git e crie seu primeiro repositório."

### Learning Objectives (Required)
- Minimum 1, maximum 5
- Each 5-150 characters
- Start with action verbs: "Entender", "Conhecer", "Aprender"
- Examples:
  - "Entender o que é DNS"
  - "Conhecer os tipos de nameservers"
  - "Aprender como funciona resolução de nomes"

### Prerequisites (Optional)
- Maximum 5
- Examples:
  - "Conhecimento básico de redes"
  - "Familiaridade com TCP/IP"

---

## Workflow

1. **Create course** (Phase 0) using `npm run create-course`
2. **Create lesson brief** (Phase 1) using `npm run create-lesson-brief`
3. **Brief automatically archived** in `.trinity/`
4. **Ready for Writer** (Phase 2) to create MDX content
5. **Continue pipeline** → Design → Visualization → Quiz → Integration

---

## Integration Points

### Inputs From
- **Phase 0:** Course ID (must exist)
- **Requirements:** Lesson topic and objectives

### Outputs To
- **Phase 2:** Writer Agent receives brief for content creation
- **Archive:** Stored in `.trinity/lesson-briefs/` and `.trinity/lesson-plans/`
- **Reference:** Available during entire lesson creation process

---

## Example Usage

### Example 1: DNS Lesson
```bash
npm run create-lesson-brief \
  --course protocolo-dns \
  --chapter charpter-1 \
  --title "Introdução ao DNS" \
  --description "Aprenda os fundamentos do DNS e sua importância na internet." \
  --objectives "Entender o que é DNS|Conhecer componentes básicos|Aprender funcionamento" \
  --prerequisites "Conhecimento de redes|Familiaridade com TCP/IP"
```

### Example 2: Git Lesson
```bash
npm run create-lesson-brief \
  --course introducao-ao-git \
  --chapter charpter-1 \
  --title "Começando com Git" \
  --description "Configure Git e crie seu primeiro repositório." \
  --objectives "Instalar Git|Configurar identidade|Criar repositório" \
  --prerequisites "Terminal básico"
```

---

## Output Format

### Success
```
✅ LESSON BRIEF CREATED SUCCESSFULLY

Course: protocolo-dns
Chapter: charpter-1 - Introdução ao DNS

Files Created:
  ✓ .trinity/lesson-briefs/protocolo-dns/charpter-1.json
  ✓ .trinity/lesson-plans/protocolo-dns/charpter-1.md

Next Steps:
1. Share brief with Writer Agent
2. Writer creates MDX content
3. Continue to Phase 3 (Design)
```

### Error
```
❌ Validation failed
  ❌ objectives: Must include 1-5 objectives (you provided 0)

Suggestion: Add objectives with --objectives "Objective 1|Objective 2"
```

---

## Best Practices

1. **Clear objectives** — Use action verbs, be specific
2. **Practical prerequisites** — Only list what's truly required
3. **Consistent formatting** — Follow naming conventions
4. **Portuguese content** — All in PT-BR
5. **Reference document** — Keep planning doc for whole process

---

## Language

All lesson briefs must be in **Brazilian Portuguese (PT-BR)**:

- **Titles:** "Introdução ao DNS", "Resolução de Nomes"
- **Descriptions:** Natural Portuguese sentences
- **Objectives:** Action verbs: "Entender", "Conhecer", "Aprender", "Implementar"
- **Prerequisites:** Clear descriptions of required knowledge

---

## Key Principles

1. **Structured** — Consistent brief format for all lessons
2. **Clear** — Specific, measurable learning objectives
3. **Organized** — Automatic archiving for reference
4. **Portuguese** — All content in Brazilian Portuguese
5. **Efficient** — 10 seconds automated vs manual planning

---

## Testing the Brief

After creation, verify:

1. **Brief JSON exists** — `.trinity/lesson-briefs/[course]/[chapter].json`
2. **Planning doc exists** — `.trinity/lesson-plans/[course]/[chapter].md`
3. **Content is clear** — Objectives and prerequisites are well-written
4. **Ready for Writer** — Brief provides clear guidance for content creation

---

## Files Created

| Location | File | Purpose |
|----------|------|---------|
| `.trinity/lesson-briefs/[course]/` | `[chapter].json` | Structured brief metadata |
| `.trinity/lesson-plans/[course]/` | `[chapter].md` | Planning document |

---

## Resources

- **Script:** `scripts/cli/create-lesson-brief.cli.ts`
- **Validator:** `scripts/validators/lesson-validator.ts`
- **Documentation:** See `AUTOMATION_GETTING_STARTED.md`

---

## Next Phase

After brief creation, the **Writer Agent (Phase 2)** creates the actual lesson content using the brief as a guide.

```
Phase 1: Planning ✅ (Brief Created)
    ↓
Phase 2: Writing (Writer Agent)
    ↓
Phase 3: Design (Design Annotator)
    ↓
Phase 4: Visualization (P5.js Developer)
    ↓
Phase 5: Quiz (Quiz Developer)
    ↓
Phase 6: Integration (Integration Orchestrator)
    ↓
Lesson Live ✅
```

