# Current Feature

## No active feature

Status: ready for planning

F040 through F047 are complete. Do not begin another implementation feature until it is promoted from `features/backlog.md` and specified here.

## Most recently completed feature

### F047 - Guided example project

- Status: complete
- Phase: Blueprint lifecycle
- Surface: Web

## Objective

Let a visitor inspect the complete blueprint lifecycle without making an AI provider call or creating an account.

## Delivered lifecycle sequence

1. F040 - schema-validated browser-local recovery
2. F041 - decision-level review and validated blueprint editing
3. F042 - JSON and product ZIP import
4. F043 - structured blueprint and generated-artifact diff
5. F044 - repository handoff instructions
6. F045 - discovery answer history, undo, and defer
7. F046 - actionable readiness gate
8. F047 - deterministic guided example

## Boundaries preserved

- no authentication
- no database or cloud project storage
- no GitHub repository mutation
- no automatic command execution
- no second Blueprint Core
- no change to deterministic Markdown formats

## Verification

- focused lifecycle checks
- TypeScript typecheck
- lint
- existing focused checks
- production build
- local browser verification of guided example, artifact preview, and refresh recovery
