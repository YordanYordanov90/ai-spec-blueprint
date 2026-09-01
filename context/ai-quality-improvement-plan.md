# AI Quality Improvement Plan

## Status

Proposed implementation plan.

This document records the intended improvement sequence. It does not authorize
implementation by itself. Before code changes begin, the next feature must be
promoted into `features/current-feature.md` with bounded acceptance criteria.

## Problem statement

The current Grill Me workflow can produce structurally valid but shallow
blueprints. The observed logo-creator example exposed the following failure
modes:

- the raw project idea became the product name
- a secondary mechanism, free credits, became the only goal and feature
- the core logo-generation flow was omitted
- stated framework and authentication preferences were not represented as
  reviewed stack decisions
- architecture, domain, UI, and verification sections used generic fallback
  content
- AI was reported as out of scope even though it was central to the product idea
- an approved architecture entry retained text saying it was not human-approved
- no active feature was prepared, leaving the exported repository context unable
  to authorize implementation

These failures are primarily orchestration and synthesis problems. The configured
model is already capable of substantially better reasoning, but the current
workflow uses AI mainly for fact extraction. Deterministic code then fills much
of the blueprint with fixed fallback content.

## Objective

Make Grill Me produce a specific, internally consistent, implementation-useful
`ProjectBlueprint` by combining:

- reliable fact extraction
- adaptive gap analysis
- high-information follow-up questions
- schema-constrained AI blueprint synthesis
- explicit contradiction and quality review
- human approval
- deterministic Markdown generation
- evaluation-driven model and reasoning configuration

The target experience should feel like guided project architecture, not a short
form that happens to call a model.

## Non-goals

This plan does not authorize:

- AI-generated final Markdown documents
- replacing `ProjectBlueprint` as the source of truth
- bypassing Zod validation
- allowing AI to mark its own proposals as human-approved
- authentication, database persistence, billing, or cloud project storage
- arbitrary model-generated file paths or repository writes
- automatic implementation of the generated project
- a provider change or a second provider abstraction
- a monorepo or package restructuring
- broad prompt experimentation without repeatable evaluations

## Architectural invariants

The existing architecture remains authoritative:

1. AI produces structured analysis and proposed domain data.
2. Zod validates every AI result that may affect application state.
3. Human review controls approval of material decisions.
4. `ProjectBlueprint` remains the durable structured source of truth.
5. Deterministic TypeScript generators own document paths, headings, ordering,
   boilerplate, and Markdown assembly.
6. Blueprint Core remains independent from React, Next.js route conventions,
   browser APIs, and CLI presentation.
7. Web and CLI continue to share schemas, proposal rules, validation, and
   generators.
8. Invalid AI output fails visibly; it must not be converted into a
   valid-looking generic blueprint.

No ADR is required if implementation stays inside these existing boundaries.
An ADR is required if implementation changes how AI output becomes durable
state, changes the provider abstraction, or changes `ProjectBlueprint` as the
source-of-truth representation.

## Target workflow

```text
initial idea and conversation
          |
          v
structured fact extraction
          |
          v
adaptive coverage and contradiction analysis
          |
          +---- material gap ----> focused question ----+
          |                                             |
          +<--------------------------------------------+
          |
          v
schema-constrained ProjectBlueprint proposal
          |
          v
quality and contradiction review
          |
          +---- blocking finding ----> revise or ask user
          |
          v
human section and decision approval
          |
          v
deterministic context generation and export
```

The model must never directly generate or write the exported files.

## Quality definition

A high-quality blueprint must be:

- grounded: every confirmed decision is supported by user input or approved
  project context
- complete enough: core flows and implementation-shaping decisions are covered
  or explicitly unresolved
- specific: sections contain project-relevant content rather than reusable
  placeholder prose
- consistent: goals, stack, architecture, domain concepts, security, AI usage,
  features, and verification do not contradict one another
- uncertainty-aware: preferences, proposals, approved decisions, rejected
  options, and unresolved decisions remain distinct
- implementation-useful: the feature roadmap starts with the core user value and
  has plausible dependencies
- reviewable: the human can see what the model inferred, proposed, or left open
- deterministic after approval: identical validated blueprints render identical
  artifact content

## Proposed delivery sequence

The work should be delivered as separate active features. Each feature must be
promoted individually; later features remain informational until then.

### F051 - Establish AI quality evaluations and baseline

#### Objective

Create a repeatable way to measure discovery and blueprint quality before
changing orchestration or model configuration.

