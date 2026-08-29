# AI Quality Evaluation Baseline

Captured from the current deterministic discovery and proposal implementation
before the F052–F055 behavior changes. Corpus version: `1`.

Command: `npm run eval:offline`

Provider: `deterministic`  
Model configuration: `current-deterministic-proposal`  
Reasoning configuration: `not-applicable`

All seven scenarios fail at least one quality rubric, which is expected for the
baseline. The harness records the failure rather than hiding it behind a
passing process exit code.

| Scenario | Proposal | Baseline failure signals |
| --- | ---: | --- |
| `ai-logo-creator` | yes | missing AI section, missing Next.js/Clerk preference decisions, missing project-specific domain/feature content, generic fallbacks, stale approval language |
| `local-timer` | yes | generic fallbacks and weak core-flow synthesis |
| `b2b-workspace` | yes | roles are absent from the domain proposal, generic fallbacks, stale approval language |
| `human-approved-ai-workflow` | yes | missing AI and human-approval content, generic fallbacks, stale approval language |
| `unconfirmed-stack-preferences` | yes | preferences disappear instead of remaining reviewable, generic fallbacks, stale approval language |
| `incomplete-idea` | no | fixed analysis misses the core-flow material gap |
| `contradictory-answers` | yes | contradictions do not block readiness, generic fallbacks, stale approval language |

Offline metrics intentionally report zero latency and unavailable token usage;
provider-backed runs populate those fields when the configured model exposes
usage metadata. No provider response or reasoning trace is stored in this
baseline.
