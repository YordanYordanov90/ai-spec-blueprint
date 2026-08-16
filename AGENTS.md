# AGENTS.md

## Purpose

This repository is developed using spec-driven development, durable Markdown context, and explicit architectural guardrails.

Do not treat chat history as the source of truth. The repository context is authoritative.

## Required reading order

Before implementation work:

1. Read `context/project-overview.md`.
2. Read `context/architecture.md`.
3. Read `context/schemas.md`.
4. Read `context/code-standards.md`.
5. Read `context/ui-context.md` when UI is involved.
6. Read `context/ai-workflow-rules.md`.
7. Read `context/progress-tracker.md`.
8. Read `features/current-feature.md`.
9. Read relevant ADRs from `decisions/`.

If a required context file is missing, contradictory, or materially incomplete, do not invent a replacement architecture. Surface the conflict before making a major design decision.

## Source-of-truth behavior

Before creating code:

- Search the repository for existing symbols, patterns, utilities, schemas, and domain terms.
- Reuse established patterns before creating new abstractions.
- Do not duplicate domain schemas, validation rules, generator logic, prompts, or architecture policies.
- Keep the shared Blueprint Core independent from interface-specific concerns.
- Treat Zod schemas as executable contracts at trust boundaries.
- Keep deterministic generation deterministic.
- AI may reason about project requirements, but normal TypeScript code must render known document formats.
- Do not place durable product knowledge only in prompts or chat messages.

## Scope control

Implement only the active feature in `features/current-feature.md`.

Do not:

- implement future backlog items because they appear easy
- add unrequested product features
- introduce authentication or persistence in V1 without an approved feature
- create the CLI during a Web feature
- create Web behavior during a CLI feature
- change architecture to make the current implementation easier
- perform unrelated refactors
- delete code or files outside active scope without approval

The complete target architecture may be documented before all components exist. Future components must not be implemented until their feature becomes active.

## Human-owned setup

The human developer owns the initial project scaffold.

Do not:

- run a framework starter to recreate the project
- switch package managers
- replace TypeScript, Tailwind, shadcn/ui, or Next.js configuration
- reorganize the repository at infrastructure scale
- introduce monorepo tooling merely because it may be useful later

Feature-level dependencies may be installed when justified by the active specification.

## Architectural approval

Ask before or explicitly surface the need for:

- major refactors
- new architectural layers
- dependency-direction changes
- persistence infrastructure
- authentication
- package/workspace restructuring
- replacing a major dependency
- deleting public APIs or user-facing behavior
- changing an approved ADR

Architecture changes should be recorded as ADRs.

## Failure behavior

After 2 to 3 materially similar failed implementation attempts:

1. Stop repeating the same approach.
2. Re-read the relevant context and feature specification.
3. Inspect actual runtime or type errors.
4. Reassess assumptions.
5. Propose the smallest corrective change.

Do not hide repeated failure behind increasingly broad rewrites.

## Verification

Before handoff:

- run the project's configured type check
- run lint
- run tests relevant to the feature when present
- run the production build when appropriate
- verify acceptance criteria from `features/current-feature.md`
- inspect the changed files for architecture violations

Do not claim success if required verification was not run. State what was and was not verified.

## Git

Do not commit, push, create branches, or open pull requests unless explicitly requested.
