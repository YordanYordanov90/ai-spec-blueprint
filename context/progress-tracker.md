# Progress Tracker

## Project status

Status: Core V1 workflow, deployment protection, and local-first blueprint lifecycle complete

## Confirmed product decisions

- [x] Product is a spec-driven and architecture-guarded development system.
- [x] Durable Markdown context is a core product concept.
- [x] Human approval remains part of architecture decisions.
- [x] Web and CLI are both target product interfaces.
- [x] Web and CLI must share the same Blueprint Core.
- [x] Web is implemented before CLI.
- [x] Grill Me is a core Web product feature.
- [x] A Codex Grill Me skill is not required for initial development.
- [x] Next.js is the Web framework.
- [x] TypeScript is required.
- [x] Tailwind CSS is required.
- [x] shadcn/ui is the UI component foundation.
- [x] Zod is required.
- [x] Vercel AI SDK is used for AI integration.
- [x] OpenAI is the initial model provider.
- [x] AI usage protection is enforced server-side through deployment-trusted Vercel Firewall checks before provider calls.
- [x] Exact model selection is unresolved.
- [x] V1 does not require a database.
- [x] V1 does not require authentication.
- [x] PostgreSQL + Drizzle is the preferred persistence direction only if persistence is later approved.
- [x] The human manually scaffolds the initial Next.js project.
- [x] Agents may install feature-level dependencies after scaffolding.
- [x] Final Markdown generation should be deterministic.
- [x] AI should produce validated structured blueprint data rather than independently generating every context document.
- [x] Web context export uses a ZIP containing generated Markdown and `blueprint.json`.
- [x] V1 CLI commands are `init`, `generate`, `feature`, `verify`, `doctor`, and `adopt`.
- [x] Long-form guardrail education belongs in a separate Web documentation surface.
- [x] The source PDF is research material and must not become a runtime prompt, application dependency, or generated-project artifact.
- [x] Documentation must distinguish source concepts from AI Spec Blueprint adaptations and use original wording and examples.
- [x] Unfinished Web workspaces are recoverable through schema-validated browser-local storage.
- [x] Existing blueprints can be imported from `blueprint.json` or product-generated ZIP exports.
- [x] Blueprint changes and generated-artifact changes are visible before export.
- [x] Blocking unresolved decisions prevent durable artifact generation.
- [x] Lifecycle features remain local-first and require no authentication or database.
- [x] Shared Web and CLI generation paths reject blocking unresolved blueprint decisions.
- [x] Imported blueprint files accept only supported extensions and schema version `1.0`.
- [x] Review follow-up fixes are recorded as F048 and verified.

## Open product decisions

- [ ] Final product name
- [ ] Final brand color / accent system
- [ ] Exact OpenAI model for V1
- [ ] Exact timing of extracting Blueprint Core into a physical workspace package
- [ ] Initial framework profiles beyond the product's own Next.js-oriented experience
- [ ] Whether a later feature adds AI-assisted discussion to guardrail topic pages
- [ ] Whether a later CLI feature adds short topic explanations or documentation links

Open decisions are not implementation authorization.

## Current phase

Phase 14 complete - Production regression fixes

## Current feature

No active feature. B001 - Resolve reported production regressions is the most
recently completed feature.

See `features/current-feature.md`.

## Phase roadmap

### Phase 1 - Domain foundation

- [x] F001 - Define ProjectBlueprint domain schema
- [x] F002 - Define guardrail and decision domain structures
- [x] F003 - Define generated artifact model

### Phase 2 - Deterministic generation

- [x] F004 - Build generator contract
- [x] F005 - Generate project overview
- [x] F006 - Generate architecture context
- [x] F007 - Generate schemas context
- [x] F008 - Generate code standards
- [x] F009 - Generate UI context
- [x] F010 - Generate AI workflow rules
- [x] F011 - Generate progress tracker
- [x] F012 - Generate AGENTS.md
- [x] F013 - Generate complete context package

### Phase 3 - AI discovery

- [x] F014 - Add centralized AI model configuration
- [x] F015 - Define Grill Me discovery state
- [x] F016 - Implement project fact extraction
- [x] F017 - Implement missing-information analysis
- [x] F018 - Generate focused follow-up questions
- [x] F019 - Produce structured blueprint proposal
- [x] F020 - Validate and surface AI blueprint errors

### Phase 4 - Web experience

- [x] F021 - Build product landing experience
- [x] F022 - Build new-project onboarding shell
- [x] F023 - Build Grill Me interface
- [x] F024 - Build blueprint completeness panel
- [x] F025 - Build blueprint review experience
- [x] F026 - Build generated-file explorer and preview
- [x] W001 - Redesign Web UI foundation
- [x] F027 - Build context export

### Phase 5 - CLI

- [x] F028 - Establish reusable CLI package boundary
- [x] F029 - Implement CLI initialization workflow
- [x] F030 - Generate context from CLI
- [x] F031 - Implement feature planning workflow
- [x] F032 - Implement verification workflow
- [x] F033 - Implement project/context doctor

### Phase 6 - Existing project adoption

- [x] F034 - Detect repository technology facts
- [x] F035 - Analyze existing project conventions
- [x] F036 - Ask only unresolved adoption questions
- [x] F037 - Generate adopted project blueprint

### Phase 7 - Guardrail education and documentation

- [x] F038 - Build Guardrail documentation library

### Phase 8 - Deployment protection

- [x] F039 - Add server-side AI abuse protection

### Phase 9 - Blueprint lifecycle

- [x] F040 - Add local draft recovery
- [x] F041 - Add section-level blueprint revision and approval
- [x] F042 - Import and resume a blueprint
- [x] F043 - Show blueprint and generated-artifact diffs
- [x] F044 - Add repository handoff guidance
- [x] F045 - Add discovery history, undo, and defer
- [x] F046 - Add a blueprint readiness report
- [x] F047 - Add a guided example project

### Phase 10 - Review follow-up

- [x] F048 - Address PR review findings

### Phase 11 - Review hardening

- [x] F049 - Harden lifecycle review boundaries

### Phase 12 - Import compatibility hardening

- [x] F050 - Harden import format and snapshot compatibility

### Phase 13 - AI quality improvement

- [x] F051 - Establish AI quality evaluations and baseline

### Phase 14 - Production bug fixes

- [x] B001 - Resolve reported production regressions

## Deferred capabilities

- authentication
- database-backed saved projects
- team workspaces
- billing
- cloud synchronization
- GitHub repository mutation
- automatic deployment
- broad multi-framework support
- autonomous code generation as the primary product
- AI-assisted guardrail discussion that mutates blueprint state
- CLI reproduction of long-form Web documentation
