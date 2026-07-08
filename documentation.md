# Technical Documentation

---

# Feature AQ — Tap-to-Define Word Glossary

## Problem Statement

Quiz question prompts in Tenali often contain mathematical vocabulary (e.g. *denominator*, *hypotenuse*, *probability*) that younger students may not know. Previously there was no in-context help — a student who didn't understand a word in a question had to leave the app to look it up, breaking focus and flow.

---

## Goals

- Allow students to tap any recognized math term directly inside a question prompt to see a plain-English definition
- Require zero server changes — purely a client-side enhancement
- Be non-intrusive: prompts without recognized terms must render identically to before
- Work on both mobile (tap) and desktop (click)

---

## Functional Requirements

- Recognized terms in a question prompt are shown with a dotted underline and a 📖 icon
- Tapping an underlined term opens an inline popover showing the term's canonical name and definition
- Only the **first occurrence** of each term per prompt is interactive; duplicates render as plain text
- Only **one popover is open at a time** — opening a second term closes the first
- Popovers close when: the user clicks/taps outside, presses Escape, taps the same term again, or after a 6-second auto-dismiss timer
- Multi-word terms (e.g. "prime number") are recognized as a single entry, not as two separate words
- Aliases and simple plurals are recognized (e.g. "vertices" → "vertex" definition)
- If a question prompt contains no recognized terms, it renders as plain text with zero overhead

---

## Implementation Overview

The feature is contained in two new files and small modifications to existing files:

1. **`client/src/data/glossaryTerms.json`** — a static JSON array of term definitions
2. **`client/src/components/GlossaryText.jsx`** — a React component that tokenizes a prompt string and renders interactive term spans
3. **`client/src/App.jsx`** — `GlossaryText` imported and used as a drop-in replacement wherever `{question.prompt}` or `{question.question}` was rendered as plain text in word-problem quizzes
4. **`client/src/App.css`** — CSS classes for the glossary visual treatment

---

## Data Flow

```
glossaryTerms.json
       │
       ▼  (parsed at module load, outside components)
  matchMap: { lowercase_form → { term, definition } }
       │
       ▼  (sorted longest-first, escaped, joined)
  glossaryRegex: /\b(prime number|perimeter|...|area)\b/gi
                         (built once, shared across all GlossaryText instances)
       │
       ▼  (on each render, via useMemo when text prop changes)
  segments: Array<
    { type: 'text', value: string }
    | { type: 'term', id, displayText, term, definition }
  >
       │
       ├── 'text' segments → plain strings in JSX
       └── 'term' segments → <GlossaryTooltip> (underline + popover)
                                      │
                                      ▼
                             openId state in <GlossaryText>
                             (null = no popover; number = index of open term)
```

---

## Components

### `GlossaryText` (default export from `GlossaryText.jsx`)

Public-facing component. Accepts a single `text` prop (the raw question prompt string).

- Runs `glossaryRegex` against `text` via `useMemo` (recalculates only when `text` changes)
- Manages `openId` state — which term's popover is open (`null` = none)
- If no matches exist, falls back to `<>{text}</>` with no extra DOM nodes

**Usage:**
```jsx
<GlossaryText text={question.prompt} />
// or
<GlossaryText text={question.question} />
```

### `GlossaryTooltip` (internal, not exported)

Renders one underlined interactive term and its popover.

- Receives controlled `isOpen` + `onToggle` from parent
- Three `useEffect`s: outside-click listener, Escape-key listener, 6-second auto-dismiss
- Uses a 10 ms delay before attaching the outside-click listener so the click that opened the popover doesn't immediately close it
- Fully accessible: `role="button"`, `tabIndex={0}`, `aria-expanded`, `aria-label`, keyboard activation on Enter/Space

### Module-level constants (not React components)

- **`matchMap`** — built once at module load from `glossaryTerms.json`. Key: lowercase form. Value: `{ term: canonical, definition }`.
- **`glossaryRegex`** — single `RegExp` built from all keys in `matchMap`, sorted longest-first, word-boundary-anchored, case-insensitive, global flag.

---

## Files

| File | Role |
|---|---|
| `client/src/components/GlossaryText.jsx` | Component + all logic (225 lines) |
| `client/src/data/glossaryTerms.json` | 40 term definitions |
| `client/src/App.jsx` | Import + 11 wiring sites |
| `client/src/App.css` | ~105 lines of new CSS |

**Quiz sites wired in `App.jsx`:**

| App / Factory | Line (approx.) | Field |
|---|---|---|
| `ConceptApp` | ~36491 | `question.question` |
| `VocabApp` | ~38961 | `question.question` |
| `makeMCQuizApp` factory | ~39257 | `question.prompt` |
| `makeQuizApp` factory | ~39498 | `question.prompt` |
| `DotProdApp` (fallback) | ~39857 | `question.prompt` |
| `GymApp` | ~40801 | `question.prompt` |
| `SetsApp` | ~42318 | `getPromptForType(...)` |
| `SequencesApp` | ~42514 | `question.prompt` |
| `RatioApp` | ~42667 | `question.prompt` |
| `PercentApp` | ~42836 | `question.prompt` |
| `IndicesApp` | ~43004 | `question.prompt` |

**Explicitly excluded** (pure math-expression renders, no prose):
- Any line rendering `{question.prompt} = ?` — these are arithmetic/log/index notation strings, not natural-language sentences.

---

## Design Decisions

**Longest-match-first regex**
Terms are sorted by length descending before building the regex alternation. This ensures `prime number` is matched as a whole before the single word `prime` could match.

