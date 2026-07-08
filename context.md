# Current Context

## Project

**Tenali** — an adaptive math quiz platform for students. A monolithic full-stack app: Express server (`server/index.js`, ~9 000 lines) algorithmically generates questions across 69+ puzzle types; a single-file React client (`client/src/App.jsx`, ~49 500 lines) handles all UI. No React Router — routing is a `useState` in the root `App` component. Live at `tenali.fun`.

---

## Active Feature

**Feature AQ — Tap-to-Define Word Glossary**

Branch: `feat/tap-to-define-word-glossary`

Adds an inline math-term glossary to all word-problem quiz screens. Recognized terms in a question prompt are underlined and tappable; tapping shows a concise definition in an inline popover.

---

## Current Objective

Commit and merge the completed feature, then expand the glossary term list.

---

## Current Progress

**The core feature is fully implemented and working.** All changes are uncommitted on the feature branch.

| Task | Status |
|---|---|
| `GlossaryText.jsx` component | ✅ Done |
| `glossaryTerms.json` (40 terms) | ✅ Done |
| CSS for glossary styles | ✅ Done |
| Wired into `makeMCQuizApp` factory | ✅ Done |
| Wired into `makeQuizApp` factory | ✅ Done |
| Wired into standalone apps (ConceptApp, VocabApp, DotProdApp, GymApp, SetsApp, SequencesApp, RatioApp, PercentApp, IndicesApp) | ✅ Done |
| Committed to branch | ⬜ Pending |
| Merged to main | ⬜ Pending |
| Glossary term list expanded | ⬜ Pending |

---

## Files Currently Involved

- `client/src/components/GlossaryText.jsx` — new component (225 lines)
- `client/src/data/glossaryTerms.json` — new data file (40 terms)
- `client/src/App.jsx` — modified: import added, 11 prompt sites wired
- `client/src/App.css` — modified: ~105 lines of new CSS

---

## Current Architecture Summary

```
client/src/
├── App.jsx                  ← all quiz components; GlossaryText imported & used here
├── App.css                  ← global styles + new .glossary-* CSS classes
├── components/
│   └── GlossaryText.jsx     ← NEW: the interactive term-highlighting component
└── data/
    └── glossaryTerms.json   ← NEW: flat JSON array of { term, definition, aliases }
```

**Data flow:**
1. Quiz app renders question prompt → passes `text` prop to `<GlossaryText>`
2. `GlossaryText` runs a pre-built regex against the text → splits into plain `text` segments and interactive `term` segments
3. `term` segments render as `<GlossaryTooltip>` (underlined, tappable)
4. Tap → `openId` state in `GlossaryText` flips → popover appears inline
5. Click outside / Escape / 6-second timer → popover closes

---

## Immediate Next Tasks

- [ ] Commit the working tree: `git add -A && git commit -m "feat: tap-to-define word glossary (Feature AQ)"`
- [ ] Merge to main (or open PR if reviewing first)
- [ ] Expand `glossaryTerms.json` — priority terms to add: `gradient`, `perpendicular`, `bisector`, `simultaneous equations`, `matrix`, `determinant`, `quadratic`, `linear`, `expression`, `equation`, `inequality`, `arc`, `chord`, `tangent`, `asymptote`
- [ ] Test on a narrow mobile viewport to check popover clipping

---

## Definition of Done

- All word-problem quiz prompts in the app highlight recognized glossary terms with a dotted underline
- Tapping any highlighted term shows the correct, readable definition in a popover
- Pure math-expression renders (e.g. `5³ = ?`) are not affected
- Popovers close on: outside click, Escape key, 6-second auto-dismiss, and tapping the same term again
- Only the first occurrence of each term per prompt is interactive
- Feature is committed and live on `tenali.fun`
- `glossaryTerms.json` covers at minimum all terms referenced by the existing quiz corpus