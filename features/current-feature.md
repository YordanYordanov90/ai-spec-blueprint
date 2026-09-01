# Current Feature

## No active feature

Status: ready for planning. B001 - Resolve reported production regressions is
the most recently completed feature.

See `features/backlog.md` for planned work.

## Most recently completed feature

### B001 - Resolve reported production regressions

- Status: complete
- Phase: Production bug fixes
- Surface: Blueprint Core / Web discovery shell

### Objective

Resolve the reported high-, medium-, and low-severity regressions without
changing the approved product architecture or adding persistence/authentication.

### Acceptance criteria

- Repeated or colliding model fact IDs are merged deterministically without
  producing an invalid-structured-output failure.
- A first-user answer classified as `user-roles` clears the Users completeness
  gap and allows discovery to advance.
- Unknown routes render a branded 404 with home and start-project navigation.
- Empty initial-idea submission shows inline accessible validation without the
  browser's native validation bubble covering the submit action.
- The favicon remains a valid PNG favicon at a small size.
- Add focused regression checks for each changed behavior.
- Typecheck, lint, focused checks, and production build pass.

### Out of scope

- Adaptive discovery analysis from the AI quality improvement plan.
- Provider/model changes, authentication, persistence, or database work.

## Previous completed feature

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