**First-occurrence-only highlighting**
The `seen` Set inside the `useMemo` in `GlossaryText` tracks which base terms have already been tokenized as interactive. Subsequent occurrences become plain text. This keeps prompts readable and avoids cluttering every instance of a common word like "factor".

**Regex built once at module load**
Building the regex inside a component would re-create it on every render. Instead it is built at module scope, so all `GlossaryText` instances share the same compiled regex object.

**`useMemo` on `segments`**
The tokenization (regex + loop) runs only when `text` changes. For a static question prompt that re-renders (e.g. due to parent state changes), the work is skipped.

**Single `openId` state**
Rather than each `GlossaryTooltip` managing its own open state, the parent `GlossaryText` holds `openId`. This ensures only one popover is open at a time without any cross-component messaging.

**No hover interaction**
Feature AQ spec Section 9 requires mobile-first interaction. Hover states are intentionally omitted. The dotted underline + icon communicates interactivity without hover.

**Fail-safe JSON load**
The entire `matchMap` construction is in a `try/catch`. If `glossaryTerms.json` fails to parse, `matchMap` stays empty and `glossaryRegex` is `null`. In that case `GlossaryText` returns plain text. No crash.

---

## Edge Cases

| Case | Handling |
|---|---|
| Term appears multiple times in prompt | First occurrence is interactive; rest are plain text |
| Term with alias (e.g. "vertices") | Alias is registered in `matchMap` pointing to the canonical definition |
| Simple plural not in aliases (e.g. "factors") | Auto-registered at module load for single-word terms not ending in `s` |
| Prompt string is empty or non-string | `GlossaryText` returns `<>{text}</>` via early-return guard |
| No terms match | Segments array is all-text; returns `<>{text}</>` with no extra DOM |
| Popover near right edge of screen | Currently unhandled — CSS `left: 50%; transform: translateX(-50%)` centers it over the term, which may clip on narrow screens |
| Math-only prompt (`= ?` expressions) | Not wired — these quiz sites deliberately excluded |
| User opens popover and question auto-advances | `useEffect` in `GlossaryText` resets `openId` to `null` whenever `text` prop changes |

---

## Limitations

- **~40 terms** — only the most common GCSE-level math terms are currently defined. The corpus likely contains many more terms students might not know.
- **`\b` word boundaries only** — hyphenated terms like `right-angled` are not matched. The regex would match `right` but that has no glossary entry, so it's benign, but `right-angled` itself cannot be a glossary term without a custom tokenizer.
- **Popover may clip on small screens** — no floating-UI / Popper.js positioning logic. Future work.
- **No persistence** — there is no tracking of which terms a student has looked up. A future feature could log term lookups for analytics.
- **No search/index** — there is no standalone glossary index page. Terms are only surfaced contextually in quiz prompts.

---

## Future Improvements

- Expand `glossaryTerms.json` to 100+ terms covering the full GCSE curriculum
- Add a standalone "Glossary" page listing all terms alphabetically, accessible from the home screen
- Use a floating-UI library (e.g. `@floating-ui/react`) for smart popover positioning that avoids viewport clipping
- Track term lookups in analytics to identify which terms students find confusing most often
- Add "did you know" secondary facts to some definitions
- Consider fuzzy matching for common misspellings in student-generated content

---

## Testing

The feature was manually tested in the browser (Vite dev server at `http://localhost:5173/`):
- ConceptApp: tapped "probability" → popover appeared with correct definition
- VocabApp: word-definition prompt highlighted glossary terms correctly
- `makeMCQuizApp` factory apps (e.g. Probability, Stats, Mensuration): `question.prompt` terms highlighted
- `makeQuizApp` factory apps: short-answer prompt terms highlighted
- Prompts with no glossary terms: rendered identically to before, no extra DOM
- Multi-word: "prime number" matched as one unit, not as "prime" alone
- Alias: tested "vertices" — shows "vertex" canonical definition
- Auto-dismiss: popover closed after 6 seconds without interaction
- Escape key: popover closed
- Outside click: popover closed
- Multiple taps: toggled open/closed correctly; only one popover open at a time

No automated tests exist.

---

## Acceptance Criteria

- [x] Recognized math terms in question prompts are underlined and show a 📖 icon
- [x] Tapping a term opens an inline popover with the canonical name and definition
- [x] Only the first occurrence of each term per prompt is interactive
- [x] Only one popover is open at a time
- [x] Popovers close on outside click, Escape, same-term retap, and after 6 seconds
- [x] Prompts with no recognized terms render exactly as before
- [x] Feature works in all word-problem quiz apps
- [x] Pure math-expression prompts are unaffected
- [ ] Feature is committed, merged, and deployed to `tenali.fun`
- [ ] Glossary covers all terms in the quiz corpus

---

## Version History

### v1.0

Date: 2026-07-08

Summary: Initial implementation of Feature AQ — Tap-to-Define Word Glossary. Component (`GlossaryText.jsx`), data (`glossaryTerms.json`, 40 terms), CSS, and wiring into 11 quiz prompt sites across both factory-generated and standalone apps.

Files Changed:
- `client/src/components/GlossaryText.jsx` (new)
- `client/src/data/glossaryTerms.json` (new)
- `client/src/App.jsx` (modified — import + 11 prompt sites)
- `client/src/App.css` (modified — ~105 lines added)

Notes: Changes are uncommitted on branch `feat/tap-to-define-word-glossary`. Deployed to production pending commit + build.