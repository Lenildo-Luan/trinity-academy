# How to Use the Visual Development Pipeline

Complete guide to using the writer, design-annotator, and p5js-developer agents to create educational visualizations for Trinity Academy.

---

## Overview

The visual development pipeline has **3 stages**, each with its own agent and skill:

```
Stage 1: Writer Agent          → Creates lesson content
         ↓ (educational-writer skill)
         
Stage 2: Design Annotator     → Identifies visual opportunities
         ↓ (visual-design-annotator skill)
         
Stage 3: P5.js Developer      → Implements components
         ↓ (p5js-development skill)
         
Output: Production-ready lesson with visualizations
```

---

## Stage 1: Writer Agent — Create Lesson Content

### Use This When
You need to create a new lesson chapter or educational article for a Trinity Academy course.

### How to Invoke

**Command pattern:**
```
I need help writing a lesson about [topic] for [course], 
targeting [audience level], positioned after [previous chapter]. 
[Any specific requirements or context].
```

**Example:**
```
I need to write a lesson about "The Call Stack" for the Programming 
Fundamentals course, targeting beginners, positioned after "Functions 
and Scope". The lesson should explain LIFO principle and stack frames 
with concrete analogies. Length: ~2000 words.
```

### What the Writer Does

1. **Identifies context:**
   - Topic, audience, module position, length
   - Learning objectives
   - Tone (conversational for Trinity)

2. **Writes pedagogically structured article:**
   - Hook (engaging opening)
   - Learning objectives (clear, actionable)
   - Core content with examples
   - Application/practice
   - Summary and transition to next chapter

3. **Outputs:**
   - Complete MDX article (ready for next stage)
   - No {{ }} specs yet
   - Marked with assumptions if context was unclear

### Output Format

Full article in MDX format, ready to be passed to design-annotator.

### Next Step
→ Pass the output to **Stage 2: Design Annotator**

---

## Stage 2: Design Annotator — Add Visual Specifications

### Use This When
You have a completed lesson article and want to identify where visualizations would improve understanding.

### How to Invoke

**Command pattern:**
```
I have a completed lesson article. Please identify where visual elements 
would help learners understand [key concepts]. Add {{ }} specification 
blocks at the appropriate locations.

[Paste or reference the article]
```

**Example:**
```
I have a completed lesson about "The Call Stack". Please annotate where 
visualizations would help. The article explains the LIFO principle and 
stack frames. I'm thinking an animation of push/pop would help, but I 
want your professional recommendation on what and where.

[Article text follows...]
```

### What the Design Annotator Does

