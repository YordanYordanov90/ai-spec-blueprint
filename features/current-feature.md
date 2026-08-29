# Current Feature

## No active feature

Status: ready for planning

F051 is complete. Do not begin F052 until it is promoted from the quality
improvement plan into this file with bounded acceptance criteria.

## Most recently completed feature

### F051 - Establish AI quality evaluations and baseline

- Status: complete
- Phase: AI quality improvement
- Surface: Blueprint Core / AI evaluation tooling

### Objective

Created a repeatable, offline-first evaluation harness for Grill Me discovery
and blueprint quality before changing production AI orchestration or model
configuration.

### Scope

- Add a small versioned corpus of sanitized project ideas and discovery facts.
- Include the AI logo-creator regression scenario and six representative cases.
- Define expected facts, material gaps, prohibited assumptions, and essential
  blueprint content for each scenario.
- Implement deterministic graders for the current discovery/proposal path.
- Add a human-review rubric for semantic quality that offline graders cannot
  establish.
- Add a separate opt-in provider-backed runner that records model and run
  metrics without persisting raw provider responses.
- Capture the current implementation as a checked-in baseline report.

### Delivered

- The same corpus can be run repeatedly with `npm run eval:offline`.
- Offline failures identify the scenario, stage, and failed rubric.
- Provider-backed evaluation is isolated from ordinary checks and requires an
  explicit opt-in environment flag.
- Evaluation output contains model ID, reasoning configuration, token usage
  fields, latency, schema failures, retries, and grader results.
- Fixtures and reports contain no API keys, raw provider responses, or raw
  reasoning traces.
- The logo-creator baseline fails checks for core-flow coverage, AI coverage,
  project-specific synthesis, and preference preservation.
- A human rubric is documented separately from deterministic checks.
- Typecheck, lint, focused checks, and offline evaluation checks pass.

### Out of scope

- Changing production discovery behavior.
- Adding adaptive analysis, AI synthesis, or quality blocking to the product.
- Changing the ProjectBlueprint schema version.
- Authentication, persistence, telemetry, or a second provider.

## Verification

- `npm run check:ai-evaluations`
- `npm run eval:offline`
- `npm run check:ai-model-config`
- `npm run check:fact-extraction`
- `npm run check:blueprint-proposal`
- `npm run check:missing-information`
- TypeScript typecheck
- lint
- `npm run build -- --webpack`
