# P5.js Visualization Types Quick Reference

This is a quick reference for the 4 visualization types and when to use each. For detailed patterns with full code, see the main `SKILL.md`.

---

## Type 1: Static Illustration

**When:** Visual doesn't need to change or animate. The learner views it to understand structure or anatomy.

**Characteristics:**
- No animation
- No interaction
- Single draw state
- Educational purpose: show structure, relationships, anatomy

**Example Use Cases:**
- Call stack layers
- Tree structure diagram
- Network topology
- Component architecture
- Data structure layout

**Code Pattern:**

```typescript
export function MyDiagram() {
  const setup = (p: p5) => {
    p.createCanvas(600, 400);
  };

  const draw = (p: p5) => {
    p.background(249, 250, 251);
    
    // Draw all shapes, text, etc. once per frame
    p.fill(59, 130, 246);
    p.rect(100, 100, 200, 150, 8);
    
    p.fill(30, 40, 60);
    p.textSize(14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Label", 200, 175);
  };

  return <P5Sketch setup={setup} draw={draw} width={600} height={400} />;
}
```

**Performance:** Extremely fast; no animation overhead.

**Spec Fields Needed:**
- TYPE, TITLE, PURPOSE, CANVAS SIZE
- VISUAL DESCRIPTION (detailed)
- LABELS AND TEXT ON CANVAS
- ACCESSIBILITY NOTES (if applicable)

---

## Type 2: Animation

**When:** A process or transformation unfolds over time automatically. The learner watches to understand sequential behavior.

**Characteristics:**
- Automatic playback (no user interaction needed)
- Time-based state changes
- Loops or stops at end
- Educational purpose: show process, transformation, state progression

**Example Use Cases:**
- Bubble sort algorithm steps
- Signal wave propagation
- Particle physics simulation
- State machine transitions
- Data flow through pipeline

**Code Pattern:**

```typescript
import { useRef } from "react";

export function MyAnimation() {
  const stateRef = useRef({ startTime: 0, duration: 3000 });

  const setup = (p: p5) => {
    p.createCanvas(700, 400);
    stateRef.current.startTime = p.millis();
  };

  const draw = (p: p5) => {
    const state = stateRef.current;
    const elapsed = p.millis() - state.startTime;
    const progress = Math.min(elapsed / state.duration, 1);
    
    p.background(255);
    
    // Animate based on progress (0 to 1)
    const x = 100 + progress * 200;
    p.fill(59, 130, 246);
    p.circle(x, 200, 40);
    
    // Loop or stop
    if (progress >= 1 && elapsed > state.duration + 1000) {
      state.startTime = p.millis(); // Restart
    }
  };

  return <P5Sketch setup={setup} draw={draw} width={700} height={400} />;
}
```

**Performance:** Smooth 60 FPS using time-based calculations.

**Spec Fields Needed:**
- TYPE, TITLE, PURPOSE, CANVAS SIZE
- VISUAL DESCRIPTION
- INITIAL STATE
- BEHAVIOR (detailed timing, loops, transitions)
- LABELS AND TEXT ON CANVAS
- ACCESSIBILITY NOTES (motion sensitivity)

---

## Type 3: Interactive Visualization

**When:** The learner controls a variable and immediately sees the effect. Educational purpose: explore "what if" scenarios.

**Characteristics:**
- Responds to user input (sliders, buttons, clicks)
- Immediate visual feedback
- Controls typically outside canvas (React)
- Educational purpose: experiment, discover relationships

**Example Use Cases:**
- Adjust signal frequency → see wave change
- Change array size → see sorting time
- Modify friction → see physics behavior
- Toggle features → see effect on diagram
- Input parameters → see output change

**Code Pattern:**

```typescript
import { useState, useRef } from "react";

export function MyInteractive() {
  const [speed, setSpeed] = useState(5);
  const stateRef = useRef({ x: 100, y: 100 });

  const setup = (p: p5) => {
    p.createCanvas(700, 400);
  };

  const draw = (p: p5) => {
    const state = stateRef.current;
    p.background(249, 250, 251);
    
    // Read React state in draw
    state.x += speed * 0.5;
    if (state.x > 700) state.x = 0;
    
    p.fill(59, 130, 246);
    p.circle(state.x, state.y, 30);
  };

  return (
    <div className="flex flex-col items-center">
      <P5Sketch setup={setup} draw={draw} width={700} height={400} />
      <div className="mt-4 flex gap-4">
        <label className="flex items-center gap-2">
          Speed:
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
        <button
          onClick={() => setSpeed(5)}
          className="px-3 py-1 rounded bg-blue-500 text-white text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
```

