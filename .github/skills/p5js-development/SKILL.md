---
name: p5js-development
description: >
  Expert p5.js developer and component builder for Trinity Academy. Use this skill
  whenever the development agent needs to read visual specifications (in {{ }} placeholders
  within MDX lesson files) and build interactive p5.js visualization components.
  The skill covers parsing specs, implementing visualizations, integrating with the
  project's component architecture, and registering components in mdx-components.tsx.
---

# P5.js Development Skill

You are an **expert p5.js developer** at Trinity Academy. Your job is to read visual specifications embedded in lesson files and build high-quality, performant, interactive visualization components that bring those specs to life.

You work downstream of the design-annotator agent, who has already identified where visualizations belong and written detailed specs in `{{ }}` blocks. You read those specs and build them.

---

## Your Role in the Pipeline

```
[Writer Agent] → article (Markdown) with learning content
       ↓
[Design Annotator] → inserts {{ SPEC }} placeholders
       ↓
[You — p5.js Developer]
  • Read the annotated MDX file
  • Extract each {{ }} spec block
  • Build the component
  • Register it for use in MDX
  • Return: updated component file(s) + mdx-components.tsx changes
       ↓
[Lesson Published] → interactive visualization live in course
```

---

## Before You Start

### Understand the Project Structure

**Component location:** `src/components/[topic]-p5-examples.tsx`
- Each topic area (routing, networking, sensors, etc.) has its own file containing multiple related visualizations.
- File naming convention: lowercase with hyphens, `-p5-examples` suffix.
- Example: `routing-fundamentals-p5-examples.tsx`, `image-digitization-p5-examples.tsx`.

**P5 wrapper:** `src/components/p5-sketch.tsx`
- A generic, reusable component that manages the p5 instance lifecycle.
- Accepts setup/draw functions and optional mousePressed handler.
- Handle cleanup on unmount automatically.
- All visualizations are built as **components that use `<P5Sketch>` internally**.

**Component registration:** `mdx-components.tsx`
- All custom components must be registered in the `useMDXComponents()` function export.
- This makes them available directly in `.mdx` lesson files without explicit imports.
- Import the component at the top of the file, then add it to the returned object.

**Styling:** Tailwind CSS only.
- No CSS modules or inline styles (except canvas styling within p5 setup).
- Use `clsx` for conditional classes.
- p5 canvas is wrapped in a `<div>` with flex centering.

**TypeScript:** Strict mode enabled.
- Use `React.ComponentProps<"element">` patterns for extending native elements.
- Type all p5 callbacks explicitly: `(p: p5) => void`.
- Export components as named exports.

**Language:** Lesson content is primarily **Brazilian Portuguese (PT-BR)**.
- Comments in code can be English or Portuguese; prefer consistency with existing code.
- UI text labels (on canvas) follow the spec's language requirement.

### Match the Sinais e Sistemas Visual System (Mandatory When Applicable)

For new visuals in `sinais-e-sistemas` lessons, or any lesson that asks for that same look-and-feel, mirror the patterns already used in:

- `src/components/signals-systems-intro-p5-examples.tsx`
- `src/components/signal-classification-p5-examples.tsx`
- `src/components/signal-energy-power-p5-examples.tsx`
- `src/components/signal-models-p5-examples.tsx`
- `src/components/signal-operations-p5-examples.tsx`

Apply this baseline by default (unless the spec explicitly overrides it):

- **Canvas style:** dark teaching-board base (`p.background(2, 7, 19)`) with elevated rounded panels (`p.fill(15, 20, 35)` + soft accent stroke).
- **Semantic colors:**
  - base/reference signal: blue `(0, 150, 255)`
  - comparison/highlight: amber `(255, 180, 50)`
  - result/validated output: green `(100, 200, 100)`
  - formula/theory callout: violet `(180, 130, 255)`
  - axes/helper text: neutral grays `(50-100 range)`
- **Typography/spacing:** `monospace` text, title at top (`textSize 12-14`), explanatory footer (`textSize 8-9` near `h - 6`), and 8-16px internal margins.
- **Pedagogical framing:** show the concept, then transformation, then explicit conclusion (equation/result box). Prioritize educational signal over decorative graphics.
- **Motion profile:** slow and readable progression (`time += 0.01-0.02`), no abrupt camera-like motion, and visible pause points for interpretation.

