# Feature AQ — Tap-to-Define Word Glossary
### Full Implementation Plan (single-prompt build spec)

> **Purpose of this document**: This is a complete, self-contained build spec for one feature. It is written so an LLM (Claude Code) can implement the entire feature correctly in one pass without needing to ask clarifying questions, guess at file structure, invent scope, or touch unrelated code. Follow it literally. Where the plan says "inspect the codebase first," do that before writing any code.

---

## 0. Non-Negotiable Constraints (read first)

These exist to prevent scope creep, wasted tokens, and broken builds:

1. **No new npm dependencies.** This feature is buildable with plain React + CSS. Do not install a tooltip/popover library.
2. **No backend changes.** No new Express routes, no MongoDB schema changes, no server-side data loading. This is a 100% client-side, static-data feature.
3. **No changes to the math generation engine, solve middleware, or any `*-api` endpoint.**
4. **Additive only.** Do not refactor `App.jsx` beyond the minimal integration points described in Section 8. Do not rename existing components, props, or CSS classes.
5. **Reuse existing design tokens.** Before writing any CSS, inspect `client/src/App.css` and `client/src/index.css` for existing CSS variables (colors, font sizes, border-radius, spacing). Use those variables. Only introduce new CSS variables if genuinely nothing suitable exists, and if so, define them in `App.css` alongside the existing variable block — do not scatter magic numbers/hex codes in the component file.
6. **Two new files only** (plus one data file): a term dictionary (JSON) and one component file exporting two components (`GlossaryText`, `GlossaryTooltip` — can live in the same file, see Section 6). Do not create a folder structure deeper than `client/src/components/` and `client/src/data/`.
7. **If any assumption below turns out to be wrong once you inspect the actual repo** (e.g. file doesn't exist at the stated path, question prompts are rendered differently than assumed), adapt the integration point but do NOT change the data model, detection algorithm, or component API described here.

---

## 1. Feature Summary

A student reading a word problem (e.g. *"Find the perimeter of the rectangle"*) may understand the math but stumble on unfamiliar vocabulary (*perimeter*). This feature underlines recognized mathematical terms inside question prompts with a dashed underline. Tapping (or clicking) an underlined term opens a small popover with a plain-language, age-appropriate definition. This isolates reading/vocabulary ability from mathematical ability — critical for the Bucket 2 population (kids with less consistent access to English-medium instruction, tutoring, or reading support at home).

This is a **presentation-layer feature only**. It does not change question generation, scoring, or any answer-checking logic. It only decorates the text of the question prompt wherever it is currently rendered.

---

## 2. User Journey

1. Student opens any quiz/puzzle screen (e.g. Fractions, Mensuration, HCF & LCM — any topic whose question prompt is a sentence containing a recognized term).
2. The question prompt renders as normal, except recognized terms have a **dashed underline** styled subtly (not distracting, not colored like a hyperlink).
3. Student taps/clicks the underlined word.
4. A small popover appears near the word, showing:
   - The term (bold, capitalized)
   - A one-sentence, plain-language definition (no jargon, no circular definitions — e.g. do NOT define "perimeter" using the word "boundary" without explanation)
5. Popover stays open until: the student taps the same term again, taps elsewhere on the screen, taps a different underlined term, or 6 seconds pass (auto-dismiss timer, so it doesn't block quiz interaction indefinitely).
6. Only one popover can be open at a time.
7. This never blocks or delays answer submission — the student can ignore it entirely and just answer the question.
8. If a prompt contains no recognized terms, the prompt renders exactly as it does today (no visual difference, no wrapper artifacts, no console errors).

---

## 3. Scope

### In scope
- Static, local JSON dictionary of terms → definitions.
- A text-wrapping component that scans plain-text question prompts and highlights matches.
- Tap/click-to-open popover with definition, single-open-at-a-time behavior, auto-dismiss.
- Word-boundary-safe, case-insensitive matching (so "Perimeter", "perimeter", and "perimeters" all match, but "perimeters" doesn't wrongly match inside an unrelated word like "hyperimeter" — see Section 5 for exact matching rules).
- Mobile-first interaction (tap), works the same on desktop (click — not hover, see Section 9 for rationale).

### Explicitly out of scope (do not build these)
- Hindi/multilingual definitions (that's Feature U's territory — leave a clear extension point but do not implement translation).
- Per-student tracking of which terms they've looked up (no analytics, no DB writes — this must stay fully local and private, no surveillance).
- Auto-generating definitions via any AI/LLM call at runtime.
- Editing/authoring UI for teachers to manage the glossary (static JSON is fine for v1).
- Rich formatting (images, diagrams) inside the popover — text only for v1.

---

## 4. Architecture Overview

```
client/src/
├── data/
│   └── glossaryTerms.json      # NEW — static term dictionary
├── components/
│   └── GlossaryText.jsx        # NEW — exports GlossaryText + internal GlossaryTooltip
├── App.jsx                     # MODIFIED — import + wrap prompt rendering (minimal diff)
└── App.css                     # MODIFIED (only if new CSS vars are genuinely needed)
```

No server involvement. No new state management library. No routing changes.

Data flow: `glossaryTerms.json` (static import) → `GlossaryText` component (receives raw prompt string as a prop) → scans string → renders a mix of plain text nodes and `<GlossaryTooltip>` wrapped term nodes → click handler opens/closes popover using local component state only.

---

## 5. Data Model — `client/src/data/glossaryTerms.json`

### Schema
```json
[
  {
    "term": "perimeter",
    "definition": "The total distance around the outside edge of a shape.",
    "aliases": ["perimeters"]
  }
]
```

- `term` (string, required): the canonical lookup key, lowercase, singular.
- `definition` (string, required): one sentence, plain language, no circular definitions, no jargon words that themselves need defining. Max ~120 characters where possible — this is a popover, not an essay.
- `aliases` (array of strings, optional): plural forms or common variant spellings that should also trigger the same definition (e.g. "vertices" as an alias for "vertex"). If omitted, only exact `term` matches (plus simple trailing-`s` plural, see Section 5b) are matched.

### Starter content (use exactly this list for v1 — do not invent new terms, do not skip any, do not alter the wording of definitions)

```json
[
  { "term": "perimeter", "definition": "The total distance around the outside edge of a shape.", "aliases": ["perimeters"] },
  { "term": "area", "definition": "The amount of flat space inside a shape.", "aliases": [] },
  { "term": "numerator", "definition": "The top number in a fraction — it shows how many parts you have.", "aliases": ["numerators"] },
  { "term": "denominator", "definition": "The bottom number in a fraction — it shows how many equal parts the whole is split into.", "aliases": ["denominators"] },
  { "term": "vertex", "definition": "A corner point where two or more lines or edges meet.", "aliases": ["vertices"] },
  { "term": "hypotenuse", "definition": "The longest side of a right-angled triangle, opposite the right angle.", "aliases": [] },
  { "term": "coefficient", "definition": "The number placed in front of a variable, showing how many of that variable you have (e.g. the 3 in 3x).", "aliases": ["coefficients"] },
  { "term": "variable", "definition": "A letter (like x or y) that stands in for a number we don't know yet.", "aliases": ["variables"] },
  { "term": "factor", "definition": "A whole number that divides exactly into another number with no remainder.", "aliases": ["factors"] },
  { "term": "multiple", "definition": "A number you get by multiplying a given number by a whole number (e.g. 6, 12, 18 are multiples of 6).", "aliases": ["multiples"] },
  { "term": "prime number", "definition": "A whole number greater than 1 that can only be divided evenly by 1 and itself.", "aliases": ["prime numbers"] },
  { "term": "ratio", "definition": "A way of comparing two quantities, showing how many times one value contains another.", "aliases": ["ratios"] },
  { "term": "percentage", "definition": "A number expressed as a fraction of 100.", "aliases": ["percentages"] },
  { "term": "mean", "definition": "The average of a set of numbers — add them all up and divide by how many there are.", "aliases": [] },
  { "term": "median", "definition": "The middle value in a list of numbers when they are arranged in order.", "aliases": [] },
  { "term": "mode", "definition": "The value that appears most often in a set of numbers.", "aliases": [] },
  { "term": "range", "definition": "The difference between the largest and smallest values in a set of numbers.", "aliases": [] },
  { "term": "probability", "definition": "A measure of how likely something is to happen, usually shown as a fraction, decimal, or percentage.", "aliases": [] },
  { "term": "quadrant", "definition": "One of the four sections formed when a graph is divided by its horizontal and vertical axes.", "aliases": ["quadrants"] },
  { "term": "congruent", "definition": "Having exactly the same size and shape.", "aliases": [] },
  { "term": "similar", "definition": "Having the same shape but not necessarily the same size — one is an enlarged or shrunk copy of the other.", "aliases": [] },
  { "term": "bearing", "definition": "A direction measured clockwise from north, given as a 3-digit angle (e.g. 045°).", "aliases": ["bearings"] },
  { "term": "exponent", "definition": "A small number showing how many times to multiply a number by itself (e.g. the 3 in 2³).", "aliases": ["exponents", "index", "indices"] },
  { "term": "surd", "definition": "A square root (or other root) that cannot be simplified into a whole number.", "aliases": ["surds"] },
  { "term": "polynomial", "definition": "An expression made of variables and numbers combined using addition, subtraction, and multiplication (e.g. 2x² + 3x - 1).", "aliases": ["polynomials"] },
  { "term": "remainder", "definition": "The amount left over when one number doesn't divide exactly into another.", "aliases": ["remainders"] },
  { "term": "integer", "definition": "A whole number that can be positive, negative, or zero — never a fraction or decimal.", "aliases": ["integers"] },
  { "term": "circumference", "definition": "The distance all the way around a circle.", "aliases": [] },
  { "term": "radius", "definition": "The distance from the center of a circle to its edge.", "aliases": [] },
  { "term": "diameter", "definition": "The distance across a circle through its center — exactly twice the radius.", "aliases": [] },
  { "term": "tangent", "definition": "A straight line that touches a curve or circle at exactly one point without crossing it.", "aliases": [] },
  { "term": "sequence", "definition": "A list of numbers arranged in a specific order, following a pattern or rule.", "aliases": ["sequences"] },
  { "term": "matrix", "definition": "A rectangular grid of numbers arranged in rows and columns.", "aliases": ["matrices"] },
  { "term": "determinant", "definition": "A single number calculated from a matrix that tells you certain properties about it.", "aliases": [] },
  { "term": "vector", "definition": "A quantity that has both size (magnitude) and direction.", "aliases": ["vectors"] },
  { "term": "magnitude", "definition": "The size or length of a vector, ignoring its direction.", "aliases": [] },
  { "term": "gradient", "definition": "A measure of how steep a line is — how much it goes up or down for every step across.", "aliases": [] },
  { "term": "discriminant", "definition": "A value calculated from a quadratic equation that tells you how many solutions it has.", "aliases": [] }
]
```

### 5b. Matching rules (implement exactly this)
- Case-insensitive matching.
- Match on whole words only (word-boundary regex — never match a substring inside a larger unrelated word).
- Match `term` and every string in `aliases`.
- Additionally, auto-accept a simple trailing "s" plural of `term` even if not explicitly listed in `aliases` (so authors don't have to enumerate every plural) — but do NOT do this if `term` already ends in "s" (to avoid double-pluralizing edge cases) and do NOT do this for multi-word terms like "prime number" (handle those only via explicit `aliases`, as shown above).
- **Longest-match-first**: when scanning text, check multi-word terms (e.g. "prime number") before single-word terms, so "prime number" is highlighted as one unit rather than "prime" and "number" separately or not at all.
- Build the matching regex/lookup **once** (module-level or via `useMemo`), not on every render.

---

## 6. Component Design — `client/src/components/GlossaryText.jsx`

### Public API
```jsx
<GlossaryText text={question.prompt} />
```
- `text` (string, required): the raw question prompt to render.
- Renders a `<span>` (or `<p>`, matching whatever tag currently wraps prompts in `App.jsx` — see Section 8) containing a mix of plain text and highlighted term spans.
- No other props needed for v1. Do not add a `terms` prop — the dictionary is imported directly inside this file from `../data/glossaryTerms.json`, since it's static.

### Internal structure (single file, two things exported/defined)

```jsx
// GlossaryText.jsx — pseudocode structure, not literal final code

import terms from '../data/glossaryTerms.json';

// 1. Build a single case-insensitive regex from all terms + aliases + auto-plurals,
//    sorted longest-first, computed once at module load (outside the component).

// 2. GlossaryText(props: { text }):
//    - splits `text` into an array of {type: 'text'|'term', value, definition?}
//      using the regex from step 1
//    - renders plain segments as-is
//    - renders term segments as <GlossaryTooltip term={...} definition={...} />
//    - manages ONE piece of shared state: which term-instance is currently open
//      (use a simple unique id per rendered instance, e.g. index-based, so only
//      one popover is open across the whole app at a time — lift this state up
//      via React context ONLY if multiple GlossaryText instances can be on screen
//      simultaneously and must not both show popovers; otherwise local state per
//      instance is fine since only one question prompt is visible at a time in
//      the existing quiz UI)

// 3. GlossaryTooltip({ term, definition, isOpen, onToggle }):
//    - renders the underlined <span> with onClick={onToggle}
//    - conditionally renders a popover <div> positioned via CSS (see Section 7)
//      right below/above the term when isOpen
//    - sets a 6-second auto-dismiss timer via useEffect + setTimeout when opened,
//      cleared on unmount/close
//    - closes on outside click (use a simple document click listener with cleanup)
```

### State management rule
Keep it local to the component tree. Do **not** introduce Redux/Context/Zustand for this. A single `useState` for "currently open term id" inside `GlossaryText`, passed down to each `GlossaryTooltip` instance as `isOpen`/`onToggle` props, is sufficient and correct.

---

## 7. Styling Spec

- **Underline style**: dashed, ~1.5px, using the existing muted/secondary text color variable from `App.css` (do not introduce a new blue "link-looking" color — this must not look like a hyperlink, since students shouldn't think it navigates away).
- **Cursor**: `pointer` on the term span, `help` is also acceptable.
- **Popover**:
  - Small card, max-width ~240px, padding ~12px, rounded corners matching existing card components' border-radius variable.
  - Background should use existing surface/card background variable, with a subtle box-shadow.
  - Bold term name as the popover title, definition text below in normal weight, smaller font size than body text (~0.85rem).
  - Position: absolutely positioned relative to the term span (`position: relative` on the term span wrapper, `position: absolute` on the popover, `top: 100%` with a small margin-top). If the term is near the right edge of the viewport, it's acceptable for v1 to let it clip slightly rather than building full collision-detection repositioning logic — do not build a full floating-UI positioning engine for this.
  - z-index high enough to sit above quiz content but should not need to exceed any existing modal/overlay z-index in the app — check existing z-index usage in `App.css` first.
- **Mobile**: same tap-based interaction as desktop click (see Section 9). Ensure popover width doesn't overflow small screens — use `max-width: min(240px, 80vw)`.
- **Animation**: a simple fade/scale-in over ~120ms is enough. Do not build anything elaborate.

---

## 8. Integration Steps (into the existing monolithic `App.jsx`)

Since the codebase directory structure has React logic centralized in `client/src/App.jsx`, follow these steps in order:

1. **Locate** every place in `App.jsx` where a question/puzzle prompt string is rendered to the student (search for wherever `question.prompt`, `currentQuestion.prompt`, or similar is rendered inside JSX — the exact variable name will depend on the real code, inspect it directly rather than assuming).
2. For each such render site, replace the raw text render (e.g. `<p>{question.prompt}</p>`) with `<GlossaryText text={question.prompt} />`, keeping the same wrapping tag and any existing className so surrounding layout/styling is unaffected.
3. Add the import at the top of `App.jsx`: `import GlossaryText from './components/GlossaryText';`
4. **Do not** apply `GlossaryText` to: answer input fields, button labels, navigation/menu text, or any non-question-prompt UI text. Only question/puzzle prompt strings shown to the student during a quiz.
5. If a topic's prompt is not a plain string but is built from JSX fragments or contains embedded numbers/variables via string interpolation, `GlossaryText` must still work correctly as long as the final rendered string is passed in as one plain string prop — resolve any interpolation into a plain string **before** passing it to `GlossaryText`, not inside it.
6. After integration, manually verify at least 3 different topic types (e.g. Mensuration, Fractions, HCF & LCM) render correctly with terms underlined and popovers working, and at least 1 topic with no matching terms (e.g. Addition) renders identically to before this change.

---

## 9. Accessibility & Interaction Notes

- **Tap/click, not hover.** Hover-based tooltips are unreliable and frustrating on touch devices (which is the primary device type for this audience, especially Bucket 2 students on shared/borrowed devices). Use `onClick` uniformly across desktop and mobile — do not build separate hover logic for desktop.
- Add `role="button"` and `tabIndex={0}` plus an `onKeyDown` handler (Enter/Space triggers the same toggle) to each term span, so keyboard users aren't excluded.
- Add `aria-expanded={isOpen}` on the term span and `role="tooltip"` on the popover div.
- Do not trap focus inside the popover — it's informational only, not a modal.

---

## 10. Edge Cases & Validation Rules

- Empty or `null`/`undefined` `text` prop → render nothing (return `null`), do not throw.
- A prompt containing a term that is also part of a larger unrelated word must NOT match (e.g. "range" inside "orange" must not trigger — enforced by word-boundary regex, not manual substring checks).
- Two different terms adjacent in text (e.g. "prime factor") — since "prime number" is the only explicit multi-word entry, "prime factor" should match "prime" nowhere near "factor" unless both individually exist in the list — verify this doesn't create a false combined match. Match strictly per dictionary entries, never infer new multi-word terms.
- If the JSON file fails to load or is malformed, `GlossaryText` should fail safe: render the plain text with no highlighting rather than crashing the quiz screen. Wrap the term-matching setup in a try/catch at module load if feasible, or ensure a malformed entry simply doesn't match rather than throwing.
- Opening a new popover while another is open must close the previous one — never allow two open simultaneously.

---

## 11. Acceptance Criteria

```gherkin
Scenario: Student taps a recognized term in a word problem
  Given a word problem containing the term "perimeter"
  When the student taps the underlined term "perimeter"
  Then a popover displays the definition:
    "The total distance around the outside edge of a shape."
  And no other popover is open at the same time

Scenario: Tapping elsewhere closes the popover
  Given a term's definition popover is currently open
  When the student taps anywhere else on the screen
  Then the popover closes

Scenario: Auto-dismiss after inactivity
  Given a term's definition popover is currently open
  When 6 seconds pass with no further interaction
  Then the popover closes automatically

Scenario: Prompt with no recognized terms
  Given a question prompt containing no dictionary terms (e.g. a basic addition question)
  When the prompt renders
  Then no underlines appear
  And the prompt text is identical to its un-wrapped plain-text rendering

Scenario: Plural form matches
  Given a word problem containing the word "vertices"
  When the student taps the underlined word "vertices"
  Then the popover displays the definition registered for "vertex"
```

---

## 12. Implementation Checklist (do in this order)

1. [ ] Create `client/src/data/glossaryTerms.json` with the exact starter content from Section 5.
2. [ ] Create `client/src/components/GlossaryText.jsx` implementing the matching logic (Section 5b), `GlossaryText`, and `GlossaryTooltip` (Section 6).
3. [ ] Inspect `App.css`/`index.css` for existing color/spacing/radius/z-index variables to reuse for styling (Section 7). Add CSS for `.glossary-term`, `.glossary-popover` (or equivalent class names consistent with existing naming conventions in the codebase).
4. [ ] Inspect `App.jsx` to find every question-prompt render site.
5. [ ] Wire in `GlossaryText` at each site per Section 8.
6. [ ] Manually test the 5 acceptance scenarios in Section 11 across at least 3 topics with terms present and 1 topic with none.
7. [ ] Confirm no console errors/warnings introduced, no new npm dependencies in `package.json`, no server files touched.

---

## 13. Out of Scope / Future Extension Points (do not build now, but don't block them)

- Hindi definitions: when Feature U (i18n) lands, `glossaryTerms.json` can gain a `definition_hi` field and `GlossaryText` can pick based on active language — leave the JSON schema simple for now, don't pre-build this.
- Per-topic curated term subsets (only show terms relevant to the current topic) — not needed for v1, global dictionary is fine since matching is already scoped to whatever text is actually present in the prompt.
- Teacher-facing glossary editor — not needed for v1.
