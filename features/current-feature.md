# F022 - Build New-Project Onboarding Shell

## Status

Ready after F021.

## Objective

Create the initial project creation route and interaction shell that the landing start action already targets.

## Why this feature is next

The landing now explains the product and links to `/new`. The next Web step is a focused onboarding shell before Grill Me UI.

## In scope

- a `/new` route that can accept an initial project idea
- a calm onboarding shell that is not a generic full-screen chat
- enough structure for later Grill Me and completeness panels to attach

## Out of scope

Do not implement:

- the full Grill Me conversation
- completeness panel
- blueprint review
- generated-file explorer
- export
- CLI
- authentication or persistence

## Architectural constraints

- Prefer Server Components by default. Use a Client Component only for the idea input.
- Do not put domain schemas or generators in the page.
- Keep the shared Blueprint Core independent from this route.

## Acceptance criteria

- `/new` is a usable project-creation shell.
- A user can enter an initial idea.
- The page is not a generic chat window.
- Grill Me questioning remains a later feature.

## Verification

Use the scaffolded project's actual commands:

- TypeScript/typecheck
- lint
- focused onboarding checks
- inspect `/` and `/new` for consistent start-action behavior