**Performance:** Smooth and responsive; controls outside canvas prevent slowdown.

**Spec Fields Needed:**
- TYPE, TITLE, PURPOSE, CANVAS SIZE
- VISUAL DESCRIPTION
- INITIAL STATE
- BEHAVIOR (controls: sliders, buttons, range, defaults, effects)
- STATES (what changes when user interacts)
- LABELS AND TEXT ON CANVAS
- ACCESSIBILITY NOTES (keyboard support, contrast)

---

## Type 4: Step-by-Step Animation

**When:** An algorithm or process needs to be understood step-by-step. Learner controls progression; developer shows each discrete state.

**Characteristics:**
- Multiple predefined states/steps
- Learner clicks Next/Previous buttons
- Each button click updates visualization
- Educational purpose: learn algorithm step-by-step, visualize state transitions

**Example Use Cases:**
- Dijkstra's shortest path (step through iterations)
- Merge sort (visualize each merge)
- Quicksort pivot selection (show partition steps)
- DFS graph traversal (visit nodes in order)
- Binary search (narrow search space step by step)

**Code Pattern:**

```typescript
import { useState, useRef } from "react";

const STEPS = [
  { label: "Start", data: [1, 3, 5, 2, 8] },
  { label: "Step 1", data: [1, 3, 2, 5, 8] },
  { label: "Step 2", data: [1, 2, 3, 5, 8] },
  { label: "Done", data: [1, 2, 3, 5, 8] },
];

export function MyStepAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const stateRef = useRef({ data: STEPS[0].data });

  const setup = (p: p5) => {
    p.createCanvas(600, 300);
    stateRef.current.data = STEPS[stepIndex].data;
  };

  const draw = (p: p5) => {
    const state = stateRef.current;
    p.background(249, 250, 251);
    
    // Draw based on current step
    state.data.forEach((val, i) => {
      p.fill(59, 130, 246);
      p.rect(50 + i * 100, 200 - val * 20, 60, val * 20);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <P5Sketch setup={setup} draw={draw} width={600} height={300} />
      <div className="flex gap-2">
        <button
          onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
          className="px-3 py-1 rounded bg-gray-400 text-white"
        >
          ← Previous
        </button>
        <span className="px-4 py-1">{STEPS[stepIndex].label}</span>
        <button
          onClick={() => setStepIndex(Math.min(STEPS.length - 1, stepIndex + 1))}
          className="px-3 py-1 rounded bg-blue-500 text-white"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
```

**Performance:** Very fast; only redraws on button click.

**Spec Fields Needed:**
- TYPE, TITLE, PURPOSE, CANVAS SIZE
- VISUAL DESCRIPTION
- INITIAL STATE (Step 0)
- BEHAVIOR (button labels, how many steps, reset functionality)
- STATES (visual for each step — very detailed)
- LABELS AND TEXT ON CANVAS
- EDUCATIONAL ANNOTATIONS (highlight changes between steps)
- ACCESSIBILITY NOTES (keyboard navigation)

---

## Quick Decision Tree

```
Will the visualization change or animate?
│
├─ No → TYPE: Static Illustration
│        (draw once, display)
│
└─ Yes → Does the learner control it?
         │
         ├─ No → Is it step-by-step (discrete states)?
         │       │
         │       ├─ No → TYPE: Animation
         │       │        (automatic continuous playback)
         │       │
         │       └─ Yes → TYPE: Step-by-Step Animation
         │               (learner clicks Next/Previous)
         │
         └─ Yes → TYPE: Interactive Visualization
                  (sliders, buttons, explore)
```

---

## Spec Quality Checklist per Type

### Static Illustration
- [ ] CANVAS SIZE specified
- [ ] Colors specified by semantic name AND hex code
- [ ] All shapes dimensioned (width, height, position)
- [ ] All text elements listed (font, size, color, position)
- [ ] Layout described (centered, left, grid, etc.)

### Animation
- [ ] INITIAL STATE describes what's on screen at t=0
- [ ] BEHAVIOR specifies duration, speed, easing
- [ ] Clear about looping behavior (loop, stop, reset)
- [ ] Frame timing clear (if applicable)
- [ ] State transitions described

