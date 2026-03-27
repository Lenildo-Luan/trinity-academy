# Trinity Academy Visual Development — Complete Index

Central navigation hub for all documentation related to the visual development pipeline (writing, design annotation, and p5.js component development).

---

## 🚀 Quick Start (5 minutes)

**New to visual development?** Start here:

1. **Understand the pipeline:** Read [`VISUAL_DEVELOPMENT_PIPELINE.md`](./VISUAL_DEVELOPMENT_PIPELINE.md) (5 min)
2. **See it in action:** Read [`HOW_TO_USE_VISUAL_PIPELINE.md`](./HOW_TO_USE_VISUAL_PIPELINE.md) — Stage 1–3 walkthrough (10 min)

That's it! You now understand how lessons → specs → components work.

---

## 📚 Complete Documentation Index

### Overview & Context

| Document | Purpose | Audience | Read Time |
|----------|---------|----------|-----------|
| **[P5JS_SETUP_SUMMARY.md](./P5JS_SETUP_SUMMARY.md)** | What was created, where, and why | Everyone | 10 min |
| **[VISUAL_DEVELOPMENT_PIPELINE.md](./VISUAL_DEVELOPMENT_PIPELINE.md)** | Full 3-stage pipeline explanation | Everyone | 15 min |
| **[HOW_TO_USE_VISUAL_PIPELINE.md](./HOW_TO_USE_VISUAL_PIPELINE.md)** | How to invoke each agent, with examples | Users of the pipeline | 20 min |

### Skills (Deep Learning)

#### Stage 1: Educational Writing
| Document | Location | Purpose | Audience |
|----------|----------|---------|----------|
| educational-writer SKILL | `.github/skills/educational-writer/SKILL.md` | Write lesson articles | Writers |
| writer agent definition | `.github/agents/writer.agent.md` | Agent role | Everyone |

#### Stage 2: Visual Design & Annotation
| Document | Location | Purpose | Audience |
|----------|----------|---------|----------|
| visual-design-annotator SKILL | `.github/skills/visual-design-annotator/SKILL.md` | Identify & specify visuals | Designers |
| visual-design-annotator references | `.github/skills/visual-design-annotator/references/` | Spec examples | Designers |
| design-annotator agent | `.github/agents/design-annotator.agent.md` | Agent role | Everyone |

#### Stage 3: P5.js Development ✨ (New)
| Document | Location | Purpose | Audience |
|----------|----------|---------|----------|
| **p5js-development SKILL** | **`.github/skills/p5js-development/SKILL.md`** | **12-step implementation guide** | **Developers** |
| **VISUALIZATION_TYPES.md** | **`.github/skills/p5js-development/VISUALIZATION_TYPES.md`** | **Choose the right visualization type** | **Developers** |
| **README.md** | **`.github/skills/p5js-development/README.md`** | **Quick start for the skill** | **Developers** |
| **INTEGRATION_GUIDE.md** | **`.github/skills/p5js-development/INTEGRATION_GUIDE.md`** | **How it aligns with Trinity** | **Developers** |
| **p5js-developer agent** | **`.github/agents/p5js-developer.agent.md`** | **Agent role** | **Everyone** |

### Reference & Context

| Document | Location | Purpose | Audience |
|----------|----------|---------|----------|
| Trinity Copilot Instructions | `copilot-instructions.md` (root) | Project conventions | Everyone |
| Storybook guide | (in copilot-instructions.md) | Component testing pattern | Developers |

---

## 🎯 Finding What You Need

### "I want to write a lesson"
→ Read: **[HOW_TO_USE_VISUAL_PIPELINE.md](./HOW_TO_USE_VISUAL_PIPELINE.md) — Stage 1**

### "I want to design visualizations for a lesson"
→ Read: **[HOW_TO_USE_VISUAL_PIPELINE.md](./HOW_TO_USE_VISUAL_PIPELINE.md) — Stage 2**

### "I want to implement a p5.js component"
→ Read in order:
1. [VISUALIZATION_TYPES.md](./skills/p5js-development/VISUALIZATION_TYPES.md) — Choose type (10 min)
2. [SKILL.md](./skills/p5js-development/SKILL.md) — Follow 12 steps (30 min implementation)

### "I want to understand the full pipeline"
→ Read: **[VISUAL_DEVELOPMENT_PIPELINE.md](./VISUAL_DEVELOPMENT_PIPELINE.md)** (15 min)

### "I want to troubleshoot my implementation"
→ Read: **[SKILL.md](./skills/p5js-development/SKILL.md) — Troubleshooting section** (5 min)

### "I want to know if my code meets standards"
→ Read: **[SKILL.md](./skills/p5js-development/SKILL.md) — Quality Checklist** (5 min)

### "I want to integrate with Trinity conventions"
→ Read: **[INTEGRATION_GUIDE.md](./skills/p5js-development/INTEGRATION_GUIDE.md)** (10 min)

### "I want to see an example spec"
→ Read: **[visual-design-annotator references](./skills/visual-design-annotator/references/spec-examples.md)** (10 min)

