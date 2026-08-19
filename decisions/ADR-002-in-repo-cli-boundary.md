# ADR-002 — In-repo CLI over Blueprint Core

## Status

Accepted

## Context

ADR-001 requires Web and CLI to consume the same Blueprint Core, and says physical packaging should be revisited when CLI work begins.

F028 requires a reusable CLI package boundary. Repository architecture still prohibits introducing monorepo or workspace tooling merely to host the CLI.

## Decision

The CLI lives in `src/cli` inside the existing repository.

It may import only:

- Node built-ins
- `src/lib/blueprint` public API
- small CLI-owned argument parsing and process I/O

It must not import React, Next.js, `app/`, or `components/`.

Blueprint Core remains in `src/lib/blueprint` and stays independent from both Web and CLI interface libraries.

No npm workspace, Turborepo, or package extraction is introduced.

## Consequences

### Positive

- CLI and Web generate the same context package.
- The existing module boundary is reused without an infrastructure migration.
- Import-direction checks can enforce the package boundary.

### Cost

- A later physical extraction into `packages/core` may still be justified if the in-repo boundary becomes friction.

## Prohibited outcome

Do not create a second generator, schema, or adoption implementation inside the CLI.
