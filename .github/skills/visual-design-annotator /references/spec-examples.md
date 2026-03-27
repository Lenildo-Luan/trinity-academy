# Spec Examples

Full worked examples of well-written visualization specs for each type. Use these as calibration references before writing specs.

---

## Example 1 — Static Illustration

**Context in article:** The article explains call stacks. The text says: *"Think of the call stack like a stack of plates. Each time a function is called, a new plate is added on top. When the function returns, that plate is removed."*

---

```
{{
TYPE: Static Illustration

TITLE: "Call Stack — Plate Analogy"

EDUCATIONAL PURPOSE:
Reinforces the plate analogy used in the text by making the stack structure
concrete and visual. The learner should see that items are added and removed
only from the top, not the middle or bottom.

CANVAS SIZE: 400 × 480

VISUAL DESCRIPTION:
Draw a vertical stack of 4 rectangular "plates" (cards), centered horizontally
on the canvas.

Plates (bottom to top):
  - Plate 1 (bottom): labeled "main()" — dark gray background (#374151), white text
  - Plate 2: labeled "calculateTotal()" — same style
  - Plate 3: labeled "getPrice()" — same style
  - Plate 4 (top): labeled "formatCurrency()" — highlighted in blue (#3B82F6),
    white text, with a subtle drop shadow to suggest it's "on top"

Each plate is 260px wide × 55px tall with 6px vertical gaps between them.
Rounded corners (radius 8px).

To the right of the stack, a vertical arrow pointing upward labeled "TOP" at
the tip and an annotation bracket spanning the full height labeled "Call Stack".

Below the stack, a label: "Bottom (first called)" in small gray text.
Above the top plate, a label: "← currently executing" in blue, same shade as
the top plate.

Background: off-white (#F9FAFB). No animation, no interaction.

LABELS AND TEXT ON CANVAS:
- Each plate: function name in monospace font, 15px, white
- Right side arrow: "TOP" in sans-serif 12px gray
- Right side bracket label: "Call Stack" in sans-serif 13px gray
- Below stack: "Bottom (first called)" in sans-serif 11px light gray (#9CA3AF)
- Above top plate: "← currently executing" in sans-serif 12px blue (#3B82F6)
}}
```

---

## Example 2 — Animation

**Context in article:** The article explains the bubble sort algorithm. The text walks through the logic step by step but the learner needs to see the swapping process in motion.

---

```
{{
TYPE: Animation

TITLE: "Bubble Sort — Live Pass"

EDUCATIONAL PURPOSE:
Shows one full pass of bubble sort on an array of 7 elements. The learner
should see how adjacent elements are compared and swapped, and how the largest
unsorted element "bubbles up" to its correct position by the end of the pass.

CANVAS SIZE: 700 × 360

VISUAL DESCRIPTION:
7 vertical bars arranged side by side, each representing one array element.
Bar heights are proportional to their values (range 1–10).
Bars are 60px wide with 8px gaps between them, centered on the canvas.

Color scheme:
- Default bar: medium blue (#3B82F6)
- Currently compared pair: highlighted orange (#F97316)
- A bar being swapped (mid-swap): bright red (#EF4444)
- Sorted (placed in final position): green (#22C55E)

Below each bar: its numeric value in monospace font, 14px.
Above the bars: a label "Pass 1 — comparing index [i] and [i+1]" that updates
each step (i is the current left pointer, in monospace).

INITIAL STATE:
Array: [7, 3, 9, 1, 5, 8, 2] (hardcoded for determinism).
All bars are blue. Label reads "Pass 1 — comparing index 0 and 1".
Animation does not start immediately — waits 1 second after canvas load.

BEHAVIOR:
The animation plays automatically. Each comparison step lasts 60 frames:
  - Frames 0–10: highlight the two bars being compared (turn orange)
  - Frames 11–40: if a swap is needed, animate the two bars exchanging
    horizontal positions using lerp() over 30 frames. If no swap, bars
    briefly flash and return to blue.
  - Frames 41–60: pause briefly before moving to next comparison

After all 6 comparisons in pass 1 are complete, the rightmost bar turns green.
The animation then stops. It does NOT loop automatically.

A "Replay" button (80×32px, rounded, blue, white label) appears centered below
the canvas after the animation completes. Clicking it resets to the initial
state and replays.

LABELS AND TEXT ON CANVAS:
- Below each bar: numeric value, monospace 14px, dark gray (#111827)
- Above bars: "Pass 1 — comparing index [i] and [i+1]", sans-serif 14px, updated each step
- "Replay" button appears only after animation ends

EDUCATIONAL ANNOTATIONS:
When a swap occurs, a small arrow appears above the two bars pointing in
opposite directions (↔), lasting for the duration of the swap animation.
When a bar is placed in its sorted position, a brief "✓" appears above it
for 30 frames before fading out.
}}
```