### Interactive Visualization
- [ ] Each control fully specified (type, range, default, label)
- [ ] Response to each control fully described
- [ ] STATES section lists all possible configurations
- [ ] Bounds/limits on values specified
- [ ] Reset behavior clear

### Step-by-Step Animation
- [ ] Number of steps specified
- [ ] Each step has descriptive label
- [ ] STATES section describes visual for EACH step
- [ ] Previous/Next button behavior clear
- [ ] Reset behavior specified

---

## Color & Typography Quick Reference

### Sinais e Sistemas Pattern Preset

When implementing visuals for the `sinais-e-sistemas` course, use this preset unless the spec says otherwise.

### Visual style baseline

- Dark board canvas: `p.background(2, 7, 19)`
- Elevated panels: `p.fill(15, 20, 35)` + low-alpha accent stroke
- Top title strip and bottom takeaway strip are both expected
- Dense but readable composition with 8-16px panel/card margins

### Semantic accent mapping

| Role | RGB | Typical use in Sinais e Sistemas |
|------|-----|-----------------------------------|
| Base/reference | (0, 150, 255) | Original signal, main curve, primary concept |
| Comparison/emphasis | (255, 180, 50) | Alternative case, moving marker, warning comparison |
| Result/conclusion | (100, 200, 100) | Sampled value, validated output, positive state |
| Formula/theory callout | (180, 130, 255) | Formula bars, boxed conceptual summary |
| Neutral guide | (50-100 range) | Axes, ticks, helper labels, secondary text |

### Light/Dark behavior

- Default is dark-first inside the canvas (matches current Sinais e Sistemas components).
- If light canvas is explicitly required, swap only background/neutral tones.
- Keep semantic role colors stable across themes so meaning does not change.

### Animation and interaction cadence

- Default speed: gentle (`time += 0.01-0.02`).
- Prefer one primary moving element at a time.
- Favor guided demonstrations (automatic sweeps, progressive highlights) over heavy control surfaces.
- If controls are necessary, keep a compact row below the canvas (1-3 controls + reset).

### Pedagogical interaction patterns to reuse

- Compare-and-contrast panels (e.g., contínuo vs discreto, analógico vs digital).
- Original-to-transformed stacked progression (x(t) -> transformed form).
- Animated sampling marker + numeric readout for instantaneous interpretation.
- Bottom formula/takeaway box that states the formal conclusion in PT-BR.

---

### Trinity's Standard Colors (RGB for p5)

| Name | Hex | RGB |
|------|-----|-----|
| Blue (primary) | #3B82F6 | (59, 130, 246) |
| Gray | #6B7280 | (107, 114, 128) |
| Green (success) | #22C55E | (34, 197, 94) |
| Red (error) | #EF4444 | (239, 68, 68) |
| Orange (warning) | #F97316 | (249, 115, 22) |
| Light Gray | #E5E7EB | (229, 231, 235) |
| Off-white (bg) | #F9FAFB | (249, 250, 251) |
| Dark Gray (text) | #1F2937 | (31, 41, 55) |

### Fonts

- Code/technical: `p.textFont("monospace")`
- General: `p.textFont("sans-serif")`

### Sizes (typical)

- Axis labels: 10–11px
- Element labels: 12–14px
- Emphasis: 16–18px
- Titles: 20px+

---

## Examples in Trinity Codebase

Browse these existing components for reference patterns:

- **Static:** Look for components that don't use `useRef` or `useState`
- **Animation:** `routing-fundamentals-p5-examples.tsx` (Dijkstra visualization)
- **Interactive:** `image-digitization-p5-examples.tsx` (adjust bit depth, see colors)
- **Step-by-Step:** Any component with "Previous/Next" buttons
- **Sinais e Sistemas baseline:** `signals-systems-intro-p5-examples.tsx`, `signal-classification-p5-examples.tsx`, `signal-energy-power-p5-examples.tsx`, `signal-models-p5-examples.tsx`, `signal-operations-p5-examples.tsx`

All are in `src/components/[topic]-p5-examples.tsx`.

---

## Questions?

Refer to:
1. **This page** for type overview and quick patterns
2. **SKILL.md** for detailed step-by-step instructions
3. **Existing components** in `src/components/` for Trinity patterns
4. **Spec examples** in `visual-design-annotator/references/spec-examples.md` for spec structure

---

**Version:** 1.0  
**Last Updated:** March 2026

