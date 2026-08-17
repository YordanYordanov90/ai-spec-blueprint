import type { GuardrailTopic } from "./types";

export const architectureTopics = [
  {
    number: 5,
    slug: "pattern-recognition-before-invention",
    title: "Pattern recognition before invention",
    shortTitle: "Recognize patterns first",
    category: "architecture",
    applicability: "universal",
    summary: "Existing repository patterns are evidence; new abstractions should earn their place.",
    definition:
      "Pattern recognition means inspecting nearby code, established naming, existing components, and current tests before designing a new solution. Reuse is a form of architectural alignment, not a shortcut.",
    prevents: [
      "Two competing ways to solve the same problem.",
      "A new abstraction that ignores the repository's visual or domain language.",
    ],
    appliesWhen: [
      "The requested behavior resembles something already present.",
      "A change touches a shared boundary or public convention.",
    ],
    avoidWhen: [
      "The existing pattern is demonstrably incompatible with the active requirement.",
      "Reuse would preserve a known defect instead of the underlying intent.",
    ],
    sourceConcept:
      "The source material encourages reading the codebase for patterns before asking an agent to invent a new structure.",
    productAdaptation:
      "Repository instructions make search-before-invention an explicit workflow rule and ask feature work to cite the patterns it reuses.",
    example: {
      label: "Docs surfaces",
      description:
        "The documentation pages reuse ProductHeader, semantic tokens, and the established border language instead of creating a separate visual system.",
    },
    relatedSlugs: ["search-before-invention", "source-of-truth-architecture", "reuse-first-and-red-green-prompting"],
  },
  {
    number: 6,
    slug: "source-of-truth-architecture",
    title: "Source-of-truth architecture",
    shortTitle: "Source of truth",
    category: "architecture",
    applicability: "universal",
    summary: "Each important kind of knowledge should have a clear home and a clear path into derived outputs.",
    definition:
      "Source-of-truth architecture maps where a decision is authored, where it is validated, and which artifacts are derived from it. It prevents two interfaces or documents from quietly becoming competing authorities.",
    prevents: [
      "Web and CLI implementing divergent blueprint rules.",
      "Generated files being edited as if they were the canonical domain model.",
    ],
    appliesWhen: [
      "The same concept appears in schemas, UI, exports, or multiple interfaces.",
      "A derived artifact must remain consistent across regeneration.",
    ],
    avoidWhen: [
      "Creating an abstraction only to name a one-off local value.",
      "Treating every explanatory paragraph as durable product state.",
    ],
    sourceConcept:
      "The source concept treats architecture as a map of authoritative decisions and their dependent representations.",
    productAdaptation:
      "ProjectBlueprint and its Zod schemas remain the canonical product-state model, while guardrail education stays in Web-owned content outside Blueprint Core.",
    example: {
      label: "One catalog, many views",
      description:
        "The 24-topic catalog is authored once, then drives the library index, sidebar, static params, related links, and metadata.",
      code: "topic catalog → index + routes + navigation",
    },
    relatedSlugs: ["the-cooperating-guardrail-stack", "client-safe-mirrors-of-server-contracts", "compact-agents-md-as-a-project-map"],
  },
  {
    number: 7,
    slug: "strict-typescript-as-compile-time-enforcement",
    title: "Strict TypeScript as compile-time enforcement",
    shortTitle: "Strict TypeScript",
    category: "architecture",
    applicability: "context-dependent",
    summary: "The type system can reject entire classes of mismatched assumptions before runtime.",
    definition:
      "Strict TypeScript makes contracts visible in code and turns incomplete or incompatible values into build-time feedback. It is most valuable at boundaries where a wrong shape would otherwise travel far.",
    prevents: [
      "Optional or renamed fields silently becoming undefined behavior.",
      "Interfaces drifting away from the values they claim to describe.",
    ],
    appliesWhen: [
      "The project is TypeScript-based and owns meaningful domain or API contracts.",
      "A type error can reveal a real architectural mismatch.",
    ],
    avoidWhen: [
      "Using type assertions to silence a boundary that should be validated.",
      "Assuming compile-time types replace runtime validation for untrusted input.",
    ],
    sourceConcept:
      "The source material uses strict typing as an early enforcement layer for application contracts.",
    productAdaptation:
      "The repository requires strict TypeScript and prefers Zod-inferred types, while keeping runtime validation at AI, request, import, and configuration boundaries.",
    example: {
      label: "Typed topic records",
      description:
        "A topic cannot quietly introduce a new category or omit its adaptation because the catalog is checked against the GuardrailTopic contract.",
      code: "const topic = {...} satisfies GuardrailTopic",
    },
    relatedSlugs: ["the-cooperating-guardrail-stack", "client-safe-mirrors-of-server-contracts", "enforcement-beyond-prompts"],
  },
  {
    number: 8,
    slug: "normalized-identity-as-a-conditional-adapter",
    title: "Normalized identity as a conditional adapter",
    shortTitle: "Normalized identity",
    category: "architecture",
    applicability: "conditional",
    summary: "A stable internal identity can reduce integration churn, but only when the project actually has identity providers to normalize.",
    definition:
      "Normalized identity is an adapter pattern: external user or account representations are translated into an internal contract that the rest of the application understands. It is not a reason to introduce authentication into every project.",
    prevents: [
      "Provider-specific identity fields leaking through the whole domain.",
      "Changing providers forcing unrelated application code to change.",
    ],
    appliesWhen: [
      "Multiple identity sources or an external identity provider are approved.",
      "The product needs a stable internal user reference across integrations.",
    ],
    avoidWhen: [
      "The project has no authentication, accounts, or identity integration.",
      "A thin single-provider application gains complexity without a real boundary to protect.",
    ],
    sourceConcept:
      "The source material describes normalized identity as a way to keep external identity details behind a stable application-facing boundary.",
    productAdaptation:
      "AI Spec Blueprint labels this control conditional and asks discovery to establish identity needs before recommending an adapter or auth dependency.",
    example: {
      label: "Only after auth is approved",
      description:
        "A multi-tenant product may map an identity provider's subject and organization membership to its own UserIdentity contract; a static marketing site should not.",
      code: "provider identity → UserIdentity",
    },
    relatedSlugs: ["source-of-truth-architecture", "protected-operations-as-a-conditional-entry-point-pattern", "conditional-stack-mapping-and-the-guardrail-checklist"],
  },
] satisfies readonly GuardrailTopic[];