---

## Example 3 — Interactive Visualization

**Context in article:** The article explains how sine waves work and how frequency and amplitude affect the shape of the wave.

---

```
{{
TYPE: Interactive Visualization

TITLE: "Sine Wave — Frequency and Amplitude Explorer"

EDUCATIONAL PURPOSE:
Lets the learner directly manipulate the frequency and amplitude of a sine
wave and observe the result in real time. The learner should internalize that
frequency controls how many cycles appear and amplitude controls the height of
the wave — by changing them and seeing the effect, not just reading about it.

CANVAS SIZE: 700 × 440

VISUAL DESCRIPTION:
The canvas has two regions:
  - Top region (700 × 300): the wave display area
  - Bottom region (700 × 140): the controls panel, with a light gray background
    (#F3F4F6) and a top border

Wave display area:
  - White background
  - A horizontal center axis (dashed gray line, 1px)
  - The sine wave drawn as a continuous smooth curve using vertex() / curveVertex()
  - Wave color: blue (#3B82F6), stroke weight 2.5px
  - The wave spans the full width of the display area (700px = one or more full
    cycles depending on frequency setting)

Controls panel (bottom 140px):
  Two sliders, each with a label above and a dynamic value readout beside it:

  Slider 1 — "Amplitude"
    Position: left side of controls panel
    Range: 10 to 140 (pixels — represents how tall the wave is)
    Default: 80
    Step: 1
    Dynamic label: "Amplitude: [value] px" in monospace, updates on drag

  Slider 2 — "Frequency"
    Position: right side of controls panel
    Range: 0.5 to 5.0 (cycles visible in the canvas width)
    Default: 1.5
    Step: 0.1
    Dynamic label: "Frequency: [value] cycles" in monospace, updates on drag

INITIAL STATE:
Wave drawn with amplitude=80, frequency=1.5. Both slider handles positioned
at their default values. Dynamic labels show defaults.

BEHAVIOR:
The wave redraws on every frame (draw() loop). The wave formula:
  y = centerY + amplitude * sin(frequency * (x / canvasWidth) * TWO_PI * frequency)
  (loop x from 0 to canvasWidth, plotting y for each x)

Any change to either slider immediately updates the wave on the next frame.
No buttons needed — the visualization is always live.

STATES:
The visual has a continuous state space (no discrete states). Any combination
of amplitude (10–140) and frequency (0.5–5.0) is valid. There is no error state.

LABELS AND TEXT ON CANVAS:
- "Amplitude" label above slider 1, sans-serif 13px dark gray
- "Frequency" label above slider 2, sans-serif 13px dark gray
- Dynamic value readout beside each slider, monospace 13px blue
- A subtle "← try dragging the sliders" hint in light gray italic (12px)
  centered at the bottom of the controls panel (only visible on first load,
  fades out after the user first interacts)

ACCESSIBILITY NOTES:
Avoid red/green as the only differentiator. Ensure slider labels have high
contrast against the gray controls background.
}}
```

---

## Example 4 — Step-by-Step Animation

**Context in article:** The article explains how a binary search algorithm works on a sorted array of 8 numbers.

