import type { GuardrailTopic } from "./types";

export const workflowTopics = [
  {
    number: 16,
    slug: "inline-micro-context-near-architecture-hotspots",
    title: "Inline micro-context near architecture hotspots",
    shortTitle: "Inline micro-context",
    category: "workflow",
    applicability: "universal",
    summary: "A small explanation beside a risky boundary can prevent a correct-looking but forbidden shortcut.",
    definition:
      "Inline micro-context is a concise comment or local note that explains why a nearby boundary exists, what must not cross it, or which source of truth owns the decision. It complements, rather than replaces, the main project context.",
    prevents: [
      "A future edit removing a constraint because its purpose is invisible locally.",
      "An agent needing a repository-wide search to understand a narrow architectural edge.",
    ],
    appliesWhen: [
      "The code is near a sensitive boundary or surprising constraint.",
      "The explanation can remain short and stable beside the implementation.",
    ],
    avoidWhen: [
      "The comment merely repeats the code.",
      "The local note becomes a second, conflicting specification.",
    ],
    sourceConcept:
      "The source concept keeps small pieces of architectural rationale close to the code where a shortcut is most tempting.",
    productAdaptation:
      "Repository standards reserve comments for why and constraints, while durable product decisions stay in context files and ADRs.",
    example: {
      label: "A server-only import",
      description:
        "A short comment can explain that a provider client must remain server-only, while the architecture document explains the full boundary.",
      code: "// Keep provider client server-only: it holds credentials.",
    },
    relatedSlugs: ["server-only-boundaries", "compact-agents-md-as-a-project-map", "search-before-invention"],
  },
  {
    number: 17,
    slug: "search-before-invention",
    title: "Search before invention",
    shortTitle: "Search first",
    category: "workflow",
    applicability: "universal",
    summary: "Before adding a symbol or pattern, inspect whether the repository already has the answer.",
    definition:
      "Search-before-invention is a concrete implementation habit: look for existing symbols, routes, schemas, tests, styles, and domain terms before creating new ones. The search is part of understanding scope, not just a code navigation trick.",
    prevents: [
      "Duplicate domain concepts and parallel utilities.",
      "A feature drifting away from the established implementation language.",
    ],
    appliesWhen: [
      "The requested behavior could plausibly already exist.",
      "A shared name, contract, or UI pattern is being introduced.",
    ],
    avoidWhen: [
      "Searching becomes a substitute for reading the relevant implementation.",
      "An old pattern is reused without checking whether it remains authoritative.",
    ],
    sourceConcept:
      "The source material treats repository search as a prerequisite to invention when working with an agent.",
    productAdaptation:
      "The development rules explicitly require searching for existing symbols, patterns, utilities, schemas, and domain terms before creating code.",
    example: {
      label: "One docs navigation model",
      description:
        "The sidebar, mobile disclosure, cards, and pagination all consume the typed catalog rather than each inventing a topic list.",
      code: "rg 'GuardrailTopic|guardrailCategories'",
    },
    relatedSlugs: ["pattern-recognition-before-invention", "source-of-truth-architecture", "reuse-first-and-red-green-prompting"],
  },
  {
    number: 18,
    slug: "compact-agents-md-as-a-project-map",
    title: "Compact `AGENTS.md` as a project map",
    shortTitle: "Compact AGENTS.md",
    category: "workflow",
    applicability: "context-dependent",
    summary: "A concise project map should route an agent to the authoritative details without becoming the whole manual.",
    definition:
      "A compact AGENTS.md summarizes the repository's purpose, required reading, scope rules, verification expectations, and architectural boundaries. It points to durable context files instead of duplicating every detail.",
    prevents: [
      "An agent missing the active feature or required verification commands.",
      "Instruction files growing so large that their highest-value rules disappear in noise.",
    ],
    appliesWhen: [
      "Agents operate in a repository with more than one important context file.",
      "The project needs a stable entry point for new implementation sessions.",
    ],
    avoidWhen: [
      "A small repository has no durable conventions beyond its README.",
      "The map copies changing feature content instead of linking to its source.",
    ],
    sourceConcept:
      "The source concept uses a compact agent instruction file as a navigational layer over the project.",
    productAdaptation:
      "The generated package keeps AGENTS.md concise and names current-feature.md, context, decisions, and verification as the next reading layer.",
    example: {
      label: "A session entry point",
      description:
        "An agent reads the map, then follows the active feature and relevant standards rather than loading unrelated historical files.",
      code: "AGENTS.md → current feature → relevant context",
    },
    relatedSlugs: ["preparing-the-coding-agent-environment", "inline-micro-context-near-architecture-hotspots", "session-limits-and-durable-repository-memory"],
  },
  {
    number: 19,
    slug: "session-limits-and-durable-repository-memory",
    title: "Session limits and durable repository memory",
    shortTitle: "Durable repository memory",
    category: "workflow",
    applicability: "universal",
    summary: "A repository can carry forward approved decisions even when the conversation that produced them is gone.",
    definition:
      "Durable repository memory is the set of reviewed files that future sessions can read: decisions, standards, feature scope, and generated context. It reduces dependence on an agent's conversational memory without pretending that every old note remains true forever.",
    prevents: [
      "Important decisions being lost at the end of a session.",
      "The next agent reconstructing architecture from incomplete clues.",
    ],
    appliesWhen: [
      "Work spans sessions or agents.",
      "A decision is stable enough to deserve repository ownership.",
    ],
    avoidWhen: [
      "Persisting private conversation details that are not project knowledge.",
      "Treating generated context as immutable when approved decisions have changed.",
    ],
    sourceConcept:
      "The source material emphasizes repository artifacts as a more dependable memory than a bounded chat session.",
    productAdaptation:
      "The product makes durable Markdown and reviewed decision files the primary V1 output, with no database required for the core workflow.",
    example: {
      label: "A completed handoff",
      description:
        "After a session ends, the next one can recover the active feature, architecture rules, and verification commands from the repository.",
      code: "conversation ends ≠ project context ends",
    },
    relatedSlugs: ["preparing-the-coding-agent-environment", "compact-agents-md-as-a-project-map", "git-control-and-human-review"],
  },
  {
    number: 20,
    slug: "prompting-after-guardrails-exist",
    title: "Prompting after guardrails exist",
    shortTitle: "Prompt after guardrails",
    category: "workflow",
    applicability: "universal",
    summary: "A focused implementation request is more effective when the repository has already made important decisions legible.",
    definition:
      "Guardrail-aware prompting starts with the approved context, names the active scope, and asks for implementation plus verification. The prompt supplies task intent; the repository supplies durable architecture and constraints.",
    prevents: [
      "A long prompt trying to restate an entire project inconsistently.",
      "An agent optimizing for output speed before it understands the boundary it must preserve.",
    ],
    appliesWhen: [
      "The active feature and relevant repository context are known.",
      "The request can name acceptance and verification expectations.",
    ],
    avoidWhen: [
      "Using a prompt to conceal an unresolved architecture choice.",
      "Dumping irrelevant repository material into the task.",
    ],
    sourceConcept:
      "The source concept places focused prompting after the project has established its guardrails and working context.",
    productAdaptation:
      "The product's feature workflow asks agents to read authoritative context, search existing patterns, stay in scope, and verify before completion.",
    example: {
      label: "A bounded docs task",
      description:
        "The implementation request can say to add F038 docs routes and run the docs check because the architecture and feature specification already define the boundary.",
      code: "read → scope → implement → verify",
    },
    relatedSlugs: ["preparing-the-coding-agent-environment", "compact-agents-md-as-a-project-map", "reuse-first-and-red-green-prompting"],
  },
] satisfies readonly GuardrailTopic[];