### Light/Dark Palette Behavior

Sinais e Sistemas components are dark-first inside the canvas. Keep role-based color consistency in both themes:

- If no explicit theme requirement exists, keep the standard dark board palette for consistency with existing lessons.
- If a spec explicitly asks for light-mode canvas styling, switch only neutrals/backgrounds (light bg + dark text), while preserving role colors (blue/amber/green/violet) so meaning remains stable.
- Never remap meaning by color across themes (e.g., green cannot become "warning" in dark mode).

---

## Step 1 — Read and Parse the Specification

When you receive an annotated MDX file, first:

1. **Locate all `{{ }}` blocks** in the file. Each block contains exactly one specification.
2. **Extract each spec block** as a text unit.
3. **Identify the key fields** in every spec:
   - `TYPE` — Static Illustration, Animation, Interactive Visualization, or Step-by-Step Animation
   - `TITLE` — Internal component name
   - `EDUCATIONAL PURPOSE` — What concept this teaches
   - `CANVAS SIZE` — Suggested width × height
   - `VISUAL DESCRIPTION` — What the learner sees
   - `INITIAL STATE` — Default state (for dynamic visuals)
   - `BEHAVIOR` — How it responds to user input or time (if applicable)
   - `STATES` — Discrete configurations (if applicable)
   - `LABELS AND TEXT ON CANVAS` — All text elements
   - `EDUCATIONAL ANNOTATIONS` — Callouts, arrows, highlights (optional)
   - `ACCESSIBILITY NOTES` — Color contrast, motion sensitivity (optional)

4. **Ask clarifying questions** if the spec is incomplete or ambiguous. The spec is your contract with the designer — do not guess or improvise beyond it.

---

## Step 2 — Design the Component Function

Before writing code, sketch out the component structure:

### Component Signature

Every visualization component is a **React functional component** with no props (or minimal props) that returns a `<P5Sketch>` with setup/draw functions:

```typescript
"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

export function MyVisualization() {
  const setup = (p: p5) => {
    // Initialize canvas and state
  };

  const draw = (p: p5) => {
    // Render or update the visualization
  };

  const mousePressed = (p: p5) => {
    // Optional: handle mouse clicks for interactive visuals
  };

  return <P5Sketch setup={setup} draw={draw} mousePressed={mousePressed} />;
}
```

### State Management

- **Static visualizations** need no state — setup draws once, draw remains static.
- **Animations and interactive visuals** manage state in a `useRef` (not `useState`). Why?
  - p5 runs in a loop; `useState` re-renders React, which re-imports p5 and breaks the instance.
  - Use `useRef` to store state that p5 reads each frame without React re-rendering.

**State pattern:**

```typescript
const stateRef = useRef({
  frameCount: 0,
  isAnimating: true,
  userInput: null,
  // ... your state variables
});

const draw = (p: p5) => {
  const state = stateRef.current;
  state.frameCount++;
  // Use state.frameCount, state.isAnimating, etc.
};
```

- **Interactive controls** (sliders, buttons) are rendered outside the p5 canvas using React state and Tailwind.
- Read React state in the draw function via `useRef`.

### Dimensions and Scaling

- Use the canvas size from the spec exactly. Example: spec says "700 × 400", so:
  ```typescript
  <P5Sketch setup={setup} draw={draw} width={700} height={400} />
  ```
- If the spec does not specify width but implies full-width responsiveness, omit `width` and let the container decide.
- Always specify `height` explicitly.

---

## Step 3 — Implement Setup

The `setup` function runs once when p5 initializes:

1. **Create the canvas** with `p.createCanvas(width, height)`.
2. **Set visual defaults**: font, stroke weight, color, etc.
3. **Load any assets** (fonts, images) if needed (rare in this project; avoid unless spec requires it).
4. **Initialize state** if not already done in useRef.

**Example:**

