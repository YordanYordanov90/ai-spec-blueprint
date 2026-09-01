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

## Phase 7 - Guardrail education and documentation

### F038 - Guardrail documentation library — complete

Create a dedicated Web documentation surface for the architectural guardrail topics that informed AI Spec Blueprint.

The library must explain the topics in original product language, distinguish source concepts from AI Spec Blueprint adaptations, and keep long-form education separate from Blueprint Core, generated project context, Grill Me prompts, and CLI output.

## Phase 8 - Deployment protection

### F039 - Server-side AI abuse protection — complete

Protect public AI operations with server-side rate limiting before provider calls.

The feature must use deployment-trusted request identity and edge or shared enforcement suitable for Vercel, return structured retry guidance, cap request and model-output size, and avoid treating client controls or process-local memory as production security. QStash is not required.

## Phase 9 - Blueprint lifecycle

### F040 - Local draft recovery — complete

Persist schema-validated discovery and blueprint working state in the browser, offer explicit resume and reset controls, and communicate that recovery is device-local rather than cloud storage.

### F041 - Section-level blueprint revision and approval — complete

Allow individual stack and architecture proposals to be approved or rejected, provide a schema-validated structured editor for any blueprint section, and preserve the human approval boundary.

### F042 - Import and resume blueprint — complete

Import a validated `blueprint.json` or an AI Spec Blueprint ZIP export and reopen it in the review workspace without authentication or server persistence.

### F043 - Blueprint and generated-artifact diff — complete

Compare the current blueprint with an imported baseline and show changed blueprint sections plus added, changed, and removed generated artifacts before export.

### F044 - Repository handoff experience — complete

Connect export to the existing CLI workflow with extraction, doctor, and next-feature instructions that remain copyable and do not mutate an external repository.

### F045 - Discovery history, undo, and defer — complete

Expose recorded user-answer history, allow the most recent successful discovery turn to be undone locally, and provide an explicit decide-later response for uncertainty.

### F046 - Blueprint readiness report — complete

Surface blocking decisions, pending proposals, deferred decisions, and missing active-feature state, and prevent artifact generation while a blocking decision remains.

### F047 - Guided example project — complete

Provide a deterministic, no-provider-call example that lets a visitor inspect review, readiness, generated files, diffs, and repository handoff before starting discovery.

## Phase 10 - Review follow-up

### F048 - Address PR review findings — complete

Close the confirmed Codex and DiffGuard findings for lifecycle generation, import versioning, artifact diffs, and repository handoff. Keep the fix inside the existing Blueprint Core and Web boundaries.

## Phase 11 - Review hardening

### F049 - Harden lifecycle review boundaries — complete

Address the second DiffGuard review pass for untrusted ZIP imports, clipboard failure recovery, workspace restore/autosave transitions, and structured editor synchronization. Keep the implementation local-first and within the existing Blueprint Core and Web boundaries.

## Phase 12 - Import compatibility hardening

### F050 - Harden import format and snapshot compatibility — complete

Sniff imported bytes before selecting the ZIP or JSON parser, fail clearly on filename/content mismatches, and safely handle local workspace snapshots that are no longer compatible with the current schema or lifecycle expectations.

## Phase 13 - AI quality improvement

### F051 - Establish AI quality evaluations and baseline — complete

Add a versioned offline evaluation corpus, deterministic quality graders, a human semantic-review rubric, an opt-in provider-backed runner with sanitized metrics, and a baseline report for the current discovery/proposal path.

## Phase 14 - Production bug fixes

### B001 - Resolve reported production regressions — complete

Resolve the reported Grill Me fact-ID and Users discovery regressions, add a
branded unknown-route experience, replace native empty-submit validation with
accessible inline feedback, and reduce the favicon to a small valid PNG.

## Phase 15 - Web experience hardening

### B002 - Add custom system-state pages — complete

Add branded, accessible 404, unexpected-error, and loading states using the
approved Next.js App Router conventions while preserving the existing product
visual system.
