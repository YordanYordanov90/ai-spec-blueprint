# Architecture Decision Records

This directory stores important architectural decisions that future agents must not silently reinterpret.

## Included records

- [ADR-001 - Shared Blueprint Core](ADR-001-shared-blueprint-core.md)
- [ADR-002 - In-repo CLI over Blueprint Core](ADR-002-in-repo-cli-boundary.md)

## When to add an ADR

Use an ADR for decisions such as:

- adding persistence
- adding authentication
- introducing workspace/monorepo tooling
- changing dependency direction
- changing the source-of-truth domain representation
- replacing a core technology
- changing how AI output becomes durable project state
- allowing a new external side effect

Do not create ADRs for trivial implementation choices.

## Suggested format

```text
# ADR-XXX - Title

## Status

Proposed | Accepted | Superseded

## Context

Why the decision exists.

## Decision

What was chosen.

## Consequences

What becomes easier, harder, required, or prohibited.

## Revisit when

Conditions that justify reconsideration.
```
