# F011 - Generate Progress Tracker

## Status

Ready after F010.

## Objective

Render `context/progress-tracker.md` from a validated `ProjectBlueprint` using the shared generator contract.

The document must reflect recorded feature status and unresolved decisions without inventing project progress that the blueprint does not contain.

## Why this feature is next

The core context documents from overview through AI workflow rules now have deterministic renderers. Progress tracker is the next durable status document before `AGENTS.md` and full package composition.

## In scope

- a framework-independent progress tracker generator
- Markdown output for `context/progress-tracker.md`
- mapping validated features, unresolved decisions, and related blueprint status into a stable document shape
- returning a validated `GeneratedArtifact` through the shared generator contract

## Out of scope

Do not implement:

- `AGENTS.md` generation
- complete context package composition
- filesystem writes or downloads
- export packaging
- Web UI
- AI calls
- CLI behavior
- persistence or authentication

## Architectural constraints

- Use the F004 generator contract. Do not introduce a second generation API.
- The renderer must not import React, Next.js route code, browser APIs, or provider clients.
- The renderer must not call an LLM.
- Equivalent validated input must produce stable path, section order, and content.
- Untrusted paths must still be validated through `GeneratedArtifactSchema`.
- Render only facts present in the validated blueprint. Do not invent completed work or hide unresolved decisions.

## Acceptance criteria

- A progress tracker generator exists in the framework-independent Blueprint Core.
- It accepts validated `ProjectBlueprint` data and returns a validated `context/progress-tracker.md` artifact.
- The generated document includes feature IDs, titles, phases, statuses, and unresolved decisions from the blueprint.
- Equivalent input produces identical artifact path and content.
- No other new context document generator is implemented in this feature.

## Verification

Use the scaffolded project's actual commands:

- TypeScript/typecheck
- lint
- focused generator checks for the contract and already completed renderers
- focused progress tracker generator checks

Do not add a large testing stack solely for this feature.
