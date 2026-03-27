# P5.js Development Skill

**Location:** `.github/skills/p5js-development/SKILL.md`

**Purpose:** Teach a developer agent how to read visual specifications from annotated lesson files and implement production-ready p5.js visualization components for Trinity Academy.

---

## Quick Start

This skill is used by the **p5js-developer agent** (`.github/agents/p5js-developer.agent.md`).

### When to Use This Skill

Use this skill when you need to:
- Read visual specifications embedded in `{{ }}` blocks within MDX lesson files
- Extract and parse specification details (type, purpose, canvas size, behavior, etc.)
- Implement React components that integrate p5.js visualizations
- Manage component state (animations, interactions) without breaking p5
- Register components in `mdx-components.tsx` for MDX use
- Validate visual correctness, performance, and accessibility

### The Workflow

```
Input:   Annotated MDX file with {{ SPEC }} blocks
         ↓
[Skill: p5js-development]
  • Extract specs
  • Design components
  • Implement setup/draw/interaction
  • Register in mdx-components.tsx
  • Test and validate
         ↓
Output:  Production-ready p5.js components
         + updated mdx-components.tsx
         + implementation summary
```

---

## What's Inside

The skill file (`SKILL.md`) contains:

1. **Context & Pipeline** — your role in the writing→design→dev workflow
2. **Project Structure** — where components live, how p5-sketch wrapper works, registration pattern
3. **12 Implementation Steps:**
   - Step 1: Read and parse specifications
   - Step 2: Design component structure
   - Step 3: Implement setup function
   - Step 4: Implement draw function
   - Step 5: Handle interaction (mouse, sliders, buttons)
   - Step 6: Colors, text, and visual consistency
   - Step 7: Animation techniques (frame-based vs. time-based)
   - Step 8: Accessibility guidelines
   - Step 9: File organization and naming
   - Step 10: Register in mdx-components.tsx
   - Step 11: Testing and validation
   - Step 12: Output and handoff

4. **4 Common Patterns with Full Code:**
   - Pattern 1: Static Illustration
   - Pattern 2: Auto-Playing Animation
   - Pattern 3: Interactive with React Controls
   - Pattern 4: Step-by-Step Animation

5. **Troubleshooting & Quality Checklist** — solve common problems, validate before submitting

---

## Key Concepts

### State Management
- Use `useRef` for state that persists across p5 frames (not `useState`)
- `useState` causes React re-renders, which break p5 instances
- Pattern: `const stateRef = useRef({ frameCount: 0, ... })`

### Component Structure
Every visualization component:
- Is a React functional component with no props (or minimal props)
- Returns a `<P5Sketch>` wrapper with setup/draw callbacks
- Manages animations/interaction through the p5 instance

### Color & Typography
- Use RGB values in p5: `p.fill(59, 130, 246)` instead of hex
- Trinity's Tailwind colors have standard RGB mappings (provided in skill)
- Fonts: `monospace` for code, `sans-serif` for general text
- Sizes: match spec exactly

### Registration
After implementing a component in `src/components/[topic]-p5-examples.tsx`:
1. Import it in `mdx-components.tsx`
2. Add it to the `useMDXComponents()` return object
3. Use directly in MDX: `<MyComponent />`

---

## Example: From Spec to Component

### Spec (in {{ }} block)

```
TYPE: Static Illustration
TITLE: "Call Stack — Plate Analogy"
CANVAS SIZE: 400 × 480
VISUAL DESCRIPTION: 4 stacked plates (rectangles), each labeled with a function name...
[complete spec details]
```

### Component Implementation

```typescript
"use client";
import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

export function CallStackPlateAnalogy() {
  const setup = (p: p5) => {
    p.createCanvas(400, 480);
  };

  const draw = (p: p5) => {
    p.background(249, 250, 251); // #F9FAFB
    
    // Draw 4 plates according to spec
    // Colors: #374151 (gray-800), #3B82F6 (blue-500)
    // Fonts: monospace, 15px
    // Layout: centered, stacked vertically
  };

  return <P5Sketch setup={setup} draw={draw} width={400} height={480} />;
}
```

### Register in mdx-components.tsx

```typescript
import { CallStackPlateAnalogy } from "./src/components/call-stack-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    CallStackPlateAnalogy,
    // ... other components
  };
}
```

### Use in MDX