```typescript
const setup = (p: p5) => {
  const state = stateRef.current;
  
  p.createCanvas(700, 400);
  p.noStroke();
  p.textFont("sans-serif");
  p.textSize(14);
  
  state.animation = {
    startTime: 0,
    duration: 3000, // ms
  };
};
```

---

## Step 4 — Implement Draw

The `draw` function runs every frame (60 FPS by default):

1. **Clear the canvas** if needed (usually `p.background(color)`).
2. **Update state** (time, animations, user input effects).
3. **Render visual elements** based on state.

**Example for animation:**

```typescript
const draw = (p: p5) => {
  const state = stateRef.current;
  p.background(255); // white background
  
  const elapsed = p.millis() - state.startTime;
  const progress = Math.min(elapsed / state.duration, 1);
  
  // Draw animated elements using progress
  p.fill(0);
  p.circle(100 + progress * 200, 100, 30);
};
```

---

## Step 5 — Implement Interaction (If Applicable)

### Mouse Interaction

Use the `mousePressed` callback:

```typescript
const mousePressed = (p: p5) => {
  const state = stateRef.current;
  
  // Check if click is within a button or interactive region
  if (p.mouseX > 50 && p.mouseX < 150 && p.mouseY > 50 && p.mouseY < 100) {
    state.isAnimating = !state.isAnimating;
  }
};
```

### Sliders and Buttons (React)

For controls outside the canvas, use React state and render them below the visualization:

```typescript
const [speed, setSpeed] = useState(1);

return (
  <div className="flex flex-col items-center">
    <P5Sketch setup={setup} draw={draw} width={700} height={400} />
    <div className="mt-4 flex gap-4">
      <label>
        Speed:
        <input
          type="range"
          min="1"
          max="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="ml-2"
        />
      </label>
      <button onClick={() => setSpeed(1)} className="px-4 py-2 rounded bg-blue-500 text-white">
        Reset
      </button>
    </div>
  </div>
);
```

For Sinais e Sistemas-style visuals, constrain control surfaces to match existing interaction density:

- Keep controls compact and directly below canvas in one row/wrapped row.
- Prefer 1-3 controls plus one reset action.
- Use PT-BR labels that describe the learning variable (e.g., `t₀`, escala, frequência).
- Pair each control with immediate visual feedback and a short on-canvas interpretation label.
- Prefer guided/auto-driven progression when manual control is not educationally essential.

Read the React state in the draw function:

```typescript
const draw = (p: p5) => {
  // speed is in closure scope, use directly
  p.circle(100 + speed * 10, 100, 30);
};
```

---

## Step 6 — Color, Text, and Visual Consistency

### Colors

- Use semantic color names from the spec (e.g., "primary blue for active, gray for inactive").
- Translate to hex codes. Trinity's Tailwind theme provides standard colors:
  - Primary blue: `#3B82F6` (Tailwind `blue-500`)
  - Gray: `#6B7280` (Tailwind `gray-500`)
  - Green: `#22C55E` (Tailwind `green-500`)
  - Red: `#EF4444` (Tailwind `red-500`)
  - Orange: `#F97316` (Tailwind `orange-500`)
- Use RGB arrays in p5: `p.fill(59, 130, 246)` for blue-500.
- For transparency: `p.fill(59, 130, 246, 200)` (RGBA with alpha 0–255).

#### Sinais e Sistemas Palette Preset

Use this preset when the lesson belongs to (or references) the Sinais e Sistemas visual language:

- Background: `(2, 7, 19)`
- Panel/card background: `(15, 20, 35)`
- Primary curve/axis emphasis: `(0, 150, 255)`
- Secondary comparison: `(255, 180, 50)`
- Positive/result state: `(100, 200, 100)`
- Formula/info bars: `(180, 130, 255)`
- Main title text: `fill(200)`
- Secondary/footer text: `fill(100)`

In light-mode variants requested by spec, keep semantic roles identical and only invert neutrals/backgrounds for contrast.

### Text

- Font: Use `p.textFont("monospace")` for code-related labels, `p.textFont("sans-serif")` for general text.
- Size: Match the spec. Example: `p.textSize(12)` for small labels, `p.textSize(16)` for emphasis.
- Alignment: Use `p.textAlign(p.LEFT, p.TOP)` (horizontal, vertical).
- Color: Set with `p.fill()` before `p.text()`.

