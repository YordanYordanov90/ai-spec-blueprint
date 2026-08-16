# Project Overview

## Working title

AI Spec Blueprint

The name is temporary. Product naming and branding are not part of the initial implementation scope.

## Product summary

AI Spec Blueprint is a spec-driven and architecture-guarded development system for AI-assisted software projects.

The product helps a developer transform an early project idea into durable project context that coding agents can reliably use across sessions.

The system does not primarily generate application code. It creates and maintains the layer around coding agents:

- project understanding
- architectural decisions
- domain context
- implementation guardrails
- feature specifications
- verification expectations
- durable project state

The product is inspired by the workflow principles of tools such as AI Blueprint, but it must develop its own architecture, terminology, implementation, product experience, and visual identity.

## Core problem

AI coding sessions often lose important project decisions because requirements, architecture, scope, and previous reasoning exist only in conversation history.

This causes:

- architectural drift
- duplicate implementations
- inconsistent patterns
- oversized changes
- agents implementing future work early
- repeated explanation of project context
- loss of historical decisions
- code generation before requirements are sufficiently understood

The product addresses this by converting approved decisions into readable repository files that remain available to future agent sessions.

## Product principles

### 1. Durable context over chat memory

Important project knowledge must live in project files, not only in an AI conversation.

### 2. Human remains the architect

AI proposes, analyzes, questions, and synthesizes.

The human approves important product and architecture decisions.

### 3. Spec before implementation

A feature must be scoped before code is changed.

### 4. One active feature

The agent may understand the full roadmap, but implementation is constrained to the current feature.

### 5. Architectural guardrails

The project explicitly records dependency direction, technology boundaries, validation rules, security expectations, and prohibited shortcuts.

### 6. Deterministic work stays deterministic

AI produces structured reasoning and structured domain output.

Known Markdown formats, file layouts, validation, and transformations are implemented with deterministic TypeScript.

### 7. Shared core

The Web interface and CLI are two interfaces over the same Blueprint Core.

They must not evolve separate versions of project schemas, generators, prompts, or guardrails.

## Primary users

Initial target users:

- solo developers
- developers using Codex or similar coding agents
- AI-assisted full-stack developers
- developers who prefer spec-driven development
- developers who want more control than chat-only coding provides

The initial product is optimized for individual developers rather than teams.

## Main product surfaces

### Web application

The Web application is the first major interface.

It provides:

- landing and product explanation
- new-project onboarding
- Grill Me project discovery
- visible project completeness/progress
- architecture proposal and review
- project blueprint review
- generated file preview
- export

The Web UI should make the reasoning and architecture legible. It should not be only a generic chat window.

### CLI

The CLI is part of the target product architecture but is implemented later.

Its purpose is developer-native repository workflows such as:

- initializing blueprint context
- generating or updating project context
- project adoption for an existing repository
- feature preparation
- verification
- context health checks

The CLI must consume the same Blueprint Core used by the Web application.

The existence of the CLI in the roadmap does not authorize implementing it during Web-focused features.

## Grill Me

Grill Me is the project discovery and clarification experience.

It should:

1. accept an initial project idea
2. determine which important information is already known
3. identify material gaps
4. ask focused follow-up questions
5. avoid asking questions that can already be answered from available context
6. surface architectural tradeoffs when necessary
7. build a structured ProjectBlueprint
8. allow human review before durable files are generated

Grill Me is a product capability.

A Codex `grill-me` skill is optional future work and is not required for initial development.

## Generated project knowledge

The system should eventually be able to generate a context package including:

- `AGENTS.md`
- `context/project-overview.md`
- `context/architecture.md`
- `context/schemas.md`
- `context/code-standards.md`
- `context/ui-context.md`
- `context/ai-workflow-rules.md`
- `context/progress-tracker.md`
- feature backlog
- active feature specification
- ADR scaffolding
- agent skills where appropriate

Exact export structure may evolve through approved feature work.

## V1 technology stack

Confirmed:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod
- Vercel AI SDK
- OpenAI provider

Model selection is intentionally unresolved.

## Persistence

V1 requires no database.

The main workflow must be possible without:

- user accounts
- authentication
- server-side project persistence

If persistence later becomes an approved product requirement, PostgreSQL with Drizzle ORM is the preferred direction.

Drizzle must not be installed or introduced merely because it is a possible future choice.

## Authentication

No authentication is required for V1.

Authentication should only be introduced when a feature requires durable user identity, saved cloud projects, teams, billing, or another approved authenticated capability.

## V1 non-goals

Not part of V1 unless explicitly promoted through feature planning:

- database persistence
- authentication
- billing
- teams
- cloud project history
- automatic Git operations
- automatic deployment
- autonomous architecture changes
- automatic application scaffolding
- broad support for every framework
- replacing the coding agent itself

## Initial success criteria

The project is successful when a developer can:

1. describe a software idea
2. complete a focused Grill Me discovery process
3. review a structured project blueprint
4. approve architecture and guardrails
5. generate consistent context files
6. export those files
7. place them in a repository
8. give a coding agent enough durable context to begin controlled feature work