#### Scope

- add a small versioned evaluation corpus of representative project ideas and
  discovery answers
- include the logo-creator failure as a sanitized regression scenario
- record expected required facts, material questions, prohibited inventions, and
  essential blueprint content for each scenario
- implement deterministic graders where possible
- define a human-review rubric for semantic quality that deterministic checks
  cannot establish
- provide an opt-in provider-backed evaluation command that does not run during
  ordinary unit tests
- record model ID, reasoning configuration, token usage, latency, schema
  failures, retries, and grader results for evaluation runs
- capture the current implementation as the baseline before behavior changes

#### Initial evaluation scenarios

- AI logo creator with authentication and free credits
- simple local-only utility with no authentication or database
- B2B application with roles and organization isolation
- AI-assisted workflow with a mandatory human approval boundary
- existing stack preference that must not be converted into a confirmed choice
- deliberately incomplete idea requiring several material questions
- contradictory user answers that must prevent readiness

#### Initial quality dimensions

- fact recall
- unsupported-fact rate
- material-gap recall
- question relevance and information gain
- blueprint section completeness
- project specificity
- contradiction detection
- proposal/approval state correctness
- feature ordering and dependency quality
- deterministic artifact validity
- schema success rate
- end-to-end latency and token usage

#### Acceptance criteria

- the same scenario can be run repeatedly against a selected configuration
- failures identify the scenario, stage, model configuration, and failed rubric
- provider-backed evals are isolated from normal offline checks
- secrets and full provider responses are not written to fixtures or logs
- the current logo-creator output fails the appropriate quality checks
- typecheck, lint, and the new offline evaluation checks pass

### F052 - Add adaptive discovery analysis and focused questions

#### Objective

Replace the fixed five-topic stopping behavior with model-assisted, structured
coverage analysis while retaining deterministic safety gates.

#### Scope

- define a Zod-validated discovery analysis output contract
- analyze relevant project areas instead of mechanically requiring every topic
- identify new facts, missing material information, contradictions, uncertainty,
  and the single highest-value next question
- combine related unknowns only when one answer can resolve them without
  overwhelming the user
- retain deterministic minimum rules for critical state invariants
- prevent readiness while a blocking contradiction or material gap remains
- represent intentionally deferred non-blocking decisions without pretending
  they are resolved
- preserve undo, local recovery, rate limiting, and explicit AI failure behavior

#### Discovery analysis contract

The exact schema should be finalized during the feature, but it should cover:

- newly supported facts
- detected contradictions with evidence references
- material gaps with topic, reason, and blocking status
- completeness assessment by relevant area
- recommended next question and related gaps
- readiness recommendation with reasons

The model may recommend readiness. Deterministic application logic makes the
final readiness decision from validated state and required invariants.

#### Question-selection rules

- do not ask for facts already present in authoritative context
- prioritize decisions with downstream effects on scope, architecture, security,
  data, AI boundaries, UX, deployment, or verification
- ask one focused question per turn by default
- explain why the question matters
- do not ask low-value branding or implementation trivia while core flows remain
  unclear
- do not force a database, authentication, billing, or AI provider decision when
  the project can safely proceed with it unresolved

#### Acceptance criteria

- the logo-creator scenario asks about the core generation flow before declaring
  discovery complete
- relevant AI, authentication, credits, persistence, output/export, and framework
  decisions are captured or explicitly unresolved
- a simple non-AI local utility is not forced through irrelevant AI or
  authentication questions
- contradictory answers create a blocking finding
- readiness cannot be reached solely because product, users, and one MVP fact
  exist
- every model-produced state transition is schema validated
- existing local snapshot compatibility is preserved or explicitly migrated
- relevant offline checks, provider-backed evals, typecheck, lint, and build pass

### F053 - Generate the ProjectBlueprint through structured AI synthesis

#### Objective

Use the model for requirement synthesis, architectural reasoning, domain
modeling, and feature planning while keeping output schema-constrained and human
reviewed.

#### Scope

- introduce a dedicated proposal operation in the AI interaction layer
- define a proposal-specific schema that cannot claim human approval
- provide the model with the initial idea, relevant conversation, validated
  facts, unresolved gaps, and authoritative product guardrails
- generate a complete proposal aligned with `ProjectBlueprintSchema`
- normalize or reject forbidden approval fields after model output
- preserve unresolved decisions instead of fabricating certainty
- retain deterministic Markdown generation from the approved blueprint
- replace generic proposal fallbacks with explicit failures or visible unresolved
  fields where meaningful content is unavailable