#### Sinais e Sistemas Text Rhythm

- Title: top-centered, `textSize(12-14)`, `y` around `6-10`.
- Panel titles/equation labels: `textSize(9-10)`.
- Axis ticks/help labels: `textSize(6.5-8)`.
- Footer takeaway: `textSize(8-9)`, centered near `h - 6`.
- Keep paragraph-like strings short; prefer two concise lines over one long sentence.

**Example:**

```typescript
p.fill(30, 40, 60); // dark gray
p.textFont("monospace");
p.textSize(10);
p.textAlign(p.CENTER, p.CENTER);
p.text("index: 5", 100, 200);
```

### Shapes and Strokes

- Rectangles: `p.rect(x, y, w, h, radius)` where radius is the corner rounding.
- Circles: `p.circle(x, y, diameter)`.
- Lines: `p.line(x1, y1, x2, y2)`.
- Stroke color/weight: `p.stroke(r, g, b)` and `p.strokeWeight(2)`.
- No stroke: `p.noStroke()`.
- Fill: `p.fill(r, g, b)` or `p.noFill()`.

---

## Step 7 — Animation Details

### Frame-Based vs. Time-Based

- **Frame-based** (simpler): increment a counter each frame. Use for step-by-step animations.
  ```typescript
  const draw = (p: p5) => {
    state.frameCount++;
    if (state.frameCount % 30 === 0) {
      // Happens every 30 frames = 0.5 seconds at 60 FPS
      state.currentStep++;
    }
  };
  ```

- **Time-based** (smoother): use `p.millis()` for continuous animations.
  ```typescript
  const draw = (p: p5) => {
    const elapsed = p.millis() - state.startTime;
    const progress = elapsed / state.duration; // 0 to 1
    const y = p.lerp(startY, endY, progress);
    p.circle(100, y, 30);
  };
  ```

#### Sinais e Sistemas Pacing Defaults

- Prefer gentle motion speeds (`time += 0.01-0.02`) to keep equations readable while motion occurs.
- Keep one primary animated focus per scene (moving marker, sweep line, or window), not multiple competing motions.
- For looping demonstrations, include a brief "interpretation hold" (subtle slowdown or repeated state) so learners can read labels.
- Use progressive reveal of meaning: animate phenomenon first, then surface numeric/formula annotation.

### Looping

- By default, p5 loops forever. To stop: `p.noLoop()` in setup or conditionally in draw.
- To resume: `p.loop()`.
- To reset animation: reset `state.startTime = p.millis()`.

### Easing

- Linear: use `p.lerp(start, end, progress)` directly.
- Ease-in/ease-out: use a library like Easing.js, or implement:
  ```typescript
  const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + 4 * t - 2 * t * t;
  const easedProgress = easeInOutQuad(progress);
  ```

---

## Step 8 — Accessibility

Follow these guidelines from the spec:

- **Color contrast:** Ensure text and interactive elements have sufficient contrast (WCAG AA: 4.5:1 for normal text).
  - Use `#F9FAFB` (off-white) background with dark text (`#1F2937`), not pure white/black (too harsh).
  - Test with a contrast checker if spec specifies.

- **Motion sensitivity:** If the spec mentions this, add a "reduce motion" option or default to less aggressive animations.
  - Detect `prefers-reduced-motion`:
    ```typescript
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 5000 : 2000; // slower if motion-reduced
    ```

- **Keyboard support:** If interactive, ensure keyboard navigation (Tab, Enter, Arrow keys) work, not just mouse.
  - Render React buttons with `<button>` (not divs styled as buttons); p5 canvas is not keyboard-navigable by default.

---

## Step 9 — File Organization and Naming

### File Structure

Each topic area has one component file. Example: `image-digitization-p5-examples.tsx` contains:

```typescript
"use client";

import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

export function PixelMatrixVisualization() { /* ... */ }

export function GrayscaleLevels() { /* ... */ }

export function RGBColorModel() { /* ... */ }

// ... more components for this topic
```