### "I'm completely new and need a 5-minute overview"
→ Read: **[P5JS_SETUP_SUMMARY.md](./P5JS_SETUP_SUMMARY.md)** (5 min)

---

## 📂 File Structure

```
.github/
│
├── README (this file — you are here)
│
├── P5JS_SETUP_SUMMARY.md
│   └─ What's new, what was created, expected outcomes
│
├── VISUAL_DEVELOPMENT_PIPELINE.md
│   └─ 3-stage pipeline with examples
│
├── HOW_TO_USE_VISUAL_PIPELINE.md
│   └─ User guide for each agent/skill
│
├── agents/
│   ├── writer.agent.md (existing)
│   ├── design-annotator.agent.md (existing)
│   └── p5js-developer.agent.md (NEW ✨)
│       └─ p5js developer agent definition
│
├── skills/
│   ├── educational-writer/ (existing)
│   ├── visual-design-annotator/ (existing)
│   └── p5js-development/ (NEW ✨)
│       ├── SKILL.md
│       │   └─ 12-step implementation guide (750+ lines)
│       ├── README.md
│       │   └─ Quick start & overview
│       ├── VISUALIZATION_TYPES.md
│       │   └─ Type reference & patterns
│       ├── INTEGRATION_GUIDE.md
│       │   └─ Trinity alignment
│       └── references/ (optional)
│           └─ (For future spec examples)
│
└── copilot-instructions.md (existing, not modified)
```

---

## 🔑 Key Concepts

### The 3-Stage Pipeline

```
[WRITER] → [DESIGN ANNOTATOR] → [P5.JS DEVELOPER]
   ↓             ↓                    ↓
[Article] → [{{ }}Specs] → [React + p5 Components]
```

1. **Writer** creates pedagogical lesson content
2. **Design Annotator** identifies visual opportunities and writes `{{ SPEC }}` blocks
3. **P5.js Developer** reads specs and implements components

### Visualization Types

- **Static Illustration** — Single image, no animation, no interaction
- **Animation** — Automatic playback of process/transformation
- **Interactive Visualization** — Learner controls variables with sliders/buttons
- **Step-by-Step** — Learner clicks Next/Previous through discrete states

### State Management Rule

```typescript
// For p5 internal state → use useRef (persists across frames)
const stateRef = useRef({ frameCount: 0 });

// For React controls → use useState (triggers re-renders)
const [speed, setSpeed] = useState(5);
```

### Component Structure

```typescript
export function MyVisualization() {
  const setup = (p: p5) => { /* Initialize canvas */ };
  const draw = (p: p5) => { /* Render/update */ };
  return <P5Sketch setup={setup} draw={draw} width={700} height={400} />;
}
```

---

## ✅ Quality Standards

All p5.js components must meet:

- ✅ **Visual correctness** — colors, layout, text match spec exactly
- ✅ **Performance** — 60 FPS animations, no stuttering
- ✅ **Accessibility** — WCAG AA contrast (4.5:1), motion sensitivity, keyboard support
- ✅ **Responsiveness** — works on different screen sizes
- ✅ **Code quality** — TypeScript strict, no `any`, clean comments
- ✅ **Testing** — visual, performance, accessibility, TypeScript validation
- ✅ **Registration** — added to `mdx-components.tsx`

---

## 🎓 Learning Paths

### Path 1: Understand the Concept (15 minutes)
1. Read [P5JS_SETUP_SUMMARY.md](./P5JS_SETUP_SUMMARY.md)
2. Read [VISUAL_DEVELOPMENT_PIPELINE.md](./VISUAL_DEVELOPMENT_PIPELINE.md)

### Path 2: Use the Pipeline (30 minutes)
1. Read [HOW_TO_USE_VISUAL_PIPELINE.md](./HOW_TO_USE_VISUAL_PIPELINE.md) — all 3 stages
2. Try invoking a stage with example input

### Path 3: Implement Your First Component (1–2 hours)
1. Read [VISUALIZATION_TYPES.md](./skills/p5js-development/VISUALIZATION_TYPES.md)
2. Read [SKILL.md](./skills/p5js-development/SKILL.md) — Steps 1–5
3. Follow patterns for your visualization type
4. Implement, test, submit

### Path 4: Master P5.js Development (ongoing)
1. Implement multiple components
2. Read full [SKILL.md](./skills/p5js-development/SKILL.md) in depth
3. Refer to [INTEGRATION_GUIDE.md](./skills/p5js-development/INTEGRATION_GUIDE.md) for Trinity conventions
4. Use Troubleshooting section when stuck
5. Mentor others

---

## 📊 What's New (Summary)

