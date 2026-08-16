# ADR-001 - Shared Blueprint Core

## Status

Accepted

## Context

The target product has two interfaces:

- Web application
- CLI

Both interfaces create, inspect, validate, and generate project blueprint information.

If each interface owns separate schemas, prompts, guardrails, or Markdown generation logic, they will drift and produce inconsistent project context.

The Web interface will be implemented before the CLI, so there is a risk that Web-specific code becomes the accidental core architecture.

## Decision

The product has one logical Blueprint Core.

The Web application and CLI must consume the same:

- ProjectBlueprint domain model
- Zod schemas
- guardrail model
- deterministic generators
- relevant prompt/orchestration contracts
- validation rules

The Blueprint Core must remain independent from React, Next.js UI concerns, browser-only APIs, and CLI-only libraries.

Physical packaging may evolve.

The project does not require a monorepo or Turborepo on day one.

Early shared logic may live in an isolated framework-independent module inside the manually scaffolded Web project.

Before the CLI depends on that logic, the shared core must be physically reusable without importing Web interface concerns.

## Consequences

### Positive

- Web and CLI produce consistent output.
- Domain logic is testable independently.
- AI and generation behavior has one source of truth.
- CLI implementation later does not require reimplementing the product.

### Cost

- Web code must respect a domain boundary before the CLI exists.
- Some modules may later need physical extraction into a package/workspace.

## Prohibited outcome

Do not create:

```text
Web blueprint generator
+
separate CLI blueprint generator
```

or allow the CLI to import React/Next.js UI modules.

## Revisit when

Revisit the physical packaging when CLI implementation begins or when the existing module boundary creates measurable development friction.
