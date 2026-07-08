# AI HANDOVER

---

## Session

**Date:** 2026-07-08

**Model:** Antigravity (Google DeepMind) — Claude Sonnet 4.6 (Thinking)

**Feature:** AQ — Tap-to-Define Word Glossary

**Status:** In Progress (core feature complete; not yet committed)

---

## Objective

Implement Feature AQ: a "tap-to-define" glossary that scans quiz question prompts for recognized math terms, underlines the first occurrence of each, and shows an inline popover definition when the user taps.

---

## Work Completed

- Created `GlossaryText` React component (`client/src/components/GlossaryText.jsx`)
- Created `glossaryTerms.json` data file (`client/src/data/glossaryTerms.json`) — 40 terms with definitions, canonical names, and aliases
- Added all CSS for the glossary feature to `client/src/App.css` (`.glossary-term`, `.glossary-term-wrapper`, `.glossary-popover`, etc.)
- Imported `GlossaryText` into `App.jsx` and wired it into every word-problem quiz prompt site
- **Quiz factories wired:** `makeMCQuizApp` (line ~39257) and `makeQuizApp` (line ~39498) — covers all factory-generated quiz components
- **Standalone apps wired:** `ConceptApp`, `VocabApp`, `DotProdApp`, `GymApp`, `SetsApp`, `SequencesApp`, `RatioApp`, `PercentApp`, `IndicesApp`
- Pure math-expression renders (`{question.prompt} = ?`) intentionally left as plain text — glossary does not help there

---

## Files Created

- `client/src/components/GlossaryText.jsx` — the full component (225 lines)
- `client/src/data/glossaryTerms.json` — 40 glossary terms

---

## Files Modified

- `client/src/App.jsx` — import added at top; `<GlossaryText>` wired into ~11 question prompt sites
- `client/src/App.css` — ~105 lines of new CSS added for glossary styles

---

## Important Decisions

- **Longest-match-first regex** — `prime number` is matched before `prime` alone, preventing partial-word clobbering
- **First-occurrence only** — only the first instance of each glossary term in a prompt gets the interactive treatment; subsequent occurrences render as plain text. This keeps prompts readable.
- **One popover at a time** — a single `openId` state in `GlossaryText` (parent) closes the previous popover whenever a new term is tapped
- **Auto-dismiss after 6 s** — popovers close automatically to avoid interfering with answering
- **Click/tap only (not hover)** — mobile-first per Feature AQ spec
- **No GlossaryText on math-expression prompts** — apps that render `{question.prompt} = ?` (arithmetic, logs, indices) were explicitly excluded because the prompts are just math notation, not prose
- **Fail-safe JSON import** — the entire match map build is wrapped in try/catch; if glossaryTerms.json is malformed, matching is silently disabled and text renders plain

---

## Architecture Changes

- **New component:** `GlossaryText` (in `client/src/components/`) — renders plain string → mixed text + interactive `GlossaryTooltip` spans
- **New data file:** `client/src/data/glossaryTerms.json` — flat JSON array, each entry `{ term, definition, aliases? }`
- **Pattern used in `App.jsx`:** `<GlossaryText text={question.prompt} />` or `<GlossaryText text={question.question} />` — a drop-in replacement for `{question.prompt}` / `{question.question}` in any word-problem quiz div
- **No routing or API changes** — purely frontend, no server involvement
- **No state or auth changes**

---

## Known Issues

- `glossaryTerms.json` currently has ~40 terms. Some important topics (e.g. `perpendicular`, `bisector`, `simultaneous`, `gradient`) are missing — the list should be expanded over time
- The regex uses `\b` word-boundary anchors which don't handle hyphenated terms (e.g. `right-angled`) well — `right` would not match inside `right-angled`
- The popover positioning is CSS `position: absolute` relative to the term wrapper. On very narrow screens or if the term is near the right edge, the popover may clip off-screen. A future improvement would use floating-UI or similar
- No automated tests exist for this feature

---

## Remaining TODOs

- [ ] Commit the feature on branch `feat/tap-to-define-word-glossary` and open a PR / merge to main
- [ ] Expand `glossaryTerms.json` with more curriculum terms (gradient, perpendicular, bisector, simultaneous equations, matrix, determinant, etc.)
- [ ] Verify the popover doesn't clip on narrow mobile viewports
- [ ] Consider adding more quiz sites that were not covered (any future `makeQuizApp` / `makeMCQuizApp` usages are automatically covered by the factory wiring; only bespoke components need individual wiring)
- [ ] Production build and deploy once merged

---

## Notes For Next LLM

**Branch:** `feat/tap-to-define-word-glossary` — all changes are uncommitted (working tree modified).

**The feature is complete and functional.** The dev server is running (`npm run dev` on port 5173, `node index.js` on port 4000). You can test it immediately at `http://localhost:5173/`.

**How to pick it up:**
1. The component is in `client/src/components/GlossaryText.jsx`. Read the file header — it explains all design decisions.
2. Glossary data is in `client/src/data/glossaryTerms.json`. Add terms there following the existing `{ term, definition, aliases }` schema.
3. `GlossaryText` is imported at the top of `App.jsx` (search for `import GlossaryText`). It is wired into every word-problem quiz by replacing `{question.prompt}` / `{question.question}` with `<GlossaryText text={question.prompt} />`.
4. Do NOT wrap the math-expression lines that look like `{question.prompt} = ?` — they render pure math notation.

**Important caveats:**
- `glossaryRegex` is built **once at module load** (outside components). Adding terms to `glossaryTerms.json` at runtime will not hot-reload the regex — a full page reload is needed in dev, and a new build in production.
- The `seen` set inside `GlossaryText.segments` is recalculated fresh on every `text` prop change via `useMemo`. This is correct.
- The `onToggle` callback in each `GlossaryTooltip` is created inline and will change reference on every render — this is intentional because the parent's `openId` state changes on toggle, and the `useEffect` deps arrays in the tooltip correctly depend on `onToggle`. No infinite loop occurs because the effects only register/unregister listeners.
- CSS classes: `.glossary-term` (underline style), `.glossary-term--open` (highlighted open state), `.glossary-popover` (tooltip bubble), `.glossary-term-icon` (📖 icon). All in `App.css`.