# AI Quality Human-Review Rubric

This rubric complements the deterministic F051 evaluation checks. It is for
reviewers comparing a scenario's source idea, answers, structured output, and
evaluation report. It must not be used to silently edit fixtures or approve
unsupported assumptions.

Score each dimension from 0 to 2:

- `0` — missing, contradictory, or materially unsafe.
- `1` — partly useful but shallow, ambiguous, or requiring substantial repair.
- `2` — specific, grounded, internally consistent, and implementation-useful.

## Dimensions

### Fact grounding

Does the output preserve explicit user facts and distinguish detected facts from
preferences or proposals? A preference must not become a confirmed decision.

### Material coverage

Does discovery cover the decisions that change scope, architecture, security,
data, AI boundaries, UX, deployment, or verification? Do not penalize a project
for leaving low-impact details unresolved.

### Question information gain

Does each follow-up question resolve a material uncertainty without asking for
facts already present or overwhelming the user with unrelated topics?

### Project specificity

Are product, architecture, domain, UI, security, verification, and feature
sections grounded in this project rather than generic fallback prose?

### Internal consistency

Do goals, core flows, stack, architecture, domain concepts, security rules,
AI responsibilities, features, and verification describe the same product?

### Uncertainty and approval state

Are proposed, approved, rejected, and unresolved decisions represented
correctly? The model must not self-approve a decision or imply that a human
approved an unreviewed proposal.

### Feature usefulness

Does the first feature represent the core user value, with sensible phase and
dependency ordering? Supporting mechanisms such as credits must not replace the
primary workflow.

### Safety and privacy

Are unsupported authentication, persistence, billing, provider, or security
requirements avoided? Does the result omit secrets and raw reasoning traces?

### Verification quality

Does the verification strategy cover the material risks introduced by the
project's flows, data, security, and AI boundaries?

## Reviewer record

For each scenario, record the score, one sentence of evidence, and any blocking
finding. A blocking finding is appropriate when the output would cause an
implementation agent to build the wrong core flow, silently adopt an
unapproved material decision, miss a contradiction, or violate a security or
human-approval boundary.

Do not record full provider responses, API keys, or private user content in the
repository. Keep only sanitized evidence and aggregate metrics.
