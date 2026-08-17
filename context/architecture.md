# Architecture

## Architectural objective

Keep project reasoning, domain representation, AI interaction, deterministic document generation, and interface concerns separated.

The Web application and future CLI must operate over the same shared Blueprint Core.

## High-level system

```text
                    OpenAI
                      ^
                      |
               Vercel AI SDK
                      ^
                      |
                AI Interaction
                      |
                      v
                Blueprint Core
             /        |         \
        Schemas   Guardrails   Generators
           |          |           |
           +----------+-----------+
                      |
                ProjectBlueprint
                      |
              deterministic output
                      |
                  Markdown
                  /      \
               Web       CLI
```

The diagram describes logical dependency direction, not necessarily the physical folder layout on the first implementation day.

## Core architectural rule

Interface layers may depend on the Blueprint Core.

The Blueprint Core must not depend on:

- React components
- Next.js route conventions
- browser APIs
- shadcn/ui
- Web-only state
- CLI-only terminal libraries

The Web and CLI must not independently implement blueprint generation rules.

## Staged physical architecture

The project is Web-first.

During early Web implementation, shared logic may initially live inside a clearly isolated framework-independent module, for example:

```text
src/
  lib/
    blueprint/
      schemas/
      domain/
      guardrails/
      generators/
      prompts/
      validation/
```

The CLI lives in `src/cli` and imports the Blueprint Core public API. Workspace packages were not introduced for V1. See `decisions/ADR-002-in-repo-cli-boundary.md`.

The eventual repository may still use workspace packages if justified, for example:

```text
apps/
  web/

packages/
  core/
  cli/
```

Workspace or monorepo infrastructure is not itself a V1 requirement and must not be introduced prematurely.

## Major layers

### 1. Interface layer

Responsibilities:

- Web routes and layouts
- React components
- form and interaction state
- streaming presentation
- blueprint review UX
- export actions
- CLI input/output

Must not own:

- canonical domain schemas
- blueprint rules
- Markdown document formats
- architecture policies

### 2. AI interaction layer

Responsibilities:

- model configuration
- Grill Me question generation
- requirement synthesis
- architectural analysis
- structured blueprint proposal
- follow-up question decisions

Rules:

- use Vercel AI SDK
- use OpenAI as the initial provider
- exact model is configuration, not domain architecture
- avoid scattering provider/model identifiers through unrelated modules
- AI outputs that become domain state must be schema validated
- AI output must not directly write arbitrary project files

### 3. Blueprint domain layer

This is the heart of the product.

Responsibilities:

- `ProjectBlueprint`
- project identity and problem definition
- users
- goals and non-goals
- stack
- architecture
- domain/data concepts
- UI direction
- security constraints
- AI behavior
- verification expectations
- guardrails
- feature roadmap metadata

The domain model must be framework-independent.

### 4. Validation layer

Zod is mandatory for trust boundaries.

Use Zod for:

- AI structured output
- external request payloads
- imported blueprint data
- exportable blueprint structures where appropriate
- configuration loaded from untrusted or user-editable input

Avoid duplicating a Zod schema with an independently maintained TypeScript interface when the inferred Zod type is sufficient.

### 5. Generator layer

Generators convert validated structured blueprint data into deterministic artifacts.

Example:

```text
ProjectBlueprint
      |
      +--> renderProjectOverview()
      +--> renderArchitecture()
      +--> renderSchemas()
      +--> renderCodeStandards()
      +--> renderUiContext()
      +--> renderAiWorkflowRules()
      +--> renderProgressTracker()
      +--> renderAgents()
```

Generators must:

- be deterministic for equivalent validated input
- avoid calling the LLM
- avoid reading React or route state
- be testable as pure or near-pure functions
- keep output ordering stable when practical

### 6. Guardrail layer

Guardrails have at least two sources:

#### Universal guardrails

Examples:

- one active feature
- no unrelated changes
- verify before completion
- do not silently change architecture
- search existing patterns first
- deterministic work stays deterministic
- validate trust boundaries

#### Project-specific guardrails

Generated from the approved ProjectBlueprint.

Examples:

- Server Components by default
- database access only through an approved layer
- AI may classify but may not directly mutate durable state
- specific authentication or security rules

The domain should preserve whether a guardrail is universal, stack-derived, project-specific, or human-authored when useful.

## Grill Me architecture

Grill Me is not simply free-form chat.

Conceptual flow:

```text
initial idea
    |
    v
known facts
    |
    v
gap analysis
    |
    +--> enough information? ---- yes ----> blueprint proposal
    |
    no
    |
    v
focused follow-up question
    |
    v
human answer
    |
    +-----------------------------> gap analysis
```

The system should prefer questions that resolve decisions with meaningful downstream impact.

It should avoid asking the user to repeat already-known facts.

## Structured AI output

AI should produce structured data aligned with Zod schemas rather than independently authored context documents.

Preferred:

```text
AI reasoning
   ->
structured ProjectBlueprint proposal
   ->
Zod validation
   ->
human review
   ->
deterministic renderers
```

Avoid:

```text
AI writes project-overview.md
AI separately writes architecture.md
AI separately writes schemas.md
```

The second approach creates unnecessary contradiction risk.

## State in V1

No database is required.

Possible V1 state categories:

### Ephemeral interaction state

Used during the current Web session.

Examples:

- current Grill Me messages
- current draft blueprint
- review state

### Optional client persistence

Local browser persistence may be introduced if an approved feature requires refresh recovery.

It must not be treated as a substitute for a future cloud persistence architecture.

### Exported durable state

The final generated Markdown files are the primary durable output of V1.

## Server and client boundaries

Next.js Server Components are preferred by default.

Use Client Components only for browser-dependent or interactive behavior such as:

- conversational input
- local review interactions
- accordions/tabs requiring client state
- client-side export UX where justified

AI provider credentials and model calls must remain server-side.

Never expose secret provider keys to the browser.

## Security principles

At minimum:

- validate untrusted input
- never expose secrets client-side
- do not execute generated commands automatically
- do not treat AI output as trusted code
- sanitize or safely render generated content
- constrain file names and export paths
- prevent generated export paths from escaping their intended root
- do not let generated artifacts overwrite arbitrary server files
- keep Git/deployment mutations opt-in and out of V1

## Architecture changes

Major changes require an ADR.

Examples:

- adding persistence
- adding authentication
- adopting a workspace/monorepo tool
- changing the AI provider abstraction
- replacing Zod
- changing the source-of-truth domain representation
- allowing AI to directly generate final document content rather than structured data
