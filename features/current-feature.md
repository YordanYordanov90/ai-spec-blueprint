# F016 - Implement Project Fact Extraction

## Status

Ready after F015.

## Objective

Extract approved or explicit project facts from Grill Me input into the `DiscoveryState` fact model.

## Why this feature is next

Discovery state now exists. Fact extraction is the first AI discovery behavior that populates that state without asking the user to repeat known information.

## In scope

- extract explicit facts from project input into validated `ExtractedFact` records
- distinguish explicit user-provided facts from inferred detections
- keep extracted facts inside discovery state rather than writing a `ProjectBlueprint`

## Out of scope

Do not implement:

- missing-information analysis
- follow-up question generation
- structured blueprint proposal generation
- Web UI
- CLI behavior
- persistence or authentication

## Architectural constraints

- Use the centralized AI model configuration from F014.
- Validate model output with Zod before it becomes discovery state.
- Do not treat extracted facts as approved blueprint decisions.
- Do not call an LLM from deterministic generators.

## Acceptance criteria

- Project input can be reduced to validated extracted facts in discovery state.
- Facts keep an explicit or detected source.
- Invalid model output is not silently converted into facts.
- Gap analysis and question generation remain later features.

## Verification

Use the scaffolded project's actual commands:

- TypeScript/typecheck
- lint
- focused fact-extraction checks
- existing discovery-state and AI configuration checks

Do not add a large testing stack solely for this feature.
