import type { GuardrailTopic } from "./types";

export const boundaryTopics = [
  {
    number: 9,
    slug: "server-only-boundaries",
    title: "Server-only boundaries",
    shortTitle: "Server-only boundaries",
    category: "boundaries",
    applicability: "context-dependent",
    summary: "Secrets, privileged clients, and protected operations belong behind a boundary the browser cannot cross directly.",
    definition:
      "A server-only boundary keeps credentials, privileged integrations, and sensitive decisions in code that is not shipped to the client. The exact boundary may be a route, server action, backend service, or another approved server-side entry point.",
    prevents: [
      "Provider credentials or privileged configuration entering a browser bundle.",
      "Client code gaining authority that belongs to a trusted server path.",
    ],
    appliesWhen: [
      "The feature uses secrets, privileged APIs, or protected data.",
      "The framework provides a meaningful server/client split.",
    ],
    avoidWhen: [
      "The operation is genuinely public and contains no secret or privileged behavior.",
      "A label such as server-only is used without checking the framework's actual bundling rules.",
    ],
    sourceConcept:
      "The source material treats server-only code as a critical boundary for keeping private capabilities away from the client.",
    productAdaptation:
      "The repository defaults to Server Components and keeps provider credentials and model calls server-side, but documents the boundary as context-dependent for generated projects.",
    example: {
      label: "AI model call",
      description:
        "A page can display a validated result, while the OpenAI provider configuration remains in a server-side action or route.",
      code: "Client UI → server action → model provider",
    },
    relatedSlugs: ["protected-operations-as-a-conditional-entry-point-pattern", "client-safe-mirrors-of-server-contracts", "enforcement-beyond-prompts"],
  },
  {
    number: 10,
    slug: "protected-operations-as-a-conditional-entry-point-pattern",
    title: "Protected operations as a conditional entry-point pattern",
    shortTitle: "Protected operations",
    category: "boundaries",
    applicability: "conditional",
    summary: "Sensitive operations should enter through an explicit policy boundary when the product has something worth protecting.",
    definition:
      "A protected operation is an entry point that checks the conditions required before it performs a sensitive action: identity, authorization, input validity, rate policy, or approval. The checks should be close enough to the operation that alternate callers cannot casually bypass them.",
    prevents: [
      "A new caller reaching a sensitive mutation without the original UI checks.",
      "Authorization logic being scattered across presentation components.",
    ],
    appliesWhen: [
      "An operation changes protected data, spends money, or triggers an external side effect.",
      "The project has an approved identity and authorization model.",
    ],
    avoidWhen: [
      "There is no protected state or side effect to authorize.",
      "A duplicated check obscures the actual policy owner.",
    ],
    sourceConcept:
      "The source concept places meaningful protection at the operation boundary rather than relying only on the calling screen.",
    productAdaptation:
      "The documentation calls this a conditional pattern and connects it to the blueprint's security and architecture decisions instead of treating it as a default scaffold.",
    example: {
      label: "Export approval",
      description:
        "If a later product feature lets users export sensitive project data, the export operation should own authorization and path validation, not trust a button's visibility.",
      code: "request → auth → validate → side effect",
    },
    relatedSlugs: ["server-only-boundaries", "normalized-identity-as-a-conditional-adapter", "rate-limiting-as-inherited-policy"],
  },
  {
    number: 11,
    slug: "enforcement-beyond-prompts",
    title: "Enforcement beyond prompts",
    shortTitle: "Beyond prompts",
    category: "boundaries",
    applicability: "universal",
    summary: "Instructions are useful context, but important constraints need a check that can reject a violation.",
    definition:
      "Enforcement beyond prompts means translating a high-value instruction into types, schemas, tests, lint rules, module boundaries, runtime validation, or review gates. The right mechanism depends on what can observe the failure.",
    prevents: [
      "A model forgetting a rule after context changes.",
      "A policy that sounds strong but has no observable failure signal.",
    ],
    appliesWhen: [
      "The rule has a concrete violation that tooling can detect.",
      "The cost of a silent violation justifies a check or approval gate.",
    ],
    avoidWhen: [
      "The proposed enforcement is more complex than the risk it addresses.",
      "A check duplicates another authoritative validation without adding signal.",
    ],
    sourceConcept:
      "The source material argues that agent instructions become dependable only when important parts are reinforced in the codebase.",
    productAdaptation:
      "AI Spec Blueprint records an enforcement path alongside guardrails and asks verification to test the actual behavior, not just the presence of prose.",
    example: {
      label: "Static route coverage",
      description:
        "A docs check can verify all 24 topic records have stable links and related topics, catching catalog drift before a build or review.",
      code: "catalog invariant → failing check",
    },
    relatedSlugs: ["the-cooperating-guardrail-stack", "strict-typescript-as-compile-time-enforcement", "the-define-implement-tighten-workflow"],
  },
  {
    number: 12,
    slug: "rate-limiting-as-inherited-policy",
    title: "Rate limiting as inherited policy",
    shortTitle: "Rate limiting",
    category: "boundaries",
    applicability: "conditional",
    summary: "Traffic controls belong on operations whose cost, abuse risk, or provider limits make repeated calls meaningful.",
    definition:
      "Rate limiting is a policy that restricts how often an actor, identity, IP, or resource can invoke an operation. It should be inherited by every relevant entry point rather than added only to the first screen that exposes the action.",
    prevents: [
      "Abuse or accidental loops exhausting a paid or fragile operation.",
      "A second API path bypassing a limit enforced only in the UI.",
    ],
    appliesWhen: [
      "The operation has meaningful cost, abuse potential, or provider quotas.",
      "The project can define a fair key and a response to rejected requests.",
    ],
    avoidWhen: [
      "The project has no externally reachable or costly operation.",
      "A guessed limit would harm legitimate use more than it reduces risk.",
    ],
    sourceConcept:
      "The source concept treats request limits as a policy of the protected operation, not merely a client interaction detail.",
    productAdaptation:
      "The product labels rate limiting conditional and asks the blueprint to establish workload, identity, and deployment context before choosing a mechanism.",
    example: {
      label: "AI discovery turns",
      description:
        "A public AI workflow may need a per-session or per-user budget; a static documentation page does not need a rate limiter simply because it is public.",
      code: "actor + operation + window → allow / reject",
    },
    relatedSlugs: ["protected-operations-as-a-conditional-entry-point-pattern", "audit-logging-as-an-architectural-guarantee", "conditional-stack-mapping-and-the-guardrail-checklist"],
  },
  {
    number: 13,
    slug: "audit-logging-as-an-architectural-guarantee",
    title: "Audit logging as an architectural guarantee",
    shortTitle: "Audit logging",
    category: "boundaries",
    applicability: "conditional",
    summary: "If the product must explain who changed what and when, recording that history is part of the operation design.",
    definition:
      "Audit logging captures meaningful changes or sensitive actions with enough context for later review. It is distinct from noisy debugging logs and should be designed around the accountability the product actually requires.",
    prevents: [
      "Sensitive mutations becoming impossible to investigate.",
      "Operational logs being mistaken for a durable record of user action.",
    ],
    appliesWhen: [
      "Regulation, customer trust, security response, or business workflow requires history.",
      "The project can define which events and actors are meaningful.",
    ],
    avoidWhen: [
      "Adding a permanent log of personal data without a retention or access plan.",
      "Calling every debug message an audit trail.",
    ],
    sourceConcept:
      "The source material presents audit history as a property of important operations and their accountability model.",
    productAdaptation:
      "AI Spec Blueprint keeps audit logging conditional and asks for purpose, sensitivity, retention, and access constraints before making it a guardrail.",
    example: {
      label: "Blueprint approval history",
      description:
        "A future team workflow might record who approved an architecture decision; the V1 ephemeral review flow does not imply a database-backed audit system.",
      code: "decision + actor + timestamp + action",
    },
    relatedSlugs: ["protected-operations-as-a-conditional-entry-point-pattern", "intentional-gaps-and-controlled-incompleteness", "conditional-stack-mapping-and-the-guardrail-checklist"],
  },
  {
    number: 14,
    slug: "client-safe-mirrors-of-server-contracts",
    title: "Client-safe mirrors of server contracts",
    shortTitle: "Client-safe contracts",
    category: "boundaries",
    applicability: "context-dependent",
    summary: "A client can understand the shape it needs without receiving the server's secrets, implementation, or authority.",
    definition:
      "A client-safe mirror is a deliberately reduced representation of a server-owned contract. It communicates displayable state or input requirements while keeping private fields, credentials, and enforcement on the server side.",
    prevents: [
      "Leaking internal or sensitive fields through a convenient response object.",
      "Client code becoming coupled to server implementation details.",
    ],
    appliesWhen: [
      "A browser needs data or validation feedback from a server-owned operation.",
      "The server contract contains fields the client must not know or control.",
    ],
    avoidWhen: [
      "The data is already public and no meaningful boundary exists.",
      "A mirror is maintained separately without a test or clear derivation path.",
    ],
    sourceConcept:
      "The source concept separates what the client may observe from the complete contract enforced on the server.",
    productAdaptation:
      "The product applies this to AI and export boundaries: present validated, user-relevant state while keeping provider configuration and file-write authority server-side.",
    example: {
      label: "Blueprint preview",
      description:
        "The browser can render a generated artifact's relative path and Markdown content without receiving any server credential or filesystem authority.",
      code: "server artifact → safe preview model",
    },
    relatedSlugs: ["server-only-boundaries", "source-of-truth-architecture", "enforcement-beyond-prompts"],
  },
  {
    number: 15,
    slug: "intentional-gaps-and-controlled-incompleteness",
    title: "Intentional gaps and controlled incompleteness",
    shortTitle: "Intentional gaps",
    category: "boundaries",
    applicability: "universal",
    summary: "Leaving an answer open can be safer than filling it with an invented certainty.",
    definition:
      "Controlled incompleteness records what is unknown, why it matters, and when it must be resolved. A gap is intentional when the project preserves uncertainty as a visible state instead of hiding it inside a default.",
    prevents: [
      "A provisional preference becoming a permanent dependency.",
      "Agents implementing future infrastructure because an unanswered question looked like a blank field.",
    ],
    appliesWhen: [
      "The decision has meaningful consequences but the human has not approved an option.",
      "The current feature can proceed safely while the gap remains visible.",
    ],
    avoidWhen: [
      "The missing answer blocks a safe implementation and should instead stop the feature.",
      "Using unresolved status to avoid making a decision that is already required.",
    ],
    sourceConcept:
      "The source material makes room for deliberate incompleteness where forcing a premature answer would weaken the architecture.",
    productAdaptation:
      "Blueprint schemas preserve unresolved decisions and the product states intentional gaps explicitly in documentation and review.",
    example: {
      label: "No persistence by implication",
      description:
        "A project can document that cloud persistence is unresolved without installing a database or auth layer before a feature authorizes it.",
      code: "decision: unresolved\nimplementation: deferred",
    },
    relatedSlugs: ["human-as-architect-and-director", "source-of-truth-architecture", "conditional-stack-mapping-and-the-guardrail-checklist"],
  },
] satisfies readonly GuardrailTopic[];