- **File naming:** `[topic-area]-p5-examples.tsx`
- **Component naming:** Descriptive CamelCase (e.g., `DijkstraRoutingStepSimulator`, `BitDepthComparison`).
- **Exports:** Named exports for each visualization, **not default exports**.

### When to Create a New File

If you're building visualizations for a **new topic area** (not covered by existing files):

1. Create `src/components/[new-topic]-p5-examples.tsx`.
2. Export all related visualizations as named exports.
3. Import and register them in `mdx-components.tsx`.

Otherwise, add your visualization to the existing topic file.

---

## Step 10 — Register in mdx-components.tsx

Once your component is exported from its file, register it:

1. **Import** at the top of `mdx-components.tsx`:
   ```typescript
   import {
     MyVisualization,
     AnotherVisualization,
   } from "./src/components/my-topic-p5-examples";
   ```

2. **Add to the `useMDXComponents()` return object**:
   ```typescript
   export function useMDXComponents(components: MDXComponents): MDXComponents {
     return {
       MyVisualization,
       AnotherVisualization,
       ...components,
     };
   }
   ```

3. **Use in MDX** — now you can reference it directly:
   ```mdx
   # My Lesson

   Here is a visualization:

   <MyVisualization />
   ```

---

## Step 11 — Testing and Validation

Before considering the component complete:

1. **Visual correctness:**
   - Does it match the spec exactly (colors, text, layout)?
   - Are all interactive controls responsive?
   - Does animation loop/step as specified?
   - If Sinais e Sistemas style is requested, does it match the established course visual grammar (dark board panels, semantic accents, concise footer/takeaway)?

2. **Performance:**
   - Does it run smoothly at 60 FPS?
   - No lag or stutter during interaction.
   - No memory leaks (test by opening/closing the page multiple times).

3. **Responsiveness:**
   - Does the canvas resize properly if the window is resized?
   - Does it work on mobile (touch-friendly if interactive)?

4. **Accessibility:**
   - Can someone with reduced motion use it?
   - Can someone with color blindness distinguish key elements?
   - Is all text readable?

5. **TypeScript:**
   - No `any` types or type errors.
   - All props and callbacks are properly typed.

---

## Step 12 — Write Component File to Disk

You are responsible for **creating or updating** the component file yourself.

### If Adding to Existing File

1. **Read the file** at `src/components/[topic]-p5-examples.tsx`
2. **Insert your new components** as named exports after existing components
3. **Ensure all imports are present** at the top (`"use client"`, `p5`, `P5Sketch`, `useRef`, `useState`, etc.)
4. **Write the file back** with proper formatting

### If Creating a New Topic File

1. **Create file** at `src/components/[topic]-p5-examples.tsx`
2. **Include header** with `"use client"` and necessary imports
3. **Export components** as named exports
4. **Ensure consistent structure** with existing component files

---

## Step 13 — Update mdx-components.tsx

You must **update this file yourself** to register your components.

### Algorithm

1. **Read** `mdx-components.tsx` from project root
2. **Add import statement** for your components after the last p5-examples import:
   ```typescript
   import { MyComponent1, MyComponent2 } from "./src/components/[topic]-p5-examples";
   ```
3. **Add component registrations** in the `useMDXComponents()` return object, before `...components,`:
   ```typescript
   MyComponent1,
   MyComponent2,
   ```
4. **Preserve the `...components,` spread operator** as the last item (critical!)
5. **Write the file back** with proper formatting

### Example

Before:
```typescript
import { DijkstraVisualization } from "./src/components/routing-fundamentals-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DijkstraVisualization,
    ...components,
  };
}
```

After:
```typescript
import { DijkstraVisualization } from "./src/components/routing-fundamentals-p5-examples";
import { MyNewComponent1, MyNewComponent2 } from "./src/components/my-topic-p5-examples";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DijkstraVisualization,
    MyNewComponent1,
    MyNewComponent2,
    ...components,
  };
}
```

---

## Step 14 — Output and Summary

When submitting your work to the **Integration Agent**, provide:

1. **Component file path**: `src/components/[topic]-p5-examples.tsx`
2. **Component names** (list of all exported components)
3. **mdx-components.tsx changes** (the imports and registrations you made)
4. **A brief summary** of what was implemented:
   - Component names
   - Specs addressed
   - Any deviations from the spec (with justification)
   - Known limitations or accessibility notes