- keep the existing deterministic proposal builder only as a test fixture or
  remove it when its callers have migrated and removal is within active scope

#### Synthesis expectations

The proposal should produce project-specific:

- product name, summary, problem, goals, non-goals, and success criteria
- target users and needs
- technology decisions with status, rationale, and constraints
- architecture decisions with tradeoffs and approval requirements
- domain concepts, relationships, invariants, persistence expectations, and
  sensitivity
- UI direction grounded in user answers or visibly unresolved
- AI responsibilities and approval boundaries when relevant
- security constraints
- verification strategy and risk areas
- project-specific guardrails
- a phased feature roadmap centered on the core user value
- unresolved decisions with blocking status and resolution timing

#### Acceptance criteria

- the logo-creator scenario treats logo generation as the core flow and free
  credits as a supporting mechanism
- AI usage is included when supported by the source facts
- stated framework and authentication preferences appear with correct decision
  status rather than disappearing or becoming silently confirmed
- architecture and domain sections do not contain generic fallback labels
- features are ordered by meaningful dependencies
- model output cannot set `approvedBy: "human"` or otherwise self-approve
- invalid structured output is surfaced as an AI failure
- equivalent approved blueprints still render deterministic artifacts
- Web and CLI generation continue to use the same Blueprint Core generators
- quality evals, schema checks, generator checks, typecheck, lint, and build pass

### F054 - Add blueprint quality review and corrective loop

#### Objective

Detect omissions, contradictions, generic content, and unsafe assumptions before
the human is asked to approve or export a proposal.

#### Scope

- define a Zod-validated `BlueprintQualityReport`
- run deterministic checks before semantic model review
- use a structured critic operation for issues that require semantic judgment
- cite the relevant blueprint section and source fact for every finding
- distinguish blocking errors from advisory improvements
- allow the model to propose corrections, but never apply them as approved
  changes without review
- prevent generation while blocking quality findings remain
- show findings in the existing review/readiness experience without turning it
  into a generic chat interface

#### Deterministic checks

At minimum, detect:

- proposal text that still claims it is unapproved after human approval
- placeholder names such as `Primary concept` when a domain concept is available
- missing AI configuration when confirmed facts make AI central to the product
- empty or generic architecture decisions
- goals that omit the product's core user value
- features that do not trace to a goal or core flow
- approved decisions with unresolved review metadata
- multiple active features
- blocking unresolved decisions before generation

#### Semantic review dimensions

- omissions
- contradictions
- unsupported assumptions
- architecture-to-stack consistency
- domain-to-flow consistency
- security and human-approval boundaries
- feature dependency quality
- verification coverage of material risks

#### Acceptance criteria

- the critic catches all known logo-creator regression issues
- every finding includes severity, section, explanation, and evidence
- blocking findings prevent approval/export readiness
- proposed corrections remain proposed until reviewed by the human
- rejection or retry does not corrupt the last valid blueprint
- provider failures remain visible and recoverable
- accessibility and keyboard behavior of the review UI are preserved
- quality evals, review checks, typecheck, lint, and build pass

### F055 - Add evaluation-driven model roles and reasoning configuration

#### Objective

Optimize quality, latency, and cost per AI operation after the improved workflow
has measurable evaluations.

#### Scope

- extend centralized model configuration with operation roles
- support separate configuration for extraction, discovery analysis, synthesis,
  and critique without scattering model IDs through domain code
- preserve `OPENAI_MODEL` as a documented compatibility fallback where practical
- configure reasoning effort intentionally per operation
- configure operation-specific output limits rather than one global limit
- compare candidate configurations using the F051 evaluation corpus
- choose defaults only from measured results
- document production and local environment variables without committing secrets

#### Starting hypothesis to evaluate

- extraction: `gpt-5.6-terra`, low or medium effort
- adaptive analysis/questions: `gpt-5.6-terra`, medium effort
- blueprint synthesis: compare `gpt-5.6-terra` high with `gpt-5.6-sol` medium or
  high
- quality critique: compare `gpt-5.6-terra` high with `gpt-5.6-sol` high

This is an evaluation matrix, not an approved hardcoded routing decision.

#### Acceptance criteria

- model and reasoning settings are centralized and schema validated
- domain and deterministic generator modules contain no model identifiers
- each operation has a documented output budget appropriate to its schema
- chosen defaults outperform the F051 baseline on quality without an
  unexplained latency or cost regression