```markdown
# The Call Stack

Here's how the plate analogy works visually:

<CallStackPlateAnalogy />

Each plate represents...
```

---

## Spec Fields Reference

Every specification contains these fields (look for them in {{ }} blocks):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| TYPE | String | ✓ | `Static Illustration \| Animation \| Interactive Visualization \| Step-by-Step Animation` |
| TITLE | String | ✓ | Component name, e.g., "Call Stack — Push and Pop" |
| EDUCATIONAL PURPOSE | String | ✓ | Why this visual teaches the concept |
| CANVAS SIZE | String | ✓ | Width × height, e.g., "700 × 400" |
| VISUAL DESCRIPTION | String | ✓ | What the learner sees (shapes, colors, layout, style) |
| INITIAL STATE | String | ✓ (for dynamic) | Default state at load |
| BEHAVIOR | String | ✓ (for dynamic) | How it responds to time/input |
| STATES | String | – (optional) | Discrete configurations the visual can be in |
| LABELS AND TEXT | String | ✓ | All text elements (fonts, sizes, positions) |
| EDUCATIONAL ANNOTATIONS | String | – (optional) | Callouts, arrows, highlights |
| ACCESSIBILITY NOTES | String | – (optional) | Contrast, motion, keyboard considerations |

---

## Files & Directories

```
.github/
├── agents/
│   └── p5js-developer.agent.md         ← Agent that uses this skill
├── skills/
│   └── p5js-development/
│       ├── SKILL.md                    ← This skill (the one you're reading)
│       └── references/                 ← (Optional) worked examples
│           └── README.md               ← Pointer to spec-examples.md
└── VISUAL_DEVELOPMENT_PIPELINE.md      ← Full pipeline overview

src/
├── components/
│   ├── p5-sketch.tsx                   ← The wrapper component (use internally)
│   ├── [topic]-p5-examples.tsx         ← Where your components go
│   │   (e.g., routing-fundamentals-p5-examples.tsx)
│   └── ...
└── ...

mdx-components.tsx                      ← Where you register components
```

---

## Related Skills & Agents

### Design Annotator Agent
- **Skill:** `visual-design-annotator`
- **Output:** Annotated MDX files with {{ }} spec blocks
- **Your Input:** These annotated files

### Writer Agent
- **Skill:** `educational-writer`
- **Output:** Lesson content before visual annotation
- **Prerequisite:** Content that the design agent annotates

---

## Common Mistakes to Avoid

1. **Using `useState` for p5 state** → Use `useRef` instead
2. **Hardcoding colors as hex** → Use RGB: `p.fill(59, 130, 246)`
3. **Not matching spec exactly** → Colors, layout, text size must be precise
4. **Forgetting to register** → Add to `mdx-components.tsx` or it won't work in MDX
5. **Memory leaks** → Check cleanup in P5Sketch wrapper (it's handled for you)
6. **Decorative visuals** → Never add anything beyond the spec
7. **Poor contrast** → Use spec's accessibility notes for contrast ratios

---

## Troubleshooting

### Canvas doesn't render
- Verify `setup` calls `p.createCanvas()`
- Check component is in `mdx-components.tsx`
- Check browser console for errors

### Animation stutters
- Profile draw function performance
- Avoid heavy computations every frame
- Use time-based animations (`p.millis()`) for smoothness

### State not updating
- **Mistake:** Using `useState`
- **Fix:** Use `useRef` for p5 state that needs to persist

### Colors look wrong
- Double-check RGB values (0–255 range, not hex)
- Use the color mapping table in the skill for Trinity's Tailwind palette

---

## Learning Resources

Inside the skill:
- **Step-by-step instructions** for implementing each type of visualization
- **4 complete code patterns** (static, animation, interactive, step-by-step)
- **Color & typography guidelines** with examples
- **Quality checklist** before submission

External:
- [p5.js reference](https://p5js.org/reference/) — full API docs
- [Trinity's project structure](../../) — examples of existing components
- [Tailwind CSS](https://tailwindcss.com/) — styling reference

---

## Contact & Support

If you're implementing a component and the spec is unclear:
1. **Ask clarifying questions** in the spec comments
2. **Check spec-examples.md** for similar patterns
3. **Review existing components** in `src/components/` for patterns
4. **Consult the troubleshooting section** in SKILL.md

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Maintained by:** Trinity Academy Team

