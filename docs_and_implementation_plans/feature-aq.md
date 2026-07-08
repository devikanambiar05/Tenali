# Feature AQ — Tap-to-Define Word Glossary

## Overview

Before implementation, read:

- feature_docs/ (for the original feature overview and requirements)
- AI_HANDOVER.md
- Context.md
- Documentation.md

Do not redesign existing architecture.

Reuse existing components and follow the current project structure.

---

# Feature Objective

Many students fail math questions not because they lack mathematical understanding, but because they do not understand one or two mathematical terms used inside the question.

The objective of this feature is to reduce reading barriers by allowing students to tap unfamiliar mathematical words and instantly view a simple explanation without interrupting their learning flow.

The glossary should support understanding, not provide hints or reveal answers.

---

# Product Goals

The feature should:

- Improve comprehension of mathematical vocabulary.
- Reduce unnecessary cognitive load.
- Keep students inside the learning experience.
- Encourage independent learning.
- Never expose the answer.
- Never interrupt the current question.
- Feel lightweight and integrated.

---

# Non Goals

This feature should NOT:

- Explain how to solve the problem.
- Reveal formulas.
- Reveal intermediate steps.
- Reveal the correct answer.
- Open another page.
- Redirect users.
- Depend on AI.
- Depend on network requests.
- Become a full dictionary.

---

# User Journey

## Flow

Student opens a question.

↓

Question renders normally.

↓

System identifies mathematical glossary terms.

↓

Only registered glossary words become interactive.

↓

Student taps an unfamiliar word.

↓

A small definition appears.

↓

Student understands the meaning.

↓

Student continues solving.

↓

Definition closes.

↓

Student remains on the same question.

The student's workflow must never be interrupted.

---

# Learning Principles

Every glossary definition should:

Use simple language.

Be understandable by a child.

Avoid technical wording.

Avoid mathematical notation where possible.

Never contain:

- solution
- answer
- shortcut
- formula
- calculation

Definitions should only explain the meaning of the word.

Example:

Good:

Perimeter

"The distance around the outside of a shape."

Bad:

"Add all four sides together."

That becomes a hint.

---

# Supported Terms

Examples include:

- perimeter
- area
- numerator
- denominator
- factor
- multiple
- quotient
- product
- vertex
- edge
- angle
- polygon
- rectangle
- square
- fraction
- decimal
- integer
- coefficient
- variable
- equation
- inequality
- probability
- ratio

The glossary must be easily extendable by adding new entries without changing application logic.

---

# Functional Requirements

The system should:

- detect glossary terms inside question text
- render only supported terms as interactive
- preserve existing formatting
- support multiple glossary terms in one question
- support repeated terms
- work across all question types that display text
- gracefully ignore unknown words

---

# UX Requirements

The interaction should feel effortless.

Students should discover the feature naturally.

Definitions should appear immediately.

Reading the definition should require only a few seconds.

The feature should never distract from solving the question.

---

# Accessibility

Students should be able to use the glossary regardless of:

- mouse
- touch
- keyboard

The interaction should remain accessible.

---

# Performance Requirements

The glossary should feel instantaneous.

Avoid unnecessary processing.

Avoid repeated parsing whenever possible.

Reuse existing rendering flow.

Do not introduce unnecessary dependencies.

---

# Error Handling

If glossary data is unavailable:

- question should still render
- learning should continue
- no crashes
- no broken UI

Unknown words should simply remain normal text.

---

# Data Source

Glossary content should come from static project resources.

No API.

No AI.

No online service.

The glossary should be maintainable by non-developers.

Future contributors should be able to add terms by editing a single resource.

---

# Architecture Expectations

Before implementation identify:

- where question text enters the UI
- where text rendering happens
- reusable rendering components
- reusable popup/overlay components
- existing localization support
- existing accessibility helpers
- existing utilities that can be reused

Integrate with existing architecture.

Do not duplicate functionality.

---

# Code Quality Requirements

Implementation should:

- be modular
- be reusable
- follow existing conventions
- avoid large files
- avoid unnecessary abstraction
- avoid dead code
- avoid duplicate logic

Prefer extending existing components instead of creating parallel implementations.

---

# Edge Cases

Support:

multiple glossary words

same glossary word appearing multiple times

punctuation

capitalized words

lowercase words

plural forms if already supported

questions without glossary terms

very long questions

very short questions

mixed formatting

---

# Testing Checklist

Verify:

Question renders exactly as before.

Questions without glossary terms behave normally.

Questions with one glossary term work.

Questions with multiple glossary terms work.

Repeated glossary terms work.

Definitions never reveal answers.

Existing question flow remains unchanged.

No regressions are introduced.

Accessibility remains intact.

Performance remains smooth.

---

# Documentation Requirements

After implementation update:

AI_HANDOVER.md

Context.md

Documentation.md

Include:

files modified

implementation summary

design decisions

future improvements

known limitations

remaining TODOs

---

# Definition of Done

The feature is complete only when:

✓ Glossary terms are automatically recognized.

✓ Students can interact with glossary terms.

✓ Definitions appear without leaving the question.

✓ Existing question flow is unchanged.

✓ No answers or hints are exposed.

✓ Existing architecture has been reused.

✓ No unnecessary refactoring was performed.

✓ Documentation has been updated.

---

# Final Instructions

Before writing code:

1. Read feature_docs for the original feature description.
2. Read AI_HANDOVER.md.
3. Read Context.md.
4. Read Documentation.md.
5. Understand the relevant architecture.
6. Summarize the implementation plan.
7. Identify the files that will be modified.
8. Explain why each file needs modification.

Only then begin implementation.

Throughout the implementation:

- Keep changes localized.
- Reuse existing patterns.
- Preserve existing behavior.
- Prefer simplicity over cleverness.
- Write production-quality, maintainable code.

Do not consider the task complete until both the implementation and documentation are finished.

# Mandatory Pre-Implementation Review

Before writing a single line of code, you MUST complete the following steps.

## Step 1 — Repository Analysis

Understand the existing implementation related to this feature.

Identify:

- Relevant files
- Existing architecture
- Data flow
- Components involved
- Utilities/helpers that can be reused
- Existing feature patterns
- Potential impact on other features

Do NOT assume anything.

If something is unclear, investigate the repository first.

---

## Step 2 — Present an Implementation Plan

Before coding, provide:

- Files that will be modified
- Files that may be created
- Why each file needs to change
- High-level implementation approach
- Any architectural concerns
- Potential risks
- Any existing code that should be reused

---

## Step 3 — Ask Questions

Do NOT begin implementation until all important ambiguities are resolved.

Ask every question that could affect the implementation.

Examples include:

- Functional ambiguities
- UX decisions
- Existing feature conflicts
- Naming conventions
- Edge-case behavior
- Future extensibility
- Backward compatibility

Do not make assumptions when clarification is required.

If no questions remain, explicitly state:

> "I have enough information to implement this feature."

Only after that should implementation begin.

---

# Git Workflow

This project follows a feature branch workflow.

Assume all work is being done on a dedicated feature branch.

Never:

- push commits
- create pull requests
- merge branches
- rewrite git history
- force push

After implementation is complete:

1. Summarize all changes made.
2. List every modified file.
3. List every newly created file.
4. Explain anything that requires manual verification.
5. Suggest a logical commit message using Conventional Commits.
6. Wait for user confirmation before staging or committing any changes.

Never run or suggest:

- git add
- git commit
- git push

unless the user explicitly asks.

The user is responsible for staging, committing, and pushing changes.

---

# Completion Checklist

A task is only complete when all of the following are true:

- Repository analysis completed.
- Questions asked and resolved.
- Implementation completed.
- Existing functionality preserved.
- Edge cases considered.
- Documentation updated.
- AI_HANDOVER.md updated.
- Context.md updated.
- Documentation.md updated.
- Final implementation summary provided.
- Suggested commit message generated.
- Waiting for user approval before any git operations.