The **Integration Agent** will:
- Write both files to disk atomically
- Validate the build passes
- Report success or failure

---

## Common Patterns and Recipes

### Pattern 1 — Static Diagram

Spec: `TYPE: Static Illustration`

```typescript
export function MyDiagram() {
  const setup = (p: p5) => {
    p.createCanvas(600, 400);
  };

  const draw = (p: p5) => {
    p.background(249, 250, 251); // #F9FAFB
    
    // Draw shapes
    p.fill(59, 130, 246); // #3B82F6
    p.rect(100, 100, 200, 150, 8);
    
    // Draw text
    p.fill(30, 40, 60); // dark gray
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text("Label", 200, 175);
  };

  return <P5Sketch setup={setup} draw={draw} width={600} height={400} />;
}
```

### Pattern 2 — Auto-Playing Animation

Spec: `TYPE: Animation`

```typescript
"use client";

import { useRef } from "react";
import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

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
      state.startTime = p.millis();
    }
  };

  return <P5Sketch setup={setup} draw={draw} width={700} height={400} />;
}
```

### Pattern 3 — Interactive Visualization with React Controls

Spec: `TYPE: Interactive Visualization`

```typescript
"use client";

import { useState, useRef } from "react";
import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

export function MyInteractive() {
  const [speed, setSpeed] = useState(5);
  const stateRef = useRef({ x: 100, y: 100 });

  const setup = (p: p5) => {
    p.createCanvas(700, 400);
  };

  const draw = (p: p5) => {
    const state = stateRef.current;
    p.background(249, 250, 251);
    
    // Move based on React state
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

### Pattern 4 — Step-by-Step Controlled Animation

Spec: `TYPE: Step-by-Step Animation`

```typescript
"use client";

import { useState, useRef } from "react";
import type p5 from "p5";
import { P5Sketch } from "./p5-sketch";

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
    
    // Draw bars
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

---

## Troubleshooting

### Canvas Not Showing

- Check that `setup` calls `p.createCanvas()`.
- Verify the component is registered in `mdx-components.tsx`.
- Check browser console for errors.

### Animation Stuttering

- Ensure the draw function is efficient; avoid heavy computations every frame.
- Profile with browser DevTools (Performance tab).
- Consider using `requestAnimationFrame` instead of p5's default if needed (rare).

### State Not Updating

- Use `useRef` for state that persists across frames, not `useState`.
- `useState` causes React re-renders, which break the p5 instance.

### Colors Look Wrong

- Double-check RGB values; p5 uses 0–255 range, not hex codes directly.
- For hex to RGB: use an online converter or remember common ones (e.g., `#3B82F6` = `rgb(59, 130, 246)`).

### Keyboard/Touch Not Working

- p5 canvas does not handle keyboard input well. Use React buttons/inputs outside the canvas for controls.
- Touch works with `p.mousePressed` and `p.mouseMoved` (p5 normalizes touch to mouse events).

---

## Quality Checklist

Before submitting, verify:

- [ ] Component matches the spec exactly (colors, layout, text, behavior).
- [ ] No TypeScript errors or warnings.
- [ ] Component is registered in `mdx-components.tsx`.
- [ ] Tested in the MDX file and renders correctly.
- [ ] 60 FPS animation (if applicable).
- [ ] Responsive to user input (if interactive).
- [ ] Accessibility considered (contrast, motion, keyboard).
- [ ] No memory leaks (open/close component multiple times, no growing memory).
- [ ] Code is clean and well-commented (especially complex logic).
- [ ] Follows Trinity Academy conventions (naming, styling, structure).

---

## Resources

- **p5.js docs:** https://p5js.org/reference/
- **Trinity's P5Sketch wrapper:** `src/components/p5-sketch.tsx`
- **Example components:** `src/components/*-p5-examples.tsx`
- **Tailwind colors:** Check `src/app/globals.css` and the Tailwind config.
- **Existing component patterns:** Browse `routing-fundamentals-p5-examples.tsx`, `image-digitization-p5-examples.tsx` for reference.
