# F002 - Define Guardrail and Decision Domain Structures

## Status

Ready after F001.

## Objective

Refine the domain structures that represent proposals, approved decisions, unresolved decisions, and project guardrails.

This feature makes human review state explicit before AI discovery and deterministic generation depend on it.

## Why this feature is next

F001 established the central `ProjectBlueprint` shape and the minimum nested records. The next dependency is a clear, reusable way to preserve whether a technology or architecture choice is proposed, approved, unresolved, or rejected, alongside the origin and severity of each guardrail.

## In scope

- reviewable decision status structures
- reusable decision metadata where it improves consistency
- guardrail categories, sources, severity, and rationale
- validation rules for decision and guardrail records
- representative valid and invalid samples for the new invariants

## Out of scope

Do not implement:

- Markdown generators
- Grill Me logic
- Vercel AI SDK or OpenAI calls
- Web review UI
- persistence or authentication
- CLI behavior
- generated artifact models
- changes to the approved shared-core architecture

## Architectural constraints

- Schemas must remain framework-independent.
- Zod remains the runtime source of truth.
- Human approval must be distinguishable from an AI proposal.
- Unresolved decisions must not be silently treated as approved decisions.
- Universal and project-specific guardrails must remain distinguishable.
- Do not add speculative workflow or persistence state.

## Acceptance criteria

- Decision status semantics are explicit and reusable where appropriate.
- Approved, proposed, unresolved, and rejected states remain distinguishable.
- Guardrails preserve category, source, severity, rule, and rationale.
- Invalid decision and guardrail shapes fail runtime validation.
- Existing valid `ProjectBlueprint` examples continue to parse.
- No UI, AI call, generator, CLI, persistence, or authentication behavior is introduced.

## Verification

Use the scaffolded project's actual commands:

- TypeScript/typecheck
- lint
- focused schema validation checks

Do not add a large testing stack solely for this feature.
