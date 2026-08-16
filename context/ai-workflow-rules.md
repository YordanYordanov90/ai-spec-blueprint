# AI Workflow Rules

## Purpose

These rules define how AI should participate in both:

1. building this repository
2. operating inside the finished product

The two concerns must not be confused.

## Repository development workflow

### Read before writing

Before implementing a feature:

1. read repository context
2. read the active feature
3. inspect relevant code
4. identify established patterns
5. implement the smallest compliant change

### One feature at a time

The roadmap is informational.

Only `features/current-feature.md` authorizes implementation scope.

Do not implement future Web or CLI capabilities early.

### Human review gates

Human approval is required for:

- architecture changes
- new major dependencies
- persistence
- authentication
- workspace/monorepo restructuring
- replacing an established technology
- destructive changes
- broad refactors

### Stop after repeated failure

After 2 to 3 materially similar failed attempts, stop and reassess.

Do not keep layering fixes onto a misunderstood architecture.

## Product AI responsibilities

AI may:

- interpret a project idea
- extract known facts
- identify missing information
- ask targeted follow-up questions
- explain tradeoffs
- propose architecture
- propose guardrails
- propose features
- produce structured blueprint data
- identify contradictions or unresolved decisions

AI must not:

- silently make high-impact product decisions
- convert preferences into confirmed requirements without review
- invent persistence/auth requirements
- directly execute generated project commands
- directly modify a user's external repository in V1
- bypass schema validation
- treat its own prior answer as more authoritative than approved blueprint state

## Grill Me behavior

Grill Me should optimize for information gain, not number of questions.

Before asking a question, determine:

1. is the answer already known?
2. can it be safely inferred from approved context?
3. does this question materially affect product scope, architecture, security, data, UX, or implementation?
4. can multiple tightly related unknowns be resolved together without overwhelming the user?

Good questions resolve important ambiguity.

Bad questions collect trivia.

## Question categories

Potential categories include:

- product problem
- users
- MVP scope
- non-goals
- user roles
- core flows
- data/domain concepts
- persistence
- authentication
- integrations
- security/privacy
- AI responsibilities
- human approval boundaries
- deployment
- UI direction
- testing
- operational constraints

Do not mechanically ask every category for every project.

## Facts, proposals, and decisions

The system should distinguish:

### Fact

Information explicitly provided or reliably detected.

### Proposal

A model recommendation awaiting review.

### Approved decision

A human-approved choice that may be rendered into durable context.

### Unresolved decision

A question intentionally left open.

Do not collapse these states into one.

## Architecture proposals

When proposing architecture:

- explain the decision at the level required for review
- avoid unnecessary technology choices
- respect the stated stack
- call out meaningful tradeoffs
- avoid speculative infrastructure
- distinguish current V1 needs from likely future needs

## Structured output

AI should return structured data validated by Zod.

The preferred flow is:

```text
AI -> structured output -> validation -> review -> ProjectBlueprint
```

not:

```text
AI -> seven unrelated Markdown documents
```

## Deterministic rendering

Once a ProjectBlueprint is approved, the document generator is responsible for rendering known Markdown formats.

The generator, not the model, owns:

- headings
- file paths
- repeated boilerplate
- context-file ordering
- stable standard sections
- deterministic guardrail formatting

AI-generated prose may be included as validated structured fields when needed, but document assembly stays deterministic.

## Model strategy

The exact OpenAI model is intentionally unresolved.

Model selection must be configurable.

Do not couple domain behavior to one hardcoded model name.

A later architecture decision may introduce different models for:

- discovery
- architecture reasoning
- feature planning

V1 may use one model for simplicity.

## Prompt rules

Prompts should:

- define the task clearly
- include only relevant context
- identify what is authoritative
- specify expected structured output
- tell the model how to represent uncertainty
- avoid unnecessary repository-wide context dumps

## Context minimization

Implementation agents should receive the smallest sufficient authoritative context.

For feature implementation this usually means:

- `AGENTS.md`
- project overview
- architecture
- active feature
- relevant schemas/standards
- relevant ADRs
- relevant code/tests

Do not load unrelated historical material by default.

## Security

Treat model output as untrusted until validated.

Never:

- execute model-generated shell commands automatically
- trust generated file paths without validation
- expose secrets in prompts unnecessarily
- allow generated artifacts to write outside intended export boundaries

## Completion behavior

A feature is not complete because code exists.

Completion requires:

- acceptance criteria checked
- required verification run
- architecture reviewed
- project state updated
- unresolved issues stated clearly
