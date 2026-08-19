import type { GuardrailTopic } from "./types";

export const foundationTopics = [
  {
    number: 1,
    slug: "why-architectural-guardrails-matter",
    title: "Why architectural guardrails matter",
    shortTitle: "Why guardrails matter",
    category: "foundations",
    applicability: "universal",
    summary: "A guardrail turns an important design expectation into something a project can repeatedly check.",
    definition:
      "Architectural guardrails are explicit boundaries around how a system is shaped, changed, and verified. They do not try to predict every implementation; they protect the decisions whose failure would create expensive drift.",
    prevents: [
      "A coding agent inferring a different architecture from a short task description.",
      "Security, scope, and ownership decisions disappearing between sessions.",
    ],
    appliesWhen: [
      "A decision affects multiple features or contributors.",
      "A mistake would be costly to discover after implementation.",
    ],
    avoidWhen: [
      "The rule only restates an obvious local coding convention.",
      "The proposed restriction has no identifiable failure mode.",
    ],
    sourceConcept:
      "The source material frames guardrails as a cooperating set of constraints that makes agent-assisted work safer and more repeatable.",
    productAdaptation:
      "AI Spec Blueprint records the rule, its rationale, applicability, and enforcement path so a human can review the boundary before it becomes durable context.",
    example: {
      label: "A scoped feature",
      description:
        "The active feature names the only slice being implemented, while the progress tracker records what remains intentionally outside the current change.",
      code: "current feature → implement\nbacklog → defer",
    },
    relatedSlugs: ["the-cooperating-guardrail-stack", "enforcement-beyond-prompts", "the-define-implement-tighten-workflow"],
  },
  {
    number: 2,
    slug: "human-as-architect-and-director",
    title: "The human as architect and director",
    shortTitle: "Human direction",
    category: "foundations",
    applicability: "universal",
    summary: "The person responsible for the product remains responsible for approving its important tradeoffs.",
    definition:
      "A coding agent can explore options and produce implementation work, but it does not own product intent. Human direction means important scope, architecture, security, and approval boundaries are reviewed by the person accountable for the outcome.",
    prevents: [
      "A plausible model suggestion becoming an accidental product decision.",
      "Fast implementation masking an unresolved tradeoff.",
    ],
    appliesWhen: [
      "A choice changes trust boundaries, data handling, or user-facing behavior.",
      "Several reasonable options carry different long-term costs.",
    ],
    avoidWhen: [
      "A deterministic formatting or refactoring choice has no material design impact.",
      "Review is used as a reason to manually approve every generated line.",
    ],
    sourceConcept:
      "The source concept assigns direction and final responsibility to the human while treating the agent as a capable collaborator.",
    productAdaptation:
      "The product distinguishes facts, proposals, approved decisions, and unresolved decisions instead of flattening them into one AI-authored answer.",
    example: {
      label: "An unresolved identity choice",
      description:
        "Grill Me can surface that authentication is still open; it must not silently turn a suggested provider into a confirmed requirement.",
      code: "status: unresolved\nowner: human review",
    },
    relatedSlugs: ["why-architectural-guardrails-matter", "intentional-gaps-and-controlled-incompleteness", "git-control-and-human-review"],
  },
  {
    number: 3,
    slug: "preparing-the-coding-agent-environment",
    title: "Preparing the coding-agent environment",
    shortTitle: "Prepare the environment",
    category: "foundations",
    applicability: "universal",
    summary: "An agent works more reliably when the repository explains its boundaries before a feature prompt arrives.",
    definition:
      "Environment preparation is the deliberate assembly of project context: architecture, conventions, active scope, verification commands, and durable decisions. It gives the agent a map before asking it to navigate.",
    prevents: [
      "Repeated rediscovery of the same project constraints.",
      "Implementation beginning before the repository's source of truth is known.",
    ],
    appliesWhen: [
      "A project uses an agent across multiple sessions.",
      "The repository contains conventions that are not obvious from its file tree.",
    ],
    avoidWhen: [
      "The context package becomes an unmaintained dump of every historical detail.",
      "A prompt contains sensitive information that does not help the requested task.",
    ],
    sourceConcept:
      "The source material emphasizes preparing a project environment so the agent can operate within intended constraints.",
    productAdaptation:
      "AI Spec Blueprint turns approved discovery into a reviewable context package and keeps the active feature specification separate from the roadmap.",
    example: {
      label: "Context before code",
      description:
        "A new implementation session receives the project overview, architecture, standards, and current feature before it searches for a component to change.",
      code: "AGENTS.md + context/ + features/current-feature.md",
    },
    relatedSlugs: ["compact-agents-md-as-a-project-map", "session-limits-and-durable-repository-memory", "prompting-after-guardrails-exist"],
  },
  {
    number: 4,
    slug: "the-cooperating-guardrail-stack",
    title: "The cooperating guardrail stack",
    shortTitle: "The guardrail stack",
    category: "foundations",
    applicability: "context-dependent",
    summary: "Reliable boundaries are usually reinforced by several layers rather than one instruction.",
    definition:
      "A guardrail stack combines complementary controls: types, schemas, module boundaries, tests, runtime checks, repository context, and human review. Each layer catches a different class of failure.",
    prevents: [
      "Treating a prompt as the only enforcement mechanism.",
      "Assuming one tool can express every architecture rule.",
    ],
    appliesWhen: [
      "A rule matters enough to survive changes in model behavior or contributors.",
      "A boundary can be represented at more than one useful layer.",
    ],
    avoidWhen: [
      "Adding duplicate checks that create noise without catching new failures.",
      "Applying a database or runtime control to a project that has no such boundary.",
    ],
    sourceConcept:
      "The source concept presents guardrails as cooperating layers whose combined effect is stronger than a single policy statement.",
    productAdaptation:
      "The product describes how a project-specific rule is enforced and leaves conditional controls out until the blueprint establishes their need.",
    example: {
      label: "Validated AI output",
      description:
        "A structured model response is constrained by a Zod schema, reviewed as a proposal, then rendered by deterministic TypeScript.",
      code: "model → schema → review → renderer",
    },
    relatedSlugs: ["strict-typescript-as-compile-time-enforcement", "enforcement-beyond-prompts", "the-define-implement-tighten-workflow"],
  },
] satisfies readonly GuardrailTopic[];
