import type { GuardrailTopic } from "./types";

export const verificationTopics = [
  {
    number: 21,
    slug: "reuse-first-and-red-green-prompting",
    title: "Reuse-first and red-green prompting",
    shortTitle: "Reuse-first prompting",
    category: "verification",
    applicability: "context-dependent",
    summary: "Ask the agent to inspect and prove behavior in small loops instead of accepting a large unverified rewrite.",
    definition:
      "Reuse-first prompting asks for existing patterns before new abstractions. Red-green prompting asks for a failing or focused check, the smallest implementation, and a passing result. Together they create a tight feedback loop around change.",
    prevents: [
      "Large speculative patches that are difficult to review.",
      "New code passing a superficial read while violating a nearby contract.",
    ],
    appliesWhen: [
      "The repository has runnable checks or a behavior that can be isolated.",
      "The change benefits from incremental review.",
    ],
    avoidWhen: [
      "A throwaway exploration is being mistaken for production implementation.",
      "A test is added only to mirror the current implementation rather than protect behavior.",
    ],
    sourceConcept:
      "The source material connects reuse-first investigation with small test-guided implementation loops.",
    productAdaptation:
      "The repository favors focused checks for generators, boundaries, and UI behavior, and asks the implementation agent to preserve existing patterns before adding abstractions.",
    example: {
      label: "Catalog invariants",
      description:
        "The docs check asserts 24 topics, unique links, valid relations, and required content before the route work is considered complete.",
      code: "check fails → fix catalog → check passes",
    },
    relatedSlugs: ["pattern-recognition-before-invention", "search-before-invention", "the-define-implement-tighten-workflow"],
  },
  {
    number: 22,
    slug: "git-control-and-human-review",
    title: "Git control and human review",
    shortTitle: "Git control",
    category: "verification",
    applicability: "universal",
    summary: "Version control gives humans a reviewable boundary around agent-produced change.",
    definition:
      "Git control means keeping changes inspectable, scoped, and reversible through ordinary repository review. Human review is the decision point where a proposed implementation becomes an accepted project change.",
    prevents: [
      "A generated patch becoming difficult to compare with the requested feature.",
      "Unreviewed architecture or destructive changes entering the main line.",
    ],
    appliesWhen: [
      "An agent is modifying a tracked repository.",
      "A change affects public behavior, architecture, or durable context.",
    ],
    avoidWhen: [
      "Treating a branch as a substitute for tests or understanding the diff.",
      "Using automated Git operations when the product has not approved that side effect.",
    ],
    sourceConcept:
      "The source concept keeps the human in control of the repository boundary through versioned, reviewable changes.",
    productAdaptation:
      "AI Spec Blueprint does not perform automatic Git or external repository mutations in V1; implementation work remains on an explicitly reviewed feature branch.",
    example: {
      label: "Feature branch review",
      description:
        "F038 is implemented on a dedicated branch, where the catalog, routes, components, and checks can be inspected before integration.",
      code: "feature branch → diff → human review",
    },
    relatedSlugs: ["human-as-architect-and-director", "session-limits-and-durable-repository-memory", "the-define-implement-tighten-workflow"],
  },
  {
    number: 23,
    slug: "the-define-implement-tighten-workflow",
    title: "The define, implement, and tighten workflow",
    shortTitle: "Define, implement, tighten",
    category: "verification",
    applicability: "universal",
    summary: "A project becomes safer through a loop that turns decisions into code, then feeds observed failures back into the boundary.",
    definition:
      "Define the intended boundary, implement the smallest useful behavior, and tighten the system when verification or review exposes a gap. Tightening may mean a test, a clearer rule, a better local pattern, or a revised approved decision.",
    prevents: [
      "Assuming the first written policy is complete forever.",
      "Fixing repeated failures locally without improving the project boundary that allowed them.",
    ],
    appliesWhen: [
      "A feature produces concrete feedback from tests, review, or runtime behavior.",
      "The project can distinguish a local bug from a reusable architectural lesson.",
    ],
    avoidWhen: [
      "Changing a durable rule solely because one implementation was misunderstood.",
      "Using tightening as permission for unreviewed scope expansion.",
    ],
    sourceConcept:
      "The source material describes guardrails as an evolving practice: define the boundary, build within it, and improve it from evidence.",
    productAdaptation:
      "The product makes this loop explicit in feature acceptance and progress tracking while keeping architecture changes subject to human review.",
    example: {
      label: "A docs accessibility fix",
      description:
        "If a review finds that the mobile topic navigation lacks a visible focus state, the fix can become both code and a reusable accessibility check.",
      code: "review finding → implementation fix → regression check",
    },
    relatedSlugs: ["enforcement-beyond-prompts", "reuse-first-and-red-green-prompting", "git-control-and-human-review"],
  },
  {
    number: 24,
    slug: "conditional-stack-mapping-and-the-guardrail-checklist",
    title: "Conditional stack mapping and the guardrail checklist",
    shortTitle: "Stack mapping checklist",
    category: "verification",
    applicability: "context-dependent",
    summary: "Choose controls from the actual stack and risk profile instead of copying a security checklist wholesale.",
    definition:
      "Conditional stack mapping connects a project's technologies, data, users, deployment, and operations to the controls they genuinely need. A checklist is useful when it records why a control applies, not when it becomes a universal shopping list.",
    prevents: [
      "Installing infrastructure because a reference project used it.",
      "Missing a control because nobody mapped a real risk to an owner and enforcement point.",
    ],
    appliesWhen: [
      "A project crosses multiple trust, data, deployment, or operational boundaries.",
      "The team needs a repeatable review of conditional controls.",
    ],
    avoidWhen: [
      "The checklist is used to force auth, persistence, tenants, plans, or logging into an unrelated product.",
      "A control has no owner, applicability reason, or verification path.",
    ],
    sourceConcept:
      "The source concept closes with a mapping exercise: relate guardrail ideas to the project's concrete stack and review the resulting checklist.",
    productAdaptation:
      "AI Spec Blueprint makes applicability explicit, preserves unresolved decisions, and treats conditional controls as proposals that need product-specific approval.",
    example: {
      label: "A control decision record",
      description:
        "For each candidate control, a blueprint review can capture applies, does not apply, rationale, and the mechanism that would verify it.",
      code: "control → applicability → owner → verification",
    },
    relatedSlugs: ["normalized-identity-as-a-conditional-adapter", "rate-limiting-as-inherited-policy", "intentional-gaps-and-controlled-incompleteness"],
  },
] satisfies readonly GuardrailTopic[];