1. **Reads the full article** (don't skip any part)

2. **Identifies visual opportunities** using these criteria:
   - Abstract concepts (hard to visualize otherwise)
   - Process-based (sequence of steps over time)
   - Spatial relationships (structures, hierarchies)
   - Comparison (side-by-side)
   - Dense text (cognitive load reset)
   - Existing "imagine/picture" language in text

3. **Selects 1–3 high-impact visualizations** (not more)

4. **For each visual, inserts a {{ }} block** containing:
   - TYPE (Static Illustration, Animation, Interactive, Step-by-Step)
   - TITLE (component name)
   - EDUCATIONAL PURPOSE (why this teaches)
   - CANVAS SIZE (width × height)
   - VISUAL DESCRIPTION (what learner sees)
   - INITIAL STATE (for dynamic visuals)
   - BEHAVIOR (how it responds)
   - STATES (discrete configurations)
   - LABELS AND TEXT ON CANVAS (exact text, fonts, sizes)
   - EDUCATIONAL ANNOTATIONS (optional)
   - ACCESSIBILITY NOTES (optional)

5. **Returns:**
   - Full article (unchanged except for {{ }} blocks)
   - Design decisions summary (justifying each visual)

### Output Format

Same article + {{ }} blocks at natural insertion points + summary:

```markdown
## Design Decisions Summary

2 visualizations added.

1. **Call Stack — Push and Pop** — Animation
   Placement: after "The pilha segue o princípio LIFO..."
   Reason: Animated push/pop reinforces LIFO principle and makes 
           the abstract concept concrete through visual sequence.

2. **Stack Frame Memory Layout** — Static Illustration
   Placement: after "Each frame stores..."
   Reason: Shows the structure of a stack frame (return address, 
           local variables, etc.) which is hard to visualize from text.
```

### Tips for Better Specs
- Be **specific about numbers** (dimensions, colors, positions)
- **Name every interactive control** (type, range, label, default)
- **Describe colors with purpose** (not just "blue" but "blue for active")
- **Describe transitions** (not just "moves" but "lerps over 30 frames")
- **State the loop policy** (animation loops? stops? waits for input?)

### Next Step
→ Pass the output to **Stage 3: P5.js Developer**

---

## Stage 3: P5.js Developer — Implement Components

### Use This When
You have an annotated article with {{ }} specification blocks and need to build the actual p5.js components.

### How to Invoke

**Command pattern:**
```
I have an annotated lesson article with {{ }} visualization specs. 
Please implement the p5.js components, register them in mdx-components.tsx, 
and deliver the updated files.

[Paste the annotated article]
```

**Example:**
```
I have a lesson about "The Call Stack" with 2 visualization specs:
1. Call Stack — Push and Pop (Animation)
2. Stack Frame Memory Layout (Static Illustration)

Please implement these components, register them in mdx-components.tsx, 
and provide a summary of what was implemented.

[Full annotated article...]
```

### What the P5.js Developer Does

1. **Extracts {{ }} spec blocks** from the article

2. **For each spec:**
   - Parses all fields (TYPE, TITLE, PURPOSE, CANVAS, etc.)
   - Designs the component structure
   - Implements setup/draw functions (and mousePressed if interactive)
   - Manages state with `useRef` for animations/interactions
   - Implements any React controls (sliders, buttons) for interactivity
   - Applies exact colors, fonts, layout from spec

3. **Implements components following patterns:**
   - Static Illustration → simple setup + draw (no state)
   - Animation → useRef + time-based state + draw loop
   - Interactive → useState for controls + useRef for canvas state
   - Step-by-Step → useState for step index + predefined STEPS array

4. **Registers in mdx-components.tsx:**
   - Imports each component at top
   - Adds to `useMDXComponents()` return object
   - Components become available directly in MDX

5. **Tests thoroughly:**
   - Visual correctness (colors, layout match spec)
   - Performance (60 FPS)
   - Interaction responsiveness
   - Accessibility (contrast, motion, keyboard)
   - TypeScript compliance

6. **Delivers:**
   - Updated component file(s) (new or modified)
   - Updated mdx-components.tsx
   - Implementation summary

### Output Files

**1. Component file** — `src/components/[topic]-p5-examples.tsx`:

```typescript
"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

export function CallStackPushAndPop() {
  // Implementation according to spec
  const setup = (p: p5) => { /* ... */ };
  const draw = (p: p5) => { /* ... */ };
  return <P5Sketch setup={setup} draw={draw} width={400} height={480} />;
}

export function StackFrameMemoryLayout() {
  // Implementation according to spec
  const setup = (p: p5) => { /* ... */ };
  const draw = (p: p5) => { /* ... */ };
  return <P5Sketch setup={setup} draw={draw} width={600} height={400} />;
}
```

**2. Updated mdx-components.tsx** (relevant imports section):

```typescript
import {
  CallStackPushAndPop,
  StackFrameMemoryLayout,
} from "./src/components/call-stack-p5-examples";

// ... in useMDXComponents()
return {
  CallStackPushAndPop,
  StackFrameMemoryLayout,
  // ... other components
};
```

**3. Implementation Summary:**

```markdown
## Implementation Complete

### Components Built
1. **CallStackPushAndPop** (Animation)
   - Type: Auto-playing animation with loop
   - Canvas: 400×480 (spec exact)
   - Colors: #F9FAFB (bg), #374151 (gray), #3B82F6 (blue highlight)
   - Behavior: 3-second animation cycle, loops

2. **StackFrameMemoryLayout** (Static Illustration)
   - Type: Static diagram
   - Canvas: 600×400
   - Shows: 3-level stack frame with labels
   - Fully responsive and accessible

### Spec Compliance
✓ Both match specs exactly (colors, layout, text, behavior)
✓ No TypeScript errors
✓ 60 FPS performance validated
✓ Accessibility: WCAG AA contrast ratio confirmed
✓ Registered in mdx-components.tsx
✓ Ready for MDX use

### Performance Notes
- Both components lightweight; no memory issues
- Animation uses time-based state (smooth 60 FPS)
- Static component renders once per frame (negligible CPU)
```

### Tips for Implementation
- **Always match the spec exactly** — colors, layout, text sizes
- **Use `useRef` for p5 state** — never `useState`
- **Test on different screen sizes** — responsive canvas behavior
- **Verify contrast ratios** — WCAG AA minimum 4.5:1 for text
- **Check TypeScript** — `npm run lint` before submitting

### Next Step
→ The lesson is **ready to use** in MDX!

---

## Using the Lesson in MDX

Once all 3 stages are complete, the lesson is ready to use:

```markdown
# A Pilha de Chamadas

[Educational content from Stage 1...]

<CallStackPushAndPop />

[More content...]

<StackFrameMemoryLayout />

[Conclusion...]
```

---

## Complete Example Walk-Through

### Stage 1: Writer Creates Lesson

**Request:**
```
Write a lesson about "Understanding Recursion" for the Programming 
Fundamentals course, targeting beginners. Position after "Functions and 
Scope". Include concrete examples (factorial, Fibonacci) and real-world 
analogies (Russian dolls, mirrors reflecting). Length: 2000–2500 words.
```

**Output:** Complete article with hook, objectives, examples, summary.

### Stage 2: Design Annotator Adds Specs

**Request:**
```
Here's my recursion lesson. Where would visualizations help? The lesson 
explains the call stack during recursion, base cases, and recursive case 
logic. I mention Russian dolls and mirrors.
[Article...]
```

**Output:** Same article + 2 {{ }} blocks:
1. Animation: "Recursion Call Stack" — shows how stack grows/shrinks
2. Interactive: "Factorial Step-by-Step" — learner clicks next to see recursive calls

### Stage 3: P5.js Developer Implements

**Request:**
```
I have the annotated recursion lesson with 2 specs. Please implement 
the components and register them.
[Annotated article...]
```

**Output:**
- New file: `src/components/recursion-p5-examples.tsx`
  - `RecursionCallStack()` component
  - `FactorialStepByStep()` component
- Updated: `mdx-components.tsx` with imports and registration
- Summary: Both components implemented, tested, ready

### Final Lesson

```markdown
# Entendendo Recursão

[Content about what recursion is, why it matters...]

<RecursionCallStack />

[Explanation of call stack visualization...]

[Content about base cases, recursive cases...]

<FactorialStepByStep />

[Application: try the interactive step-by-step...]
```

---

## Best Practices

### For Writer
- ✓ Don't mention visuals that don't exist yet
- ✓ Write clear, pedagogically structured content
- ✓ Trust the design-annotator to decide what to visualize
- ✗ Don't try to design visuals yourself in writing

### For Design Annotator
- ✓ Read the entire article before deciding
- ✓ Be selective (1–3 visualizations max)
- ✓ Write specs as if the developer hasn't read the article
- ✓ Include all numbers, colors, behaviors
- ✗ Don't over-annotate with unnecessary visuals

### For P5.js Developer
- ✓ Match the spec exactly (colors, layout, behavior)
- ✓ Use `useRef` for animation state
- ✓ Test performance and accessibility
- ✓ Deliver clean, well-commented code
- ✗ Don't improvise beyond what the spec says
- ✗ Don't use `useState` for p5-internal state

### For All
- ✓ **Collaborate** — ask questions if specs are unclear
- ✓ **Iterate** — if the first pass doesn't work, refine
- ✓ **Document** — leave clear notes and summaries
- ✓ **Test** — validate output before hand-off

---

## Troubleshooting

### Writer Issues

**Problem:** "I'm not sure what to visualize"
- **Solution:** Don't worry. Pass your complete article to the design-annotator. That's their job.

**Problem:** "The design-annotator didn't add visuals where I thought they should be"
- **Solution:** Trust their pedagogical judgment. They're trained to identify high-impact opportunities.

### Design Annotator Issues

**Problem:** "I can't decide if this needs a visual"
- **Solution:** Use the criteria in `visual-design-annotator` skill. If it doesn't meet multiple criteria, skip it.

**Problem:** "The spec doesn't have enough detail"
- **Solution:** Add more. Specs are written for developers who haven't read the article. Every number matters.

### P5.js Developer Issues

**Problem:** "The canvas isn't showing"
- **Solution:** Check `setup` calls `p.createCanvas()`, component is in `mdx-components.tsx`, browser console for errors.

**Problem:** "The animation stutters"
- **Solution:** Profile the `draw()` function. Use time-based state (`p.millis()`), not frame counting.

**Problem:** "The spec is ambiguous"
- **Solution:** Ask questions. The spec is your contract. Don't guess.

---

## Resources

### Skills & Agents
- **Stage 1:** `.github/agents/writer.agent.md` + `.github/skills/educational-writer/SKILL.md`
- **Stage 2:** `.github/agents/design-annotator.agent.md` + `.github/skills/visual-design-annotator/SKILL.md`
- **Stage 3:** `.github/agents/p5js-developer.agent.md` + `.github/skills/p5js-development/SKILL.md`

### Documentation
- **Pipeline overview:** `VISUAL_DEVELOPMENT_PIPELINE.md`
- **P5.js skill README:** `.github/skills/p5js-development/README.md`
- **Visualization types:** `.github/skills/p5js-development/VISUALIZATION_TYPES.md`
- **Integration guide:** `.github/skills/p5js-development/INTEGRATION_GUIDE.md` (this file)

### Code Examples
- **Existing components:** `src/components/[topic]-p5-examples.tsx`
- **P5 wrapper:** `src/components/p5-sketch.tsx`
- **Component registration:** `mdx-components.tsx`

### Project Context
- **Build commands:** `copilot-instructions.md`
- **Component conventions:** `copilot-instructions.md`
- **Tailwind colors:** `src/app/globals.css`

---

## Questions?

1. **How do I write a better spec?** → See `visual-design-annotator/SKILL.md`, Step 5
2. **What if I'm stuck implementing?** → See `p5js-development/SKILL.md`, Troubleshooting section
3. **What's the full pipeline again?** → See `VISUAL_DEVELOPMENT_PIPELINE.md`
4. **How do I choose a visualization type?** → See `p5js-development/VISUALIZATION_TYPES.md`
5. **How does this integrate with Trinity?** → See `p5js-development/INTEGRATION_GUIDE.md`

---

**Version:** 1.0  
**Last Updated:** March 2026  
**Maintained by:** Trinity Academy Team

