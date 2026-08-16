# Schemas and Domain Model

## Purpose

This document defines the conceptual domain model.

The implementation source of truth will be Zod schemas in code once F001 is implemented.

This document should describe meaning and invariants, not duplicate every implementation detail forever.

## Central aggregate

The central domain object is `ProjectBlueprint`.

Conceptually:

```text
ProjectBlueprint
├── metadata
├── product
├── users
├── goals
├── nonGoals
├── stack
├── architecture
├── domain
├── ui
├── ai
├── security
├── verification
├── guardrails
├── features
└── unresolvedDecisions
```

## ProjectBlueprint

A ProjectBlueprint represents the approved structured understanding of one software project.

Minimum characteristics:

- schema version
- project name or working title
- concise description
- problem statement
- target users
- goals
- non-goals
- selected or proposed technologies
- architecture decisions
- important domain entities/concepts
- UI direction
- AI usage rules when AI is part of the target project
- security constraints
- verification strategy
- project guardrails
- initial feature roadmap
- unresolved decisions

## Metadata

Suggested concepts:

- `schemaVersion`
- `createdAt` if useful for exported metadata
- `updatedAt` if useful
- generator version in the future

Do not make timestamps required unless they materially help the workflow.

## Product definition

Suggested fields:

- `name`
- `summary`
- `problem`
- `targetUsers`
- `goals`
- `nonGoals`
- `successCriteria`

All important collections should have sensible minimum constraints.

Empty placeholder arrays should not silently pass if the product requires meaningful content.

## Stack definition

The stack should distinguish decision status.

A technology can be:

- confirmed
- preferred-if-needed
- unresolved
- rejected

This is important because "Drizzle if persistence is later needed" must not be interpreted as "install Drizzle now."

Possible conceptual shape:

```text
TechnologyDecision
├── category
├── choice
├── status
├── rationale
└── constraints
```

## Architecture decision

Architecture entries should express more than a technology name.

Suggested concepts:

- title
- decision
- rationale
- constraints
- status
- related areas
- requiresADR

Example:

```text
title: Shared Blueprint Core
decision: Web and CLI consume the same framework-independent domain and generation logic.
status: approved
```

## Domain concepts

The target project being generated may have its own entities.

Do not assume every project has a database.

Use a neutral concept such as `DomainConcept` or `DomainEntityDefinition`.

Possible fields:

- name
- purpose
- attributes
- relationships
- invariants
- persistence expectation
- sensitivity classification

The schema must allow purely conceptual or in-memory entities.

## UI definition

Suggested concepts:

- product personality
- visual direction
- layout principles
- navigation model
- responsive behavior
- accessibility requirements
- component strategy
- unresolved branding choices

Do not force color values when the user has not approved them.

## AI configuration in generated projects

Because this product can generate context for AI and non-AI applications, AI should be optional in generated project blueprints.

If AI exists, capture:

- purpose
- allowed responsibilities
- prohibited responsibilities
- provider/model constraints when known
- output validation
- fallback/error expectations
- human approval boundaries

## Guardrail

Conceptual model:

```text
Guardrail
├── id
├── title
├── rule
├── category
├── source
├── severity
└── rationale
```

Potential categories:

- architecture
- scope
- security
- data
- AI
- UI
- testing
- workflow
- dependency
- Git

Potential sources:

- universal
- stack-profile
- project-specific
- human-authored

Potential severity:

- required
- strong-preference
- advisory

Avoid overcomplicating this schema during F001. Add fields only when they serve current product behavior.

## Feature definition

A backlog feature should support:

- stable feature ID
- title
- objective
- phase
- status
- dependencies
- short scope summary

The full active feature specification belongs in `features/current-feature.md` or an equivalent generated artifact, not entirely inside the high-level blueprint object.

## Unresolved decision

Not every discovery question must be forced into a premature answer.

The blueprint should support unresolved decisions.

Suggested concepts:

- question
- whyItMatters
- options considered
- blocking status
- recommended resolution point

This prevents the model from inventing certainty.

## Grill Me state

The conversation itself is not the durable domain model.

Temporary discovery state may contain:

- messages
- extracted facts
- missing information
- current question
- draft decisions
- completeness state

Durable generation must use a validated blueprint, not raw conversation text.

## Zod requirements

When implementation begins:

- Zod is the canonical runtime validation system.
- Prefer `z.infer` for TypeScript types derived from schemas.
- Use `.strict()` where rejecting unknown fields improves safety.
- Use discriminated unions when decision/status types genuinely benefit.
- Add semantic refinements only where the invariant cannot be represented structurally.
- Keep schemas readable and composable.
- Avoid a single unmaintainable mega-schema file.

## Initial F001 boundary

F001 should define only the minimum coherent schema set required for `ProjectBlueprint`.

Do not implement:

- Markdown renderers
- AI calls
- Grill Me
- export
- CLI
- persistence
- authentication

Those belong to later features.
