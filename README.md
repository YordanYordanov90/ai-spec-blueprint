# AI Development Blueprint - Bootstrap Context

This package is the initial source of truth for the project.

## Intended workflow

1. Manually scaffold the Next.js application.
2. Copy this package into the repository root.
3. Adjust only environment-specific details that are known after scaffolding, such as the package manager and exact scripts.
4. Open the repository in Codex.
5. Codex must read `AGENTS.md` and the context files before implementation.
6. Begin with `features/current-feature.md`.
7. Implement only the active feature.
8. Verify the feature.
9. Update project state before starting the next feature.

## Important bootstrap rule

The human developer owns the initial application scaffold.

Agents may install feature-level dependencies after the scaffold exists, but must not recreate the project, change the package manager, replace the framework setup, or perform broad infrastructure changes without an approved feature or architecture decision.

## Working product name

`AI Development Blueprint` is a working title only. Product naming and branding are intentionally unresolved.

## V1 product boundaries

V1 includes:

- Web interface
- Grill Me project discovery
- Project blueprint generation
- Context file generation
- Architecture guardrails
- Blueprint review
- Export
- Shared framework-independent blueprint logic
- A later CLI interface that uses the same core logic

V1 does not require:

- Authentication
- Database persistence
- Billing
- User accounts
- Team workspaces
- Cloud project history
- Automatic deployment
- Automatic Git commits
- Automatic project scaffolding

## Context precedence

When documents disagree, use this precedence:

1. Explicit current human instruction
2. Approved ADRs in `decisions/`
3. `context/architecture.md`
4. `context/schemas.md`
5. `context/ai-workflow-rules.md`
6. `context/code-standards.md`
7. `context/ui-context.md`
8. `context/project-overview.md`
9. `context/progress-tracker.md`
10. `features/current-feature.md` for implementation scope

A feature specification may narrow architecture, but must not silently override an approved architectural decision.
