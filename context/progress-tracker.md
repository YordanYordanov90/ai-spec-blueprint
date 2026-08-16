# Progress Tracker

## Project status

Status: Web experience in progress

The application scaffold is owned by the human developer and may not yet exist when this file is first copied.

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
- [x] Exact model selection is unresolved.
- [x] V1 does not require a database.
- [x] V1 does not require authentication.
- [x] PostgreSQL + Drizzle is the preferred persistence direction only if persistence is later approved.
- [x] The human manually scaffolds the initial Next.js project.
- [x] Agents may install feature-level dependencies after scaffolding.
- [x] Final Markdown generation should be deterministic.
- [x] AI should produce validated structured blueprint data rather than independently generating every context document.

## Open product decisions

- [ ] Final product name
- [ ] Final brand color / accent system
- [ ] Exact OpenAI model for V1
- [ ] Exact export packaging format
- [ ] Whether V1 preserves unfinished onboarding across browser refreshes
- [ ] Exact timing of extracting Blueprint Core into a physical workspace package
- [ ] Exact CLI command naming
- [ ] Initial framework profiles beyond the product's own Next.js-oriented experience

Open decisions are not implementation authorization.

## Current phase

Phase 4 - Web experience

## Current feature

`F022 - Build new-project onboarding shell`

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
- [ ] F022 - Build new-project onboarding shell
- [ ] F023 - Build Grill Me interface
- [ ] F024 - Build blueprint completeness panel
- [ ] F025 - Build blueprint review experience
- [ ] F026 - Build generated-file explorer and preview
- [ ] F027 - Build context export

### Phase 5 - CLI

- [ ] F028 - Establish reusable CLI package boundary
- [ ] F029 - Implement CLI initialization workflow
- [ ] F030 - Generate context from CLI
- [ ] F031 - Implement feature planning workflow
- [ ] F032 - Implement verification workflow
- [ ] F033 - Implement project/context doctor

### Phase 6 - Existing project adoption

- [ ] F034 - Detect repository technology facts
- [ ] F035 - Analyze existing project conventions
- [ ] F036 - Ask only unresolved adoption questions
- [ ] F037 - Generate adopted project blueprint

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