| Item | Type | Location | Purpose |
|------|------|----------|---------|
| p5js-developer agent | Agent | `.github/agents/p5js-developer.agent.md` | Defines agent role |
| p5js-development skill | Skill | `.github/skills/p5js-development/SKILL.md` | 12-step guide (750+ lines) |
| README | Doc | `.github/skills/p5js-development/README.md` | Quick start |
| VISUALIZATION_TYPES | Doc | `.github/skills/p5js-development/VISUALIZATION_TYPES.md` | Type reference |
| INTEGRATION_GUIDE | Doc | `.github/skills/p5js-development/INTEGRATION_GUIDE.md` | Trinity alignment |
| VISUAL_DEVELOPMENT_PIPELINE | Doc | `.github/VISUAL_DEVELOPMENT_PIPELINE.md` | Pipeline overview |
| HOW_TO_USE_VISUAL_PIPELINE | Doc | `.github/HOW_TO_USE_VISUAL_PIPELINE.md` | User guide |
| P5JS_SETUP_SUMMARY | Doc | `.github/P5JS_SETUP_SUMMARY.md` | Summary of changes |

---

## 🚀 Getting Started Immediately

### Step 1: Understand (5 min)
Read **[P5JS_SETUP_SUMMARY.md](./P5JS_SETUP_SUMMARY.md)** — "What This Enables" section

### Step 2: Learn the Pipeline (10 min)
Read **[VISUAL_DEVELOPMENT_PIPELINE.md](./VISUAL_DEVELOPMENT_PIPELINE.md)** — overview section

### Step 3: Use It (Depends on Role)
- **Writers:** See [HOW_TO_USE_VISUAL_PIPELINE.md](./HOW_TO_USE_VISUAL_PIPELINE.md) Stage 1
- **Designers:** See [HOW_TO_USE_VISUAL_PIPELINE.md](./HOW_TO_USE_VISUAL_PIPELINE.md) Stage 2
- **Developers:** Read [VISUALIZATION_TYPES.md](./skills/p5js-development/VISUALIZATION_TYPES.md) then [SKILL.md](./skills/p5js-development/SKILL.md)

---

## 📞 Support

### Questions About...

| Topic | Document |
|-------|----------|
| How to use the pipeline | [HOW_TO_USE_VISUAL_PIPELINE.md](./HOW_TO_USE_VISUAL_PIPELINE.md) |
| Pipeline overview | [VISUAL_DEVELOPMENT_PIPELINE.md](./VISUAL_DEVELOPMENT_PIPELINE.md) |
| Choosing a visualization type | [VISUALIZATION_TYPES.md](./skills/p5js-development/VISUALIZATION_TYPES.md) |
| Step-by-step implementation | [SKILL.md](./skills/p5js-development/SKILL.md) |
| Troubleshooting | [SKILL.md](./skills/p5js-development/SKILL.md) — Troubleshooting section |
| Quality standards | [SKILL.md](./skills/p5js-development/SKILL.md) — Quality Checklist |
| Trinity conventions | [INTEGRATION_GUIDE.md](./skills/p5js-development/INTEGRATION_GUIDE.md) |
| What's new | [P5JS_SETUP_SUMMARY.md](./P5JS_SETUP_SUMMARY.md) |

---

## 🎉 Ready to Build!

Everything you need is documented. Choose your role and get started:

- 👤 **I'm a Writer** → [Stage 1 Guide](./HOW_TO_USE_VISUAL_PIPELINE.md#stage-1-writer-agent--create-lesson-content)
- 🎨 **I'm a Designer** → [Stage 2 Guide](./HOW_TO_USE_VISUAL_PIPELINE.md#stage-2-design-annotator--add-visual-specifications)
- 👨‍💻 **I'm a Developer** → [Developer Guide](./skills/p5js-development/VISUALIZATION_TYPES.md)
- 📊 **I'm a Project Lead** → [Pipeline Overview](./VISUAL_DEVELOPMENT_PIPELINE.md)

---

## 📋 Document Inventory

### In `.github/` root
- `VISUAL_DEVELOPMENT_PIPELINE.md` — 3-stage pipeline overview
- `HOW_TO_USE_VISUAL_PIPELINE.md` — Complete user guide
- `P5JS_SETUP_SUMMARY.md` — Summary of what's new
- `README.md` (this file) — Navigation hub

### In `.github/agents/`
- `writer.agent.md` — Writer agent (existing)
- `design-annotator.agent.md` — Design annotator agent (existing)
- `p5js-developer.agent.md` — P5.js developer agent (NEW ✨)

### In `.github/skills/p5js-development/`
- `SKILL.md` — Core 12-step implementation guide (NEW ✨)
- `README.md` — Quick start (NEW ✨)
- `VISUALIZATION_TYPES.md` — Type reference (NEW ✨)
- `INTEGRATION_GUIDE.md` — Trinity alignment (NEW ✨)
- `references/` — Optional future spec examples

---

**Total Documentation:** ~3,500+ lines  
**Code Patterns Included:** 4 (static, animation, interactive, step-by-step)  
**Steps Documented:** 12 (from spec parsing to component registration)  
**Quality Checks:** 15+ criteria in checklist

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Status:** ✅ Complete & Ready for Use

**Start reading:** [VISUAL_DEVELOPMENT_PIPELINE.md](./VISUAL_DEVELOPMENT_PIPELINE.md)

