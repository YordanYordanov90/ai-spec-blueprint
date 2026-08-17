# W001 - Redesign Web UI Foundation

## Status

Complete.

## Objective

Redesign the AI Spec Blueprint Web UI foundation so the product feels like a precise, distinctive developer tool for spec-driven development, project discovery, architecture definition, context engineering, guardrails, and coding-agent preparation.

The visual concept is architecture being progressively constructed from project decisions.

## In scope

- update the durable Web UI direction in repository context
- establish a dark-forward, semantic-token visual system that remains compatible with a future light theme
- redesign the landing page around the full idea-to-agent workflow
- improve the existing Grill Me workspace shell without replacing working behavior
- strengthen the blueprint completeness and review status language
- introduce a reusable Guardrail Card visual pattern using existing data where available
- add a lightweight architecture-node visual motif without building a diagramming subsystem
- improve the generated-artifact explorer and Markdown preview presentation
- preserve responsive behavior, keyboard focus, semantic HTML, and reduced-motion behavior

## Out of scope

Do not implement:

- new Grill Me AI behavior
- a new blueprint proposal or approval model
- new architecture generation behavior
- new context generation behavior
- context export or packaging
- a diagramming engine
- a global or persistent workspace state layer
- CLI behavior
- authentication, persistence, database infrastructure, or billing
- GitHub or deployment mutation

## Architectural constraints

- Preserve the existing Blueprint Core and interface dependency direction.
- Keep current Web session state local to the existing onboarding workspace.
- Do not change the domain schema merely to fill visual placeholders.
- Use actual discovery, blueprint, guardrail, and generated-artifact data wherever the functionality already exists.
- Clearly label landing-page examples and avoid implying that explanatory visuals are live project state.
- Use semantic CSS tokens instead of scattering raw brand colors through components.
- Reuse existing shadcn/ui primitives where they fit, while making the composition product-specific.
- No architecture file or ADR change is required for visual-only implementation.

## Acceptance criteria

- The landing page explains that AI Spec Blueprint prepares durable context around coding agents rather than acting as another coding agent.
- The workflow from description through discovery, architecture, guardrails, generation, and agent implementation is visually legible.
- The new-project route retains its working Grill Me, review, approval, and generated-file-preview behavior.
- Desktop presents discovery and blueprint state as a structured workspace, while mobile stacks major areas without horizontal overflow.
- Blueprint status and decision states do not rely on color alone.
- At least one reusable Guardrail Card is used with real blueprint data, and explanatory landing-page guardrails are clearly examples.
- Generated artifacts use an IDE-inspired hierarchy and readable preview without claiming export is implemented.
- Visual colors are expressed through semantic theme tokens and reduced-motion behavior is respected.
- No new authentication, persistence, export, CLI, or AI capability is introduced.

## Verification

Use the scaffolded project's actual commands:

- TypeScript typecheck
- lint
- existing focused checks for landing, onboarding, Grill Me, completeness, blueprint review, and generated files
- production build
- desktop visual inspection of `/` and `/new`
- mobile visual inspection of `/` and `/new`
- keyboard-focus review for major controls
- diff review for unnecessary refactors and architecture violations
