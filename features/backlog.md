# Feature Backlog

## Rules

- This file defines planned work, not current implementation authority.
- Only `current-feature.md` may authorize implementation.
- Feature IDs are stable.
- Scope may be refined before a feature becomes active.
- A future feature must not be implemented opportunistically during another feature.

## Phase 1 - Domain foundation

### F001 - Define ProjectBlueprint domain schema — complete

Create the initial Zod schema composition for the core structured blueprint.

### F002 - Define guardrail and decision domain structures — complete

Add the minimum structures required to distinguish approved decisions, proposals, unresolved decisions, and guardrails.

### F003 - Define generated artifact model — complete

Define the framework-independent representation of an output file.

## Phase 2 - Deterministic generation

### F004 - Build generator contract — complete

Create the common deterministic generation interface.

### F005 - Generate project overview — complete

Render `context/project-overview.md` from validated blueprint data.

### F006 - Generate architecture context — complete

Render `context/architecture.md`.

### F007 - Generate schemas context — complete

Render `context/schemas.md`.

### F008 - Generate code standards — complete

Render `context/code-standards.md`.

### F009 - Generate UI context — complete

Render `context/ui-context.md`.

### F010 - Generate AI workflow rules — complete

Render `context/ai-workflow-rules.md`.

### F011 - Generate progress tracker — complete

Render `context/progress-tracker.md`.

### F012 - Generate AGENTS.md — complete

Generate the compact agent entry document.

### F013 - Generate complete context package — complete

Compose all generated files into one validated exportable package.

## Phase 3 - AI discovery

### F014 - Centralized AI model configuration — complete

Add Vercel AI SDK and OpenAI provider configuration without coupling the domain to a model name.

### F015 - Grill Me discovery state — complete

Represent temporary discovery facts, gaps, questions, and draft decisions.

### F016 - Project fact extraction — complete

Extract approved/explicit facts from project input into structured state.

### F017 - Missing-information analysis — complete

Determine which unresolved questions materially affect the blueprint.

### F018 - Focused follow-up questions — complete

Generate high-value Grill Me questions.

### F019 - Structured blueprint proposal — complete

Convert sufficient discovery state into a schema-constrained ProjectBlueprint proposal.

### F020 - AI validation/error experience — complete

Handle invalid or incomplete model output explicitly.

## Phase 4 - Web experience

### F021 - Product landing experience — complete

Create the initial public explanation of the product and workflow.

### F022 - New-project onboarding shell — complete

Create the initial project creation route and interaction shell.

### F023 - Grill Me interface — complete

Implement the primary discovery conversation UI.

### F024 - Blueprint completeness panel — complete

Show which project areas are complete, partial, unresolved, or missing.

### F025 - Blueprint review — complete

Allow the human to inspect and approve project decisions.

### F026 - Generated-file explorer — complete

Provide IDE-like navigation and readable Markdown preview.

### W001 - Redesign Web UI foundation — complete

Establish the product-specific visual system, landing-page composition, structured workspace shell, blueprint status language, guardrail card, architecture motif, and generated-artifact presentation without expanding underlying product behavior.

### F027 - Export — complete

Export the generated context package.

## Phase 5 - CLI

### F028 - Reusable CLI package boundary — complete

Physically expose the shared core to a CLI without duplicating Web logic.

### F029 - CLI initialization workflow — complete

Create the first developer-facing CLI workflow.

### F030 - CLI context generation — complete

Generate the same context package through the CLI.

### F031 - Feature planning workflow — complete

Prepare a scoped current feature from durable project context.

### F032 - Verification workflow — complete

Run or orchestrate configured project verification.

### F033 - Project/context doctor — complete

Detect missing context and important mismatch between declared and actual project state.

## Phase 6 - Adoption

### F034 - Technology detection — complete

Read an existing repository and detect verifiable stack facts.

### F035 - Convention analysis — complete

Identify real implementation patterns before proposing context.

### F036 - Adoption questions — complete

Ask only questions not answerable from the codebase and approved context.

### F037 - Adopted blueprint generation — complete

Generate a blueprint representing the existing project rather than an imaginary clean-slate architecture.
