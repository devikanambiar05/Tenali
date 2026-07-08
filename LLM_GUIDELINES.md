You are working on the Tenali codebase.

Your primary goal is to understand and extend the existing project, not redesign it.

## Step 1 — Read First (Mandatory)

Before making ANY code changes, thoroughly read and understand the following:

1. AI_HANDOVER.md (Highest Priority) - [this](AI_HANDOVER.md)
2. The two attached feature documentation files
- [Doc1](docs_and_implementation_plans/Tenali-SRS.md)
- [Doc2](docs_and_implementation_plans/attribution_matrix.md)
3. context.md - [this](context.md)
4. documentation.md - [this](documentation.md)

Treat AI_HANDOVER.md as the project's source of truth for continuity across different LLMs. Never overwrite previous information. Only append new information.

## Step 2 — Understand the Existing Codebase

Before implementing anything, understand the existing architecture related to the feature.

Specifically identify:

- How question data flows through the application
- Where questions are rendered
- Existing reusable UI/components
- Existing utilities and helper functions
- Existing state management
- Existing routing/navigation
- Existing data models
- Existing static assets/resources
- Existing localization or translation support
- Existing accessibility support
- Existing feature patterns that should be reused

Prefer extending existing implementations instead of introducing new ones.

## Engineering Principles

Always:

- Follow the existing architecture.
- Follow existing coding conventions.
- Reuse existing components whenever possible.
- Keep changes localized.
- Avoid unnecessary abstractions.
- Avoid unnecessary dependencies.
- Do not refactor unrelated code.
- Do not duplicate existing functionality.
- Preserve all existing behavior unless explicitly required.

If multiple implementation options exist, choose the one that introduces the smallest amount of change while remaining maintainable.

---

# Documentation Workflow (Mandatory)

Every meaningful implementation must update the following files before the task is considered complete.

---

## 1. AI_HANDOVER.md

Purpose:
Enable another LLM to continue the project immediately without rereading the repository.

Never delete existing content.

Always append a new dated entry.

Each entry should include:

- Feature name
- Goal
- Why this feature exists
- Current implementation status
- Files created
- Files modified
- Components added
- Components modified
- Data model/storage changes
- API changes
- Routing/navigation changes
- State management changes
- Utilities/helpers added
- Important architectural decisions
- Reasons for those decisions
- Edge cases handled
- Known limitations
- Bugs found
- Remaining TODOs
- Anything the next LLM must know before continuing

Think of this as a chronological engineering handover log.

---

## 2. Context.md

Purpose:
Provide a quick snapshot of the current repository so a new LLM can immediately understand the project's current state.

Keep this document concise.

It should contain:

- Project overview
- Current active feature
- Current objective
- Current implementation stage
- High-level architecture summary
- Important folders/files
- Files currently being modified
- Immediate next tasks
- Current blockers (if any)
- Definition of Done for the active feature

This file should always reflect the CURRENT working context.

---

## 3. Documentation.md

Purpose:
Serve as the permanent implementation documentation for the project.

Every feature should have its own section containing:

- Feature overview
- Problem statement
- Goals
- Functional requirements
- Implementation overview
- Data flow
- Components involved
- Files involved
- Design decisions
- Assumptions
- Edge cases handled
- Limitations
- Future improvements
- Testing performed
- Acceptance criteria

Maintain a version history for each feature.

Each version entry should include:

- Version
- Date
- Summary
- Files changed
- Breaking changes (if any)
- Migration required (if any)

This document should become the project's permanent technical documentation.

---

## Before Starting Any Implementation

First provide a concise summary of:

- Relevant files
- Existing architecture
- Data flow
- Components involved
- Reusable utilities
- Constraints
- Proposed implementation approach

Do not write code until you understand how the existing system works.

---

## Before Finishing Any Task

Verify that:

- The requested feature is fully implemented.
- Existing functionality still works.
- No unrelated code was modified.
- Documentation has been updated.
- AI_HANDOVER.md has been updated.
- Context.md reflects the current project state.
- Documentation.md reflects the latest implementation.

A task is only considered complete when both the implementation and documentation are complete.


Never guess: If a required file, function, component, or behavior cannot be confidently located in the repository, stop and ask the user instead of inventing an implementation.