- a flagship model is used only where evaluations show a meaningful gain
- configuration errors fail clearly without exposing provider secrets
- model configuration checks, provider-backed evals, typecheck, lint, and build
  pass

## Prompt design guidelines

Prompts introduced by these features should:

- state the outcome and success criteria
- identify authoritative inputs and their precedence
- define the model's role for that operation only
- use Structured Outputs rather than repeating the full JSON shape in prose
- require evidence for inferred facts and critic findings
- require uncertainty to remain unresolved instead of guessed
- state that the model cannot grant human approval
- keep stable instructions before dynamic project context to support caching
- include only context relevant to the operation
- avoid repeated instructions, unnecessary examples, and requests to reveal
  chain-of-thought
- define explicit failure behavior when the available evidence is insufficient

## State and compatibility considerations

- Prefer reusing existing `DiscoveryState` fields when their semantics remain
  correct.
- Add new persisted fields only when they materially improve product behavior.
- Any `DiscoveryState` or local workspace envelope change must account for old
  browser snapshots and safe partial recovery.
- Avoid changing `ProjectBlueprint` schema version unless the exported contract
  truly changes.
- A quality report should remain review/application state unless there is a
  demonstrated need to make it part of the durable exported blueprint.
- Imported schema version `1.0` packages must continue to receive explicit,
  tested compatibility behavior.

## Failure behavior

Each AI stage must distinguish:

- invalid user input
- provider or model failure
- invalid structured output
- application invariant failure
- context or output budget exhaustion
- rate-limit or abuse-protection rejection
- quality-gate failure

The application must keep the last valid state and offer a safe retry. It must
not silently substitute generic architecture or approved-looking placeholder
content.

## Security and privacy

- keep provider calls and credentials server-side
- preserve the existing deployment-trusted rate-limit boundary
- send only the smallest sufficient discovery context
- never include secrets in model prompts or evaluation fixtures
- treat every structured model response as untrusted until validated
- do not execute commands, URLs, or file paths suggested by model output
- do not persist raw reasoning traces
- ensure evaluation logs exclude API keys and sensitive user content

## Rollout strategy

1. Capture the current baseline with F051.
2. Release adaptive discovery behind a development-only configuration switch.
3. Compare old and new behavior on the same evaluation scenarios.
4. Add structured synthesis after discovery quality meets its threshold.
5. Add the critic and block export only after false-positive behavior is
   understood.
6. Select model roles from measured quality, latency, and cost results.
7. Remove legacy fixed fallbacks only after regression coverage exists and the
   new path is stable.

No database-backed telemetry or user tracking is required for this rollout.

## Verification checklist for every feature

- active feature acceptance criteria verified
- relevant existing `.check.ts` suites run
- new deterministic checks run offline
- provider-backed evals run when the feature changes AI behavior
- TypeScript typecheck passes
- lint passes
- production build passes when Web or server behavior changes
- generated artifact determinism remains verified
- Web/CLI Blueprint Core boundary remains intact
- changed files inspected for approval-state, schema, and security violations
- progress tracker and active feature state updated at handoff

## Success criteria for the complete plan

The plan is successful when:

1. A short but meaningful idea produces adaptive questions about its actual
   architecture risks and core flows.
2. The logo-creator regression scenario results in a blueprint centered on logo
   generation rather than credits.
3. Project-specific architecture, domain, AI, UI, security, verification, and
   feature content replaces generic fallbacks.
4. Unsupported assumptions remain proposed or unresolved.
5. Contradictions prevent readiness and are explained to the user.
6. AI cannot approve its own decisions.
7. Approved structured blueprints continue to render deterministic context
   artifacts.
8. Quality, latency, cost, and schema reliability are measurable across model
   configurations.
9. The selected model configuration is justified by evaluations rather than
   model size alone.

## Recommended first implementation step

Promote F051 into `features/current-feature.md` and refine its fixture format,
offline graders, opt-in provider runner, and verification commands before
changing production AI behavior.

## Official OpenAI references

The implementation should re-check current official documentation when each AI
feature is activated because model and API behavior may evolve:

- [GPT-5.6 model guidance](https://developers.openai.com/api/docs/guides/latest-model)
- [OpenAI model catalog](https://developers.openai.com/api/docs/models)
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

Current guidance supports using Structured Outputs, setting reasoning effort
intentionally, keeping prompts focused, and comparing model configurations on
representative evaluations instead of assuming the largest model is always the
best tradeoff.