---

```
{{
TYPE: Step-by-Step Animation

TITLE: "Binary Search — Find the Target"

EDUCATIONAL PURPOSE:
Walks the learner through a binary search on a concrete array, step by step.
The learner should understand how the search space is halved at each step by
comparing the target to the midpoint element, and how quickly the algorithm
converges on the answer.

CANVAS SIZE: 700 × 380

VISUAL DESCRIPTION:
8 equally-sized boxes arranged in a single horizontal row, centered on the
canvas. Each box is 64px wide × 64px tall with 8px gaps.

Inside each box: the element's value (from sorted array [3, 7, 12, 18, 24,
31, 39, 47]), in monospace font 18px.

Color coding:
- Default box: white background, dark gray border (#D1D5DB), dark text
- Active search range: light blue background (#DBEAFE), blue border (#3B82F6)
- Current midpoint: orange background (#FED7AA), orange border (#F97316),
  bold text
- Eliminated (out of range): very light gray background (#F9FAFB), gray text
  (#9CA3AF), dashed border — visually "faded out"
- Found (target matched): green background (#DCFCE7), green border (#16A34A)

Above the array:
- "Search target: 31" — fixed label, monospace 14px
- "Step [N] of [total]" — updates each step, sans-serif 13px gray

Below the array:
- A text explanation of what happened in this step, e.g.:
  "Midpoint is index 3 (value 18). 31 > 18, so we search the right half."
  Sans-serif 14px dark gray, centered, max-width 560px.

Controls (below the explanation text):
- "Next Step" button (120×38px, blue #3B82F6, white text, rounded corners)
- "Reset" button (80×38px, light gray background, dark text, rounded corners)
  positioned to the right of "Next Step"

INITIAL STATE:
All 8 boxes are visible and active (light blue). No box is highlighted as
midpoint yet. Explanation text reads: "The array is sorted. We're looking for
the value 31. Click 'Next Step' to begin." Step counter shows "Step 0 of 4".

BEHAVIOR:
The learner clicks "Next Step" to advance through each step of the algorithm.
The visual updates to reflect the new state after each click.
"Next Step" is disabled (grayed out) after the final step.

Clicking "Reset" returns to the initial state instantly.

STATES (5 total):

State 0 — Initial:
  All boxes active (light blue). No midpoint. Explanation: "Click 'Next Step'
  to begin." Step: 0 of 4.

State 1 — Step 1:
  Search range: indices 0–7 (all). Midpoint: index 3 (value 18), orange.
  Explanation: "Mid = index 3, value 18. Target 31 > 18 → search right half
  (indices 4–7)."
  Step: 1 of 4.

State 2 — Step 2:
  Indices 0–3 faded (eliminated). Search range: indices 4–7 (light blue).
  Midpoint: index 5 (value 31), orange.
  Explanation: "Mid = index 5, value 31. Target 31 = 31 → Found!"
  Step: 2 of 4. (Note: this is where the target is found.)
  "Next Step" is now disabled. A "✓ Found at index 5" badge appears above
  box 5 in green.

(Binary search on this array resolves in 2 steps — the step count reflects
the actual algorithm, not an artificial 4.)

LABELS AND TEXT ON CANVAS:
- "Search target: 31" — fixed, monospace 14px, dark gray
- "Step [N] of [total]" — dynamic, sans-serif 13px, gray
- Each box: its value, monospace 18px
- Each box below: its index (0–7), sans-serif 11px, gray (#9CA3AF)
- Explanation text: sans-serif 14px, dark gray, centered below array
- "Next Step" button label: sans-serif 14px white
- "Reset" button label: sans-serif 14px dark gray
- "✓ Found at index 5" badge: sans-serif 13px green, appears in State 2

EDUCATIONAL ANNOTATIONS:
In each step, a bracket or arc appears above the array indicating the current
active search range (indices low to high), labeled "search range [low..high]"
in small blue text. This bracket shrinks as the range narrows.
}}
```