import {
  DiscoveryStateSchema,
  type DiscoveryState,
  type DiscoveryTopic,
  type ExtractedFact,
  type InformationGap,
} from "../schemas/discovery";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";

function factStatement(
  facts: readonly ExtractedFact[],
  topic: DiscoveryTopic,
): string | undefined {
  return facts.find((fact) => fact.topic === topic)?.statement;
}

function workingTitle(initialIdea: string): string {
  const firstLine = initialIdea.split(/[\n.]/)[0]?.trim() || initialIdea.trim();
  return firstLine.slice(0, 80);
}

function persistenceExpectation(
  persistenceFact: string | undefined,
): "in-memory" | "local" | "database" | "external-service" | "unknown" {
  if (!persistenceFact) {
    return "unknown";
  }

  const normalized = persistenceFact.toLowerCase();

  if (normalized.includes("database") && !normalized.includes("not require")) {
    return "database";
  }

  if (normalized.includes("in-memory") || normalized.includes("in memory")) {
    return "in-memory";
  }

  if (normalized.includes("local")) {
    return "local";
  }

  return "unknown";
}

function renderUnresolvedDecision(gap: InformationGap) {
  return {
    question: gap.question,
    whyItMatters: gap.whyItMatters,
    optionsConsidered: [] as string[],
    blocking: gap.blocking,
    recommendedResolutionPoint: gap.blocking
      ? "Before approving this blueprint."
      : "Before implementing the affected area.",
  };
}

function renderPersistenceStack(persistenceFact: string | undefined) {
  if (!persistenceFact) {
    return {
      category: "persistence",
      choice: "Unresolved",
      status: "unresolved" as const,
      rationale:
        "Persistence was not confirmed during discovery and must not be installed by default.",
      constraints: ["Do not introduce persistence before it is approved"],
      review: {
        status: "unresolved" as const,
        reason: "Discovery left persistence unresolved.",
      },
    };
  }

  return {
    category: "persistence",
    choice: persistenceFact,
    status: "preferred-if-needed" as const,
    rationale: persistenceFact,
    constraints: ["Do not introduce persistence before it is approved"],
    review: {
      status: "proposed" as const,
      proposedBy: "ai" as const,
    },
  };
}

export function proposeProjectBlueprint(
  state: DiscoveryState,
): ProjectBlueprint {
  const validatedState = DiscoveryStateSchema.parse(state);

  if (!validatedState.readyForBlueprintProposal) {
    throw new Error(
      "Discovery is not ready for a blueprint proposal.",
    );
  }

  const productProblem =
    factStatement(validatedState.facts, "product-problem") ??
    validatedState.initialIdea;
  const usersFact = factStatement(validatedState.facts, "users");
  const scopeFact = factStatement(validatedState.facts, "mvp-scope");
  const nonGoalsFact = factStatement(validatedState.facts, "non-goals");
  const persistenceFact = factStatement(validatedState.facts, "persistence");
  const authenticationFact = factStatement(
    validatedState.facts,
    "authentication",
  );
  const domainFact = factStatement(validatedState.facts, "domain");
  const uiFact = factStatement(validatedState.facts, "ui");
  const securityFact = factStatement(validatedState.facts, "security");
  const testingFact = factStatement(validatedState.facts, "testing");

  if (!usersFact || !scopeFact) {
    throw new Error(
      "Discovery is missing required facts for a blueprint proposal.",
    );
  }

  const securityConstraints = [
    authenticationFact,
    securityFact,
    "Do not invent authentication or persistence requirements.",
  ].filter((constraint): constraint is string => Boolean(constraint));

  return ProjectBlueprintSchema.parse({
    metadata: { schemaVersion: "1.0" },
    product: {
      name: workingTitle(validatedState.initialIdea),
      summary: productProblem,
      problem: productProblem,
      successCriteria: [scopeFact],
    },
    users: [
      {
        name: "Primary user",
        description: usersFact,
        needs: [usersFact],
      },
    ],
    goals: [scopeFact],
    nonGoals: [
      nonGoalsFact ??
        "Do not treat unstated capabilities as V1 requirements.",
    ],
    stack: [renderPersistenceStack(persistenceFact)],
    architecture: [
      {
        title: "Discovery-derived architecture",
        decision:
          "Keep V1 aligned with recorded discovery facts and leave unconfirmed choices unresolved.",
        rationale:
          "This proposal is assembled from Grill Me discovery and is not human-approved.",
        constraints: [
          "Human review is required before this proposal becomes approved architecture",
          "Do not install preferred-if-needed technologies",
        ],
        status: "proposed",
        relatedAreas: ["discovery"],
        requiresAdr: false,
        review: {
          status: "proposed",
          proposedBy: "ai",
        },
      },
    ],
    domain: [
      {
        name: domainFact ? "Recorded domain concept" : "Primary concept",
        purpose: domainFact ?? productProblem,
        attributes: [],
        relationships: [],
        invariants: [],
        persistenceExpectation: persistenceExpectation(persistenceFact),
        sensitivity: "unknown",
      },
    ],
    ui: {
      personality: uiFact ?? "Unresolved product personality",
      visualDirection:
        uiFact ??
        "Visual direction was not confirmed during discovery.",
      layoutPrinciples: ["Keep recorded decisions inspectable"],
      navigationModel: "A primary workspace with section-level navigation.",
      responsiveBehavior: "Stack review panels on smaller screens.",
      accessibilityRequirements: [
        "Keyboard-accessible controls",
        "Visible focus states",
      ],
      componentStrategy:
        "Use small composable components with a shared token system.",
      unresolvedBrandingChoices: uiFact
        ? ["Final accent color"]
        : ["Product personality", "Visual direction", "Final accent color"],
    },
    security: {
      constraints: securityConstraints,
    },
    verification: {
      strategy:
        testingFact ??
        "Verify recorded discovery facts and unresolved decisions before approval.",
      requiredChecks: ["TypeScript", "Lint"],
      riskAreas: validatedState.gaps.map((gap) => gap.topic),
    },
    guardrails: [
      {
        id: "scope-one-feature",
        title: "One active feature",
        rule: "Implement only the approved active feature.",
        category: "scope",
        source: "universal",
        severity: "required",
        rationale: "A narrow scope prevents unrelated architectural drift.",
      },
    ],
    features: [
      {
        id: "F001",
        title: workingTitle(scopeFact),
        objective: scopeFact,
        phase: "foundation",
        status: "planned",
        dependencies: [],
        scopeSummary: scopeFact,
      },
    ],
    unresolvedDecisions: validatedState.gaps.map(renderUnresolvedDecision),
  });
}
