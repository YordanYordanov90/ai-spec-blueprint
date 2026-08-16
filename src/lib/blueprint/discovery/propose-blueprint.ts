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

function factStatements(
  facts: readonly ExtractedFact[],
  topic: DiscoveryTopic,
): string[] {
  return facts
    .filter((fact) => fact.topic === topic)
    .map((fact) => fact.statement);
}

function joinFactStatements(statements: readonly string[]): string | undefined {
  return statements.length > 0 ? statements.join("\n") : undefined;
}

function workingTitle(initialIdea: string): string {
  const firstLine = initialIdea.split(/[\n.]/)[0]?.trim() || initialIdea.trim();
  return firstLine.slice(0, 80);
}

function persistenceExpectation(
  persistenceFacts: readonly string[],
): "in-memory" | "local" | "database" | "external-service" | "unknown" {
  if (persistenceFacts.length === 0) {
    return "unknown";
  }

  const normalized = persistenceFacts.join(" ").toLowerCase();
  const explicitlyRejectsDatabase = persistenceFacts.some((fact) => {
    const statement = fact.toLowerCase();

    return (
      /\b(?:no|without|never|avoid|skip)\b(?:\s+\w+){0,5}\s+databases?\b/.test(
        statement,
      ) ||
      /\b(?:does not|doesn't|do not|don't|must not|mustn't)\b(?:\s+\w+){0,5}\s+databases?\b/.test(
        statement,
      ) ||
      /\bdatabases?\b(?:\s+\w+){0,5}\s+\b(?:not|required|needed|necessary)\b/.test(
        statement,
      ) ||
      /\bin[- ]memory\b/.test(statement)
    );
  });

  if (explicitlyRejectsDatabase) {
    return "in-memory";
  }

  if (normalized.includes("database")) {
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

function renderPersistenceStack(persistenceFacts: readonly string[]) {
  const persistenceFact = joinFactStatements(persistenceFacts);

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

  if (persistenceExpectation(persistenceFacts) === "in-memory") {
    return {
      category: "persistence",
      choice: "In-memory state",
      status: "preferred-if-needed" as const,
      rationale: persistenceFact,
      constraints: ["Do not introduce database persistence"],
      review: {
        status: "proposed" as const,
        proposedBy: "ai" as const,
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

  const productProblemFacts = factStatements(
    validatedState.facts,
    "product-problem",
  );
  const productProblem =
    joinFactStatements(productProblemFacts) ??
    validatedState.initialIdea;
  const usersFacts = factStatements(validatedState.facts, "users");
  const scopeFacts = factStatements(validatedState.facts, "mvp-scope");
  const nonGoalsFacts = factStatements(validatedState.facts, "non-goals");
  const persistenceFacts = factStatements(validatedState.facts, "persistence");
  const authenticationFacts = factStatements(
    validatedState.facts,
    "authentication",
  );
  const domainFacts = factStatements(validatedState.facts, "domain");
  const uiFacts = factStatements(validatedState.facts, "ui");
  const securityFacts = factStatements(validatedState.facts, "security");
  const testingFacts = factStatements(validatedState.facts, "testing");

  if (usersFacts.length === 0 || scopeFacts.length === 0) {
    throw new Error(
      "Discovery is missing required facts for a blueprint proposal.",
    );
  }

  const securityConstraints = [
    ...authenticationFacts,
    ...securityFacts,
    "Do not invent authentication or persistence requirements.",
  ].filter((constraint): constraint is string => Boolean(constraint));

  return ProjectBlueprintSchema.parse({
    metadata: { schemaVersion: "1.0" },
    product: {
      name: workingTitle(validatedState.initialIdea),
      summary: productProblem,
      problem: productProblem,
      successCriteria: scopeFacts,
    },
    users: usersFacts.map((statement, index) => ({
      name: index === 0 ? "Primary user" : `Additional user ${index + 1}`,
      description: statement,
      needs: [statement],
    })),
    goals: scopeFacts,
    nonGoals:
      nonGoalsFacts.length > 0
        ? nonGoalsFacts
        : ["Do not treat unstated capabilities as V1 requirements."],
    stack: [renderPersistenceStack(persistenceFacts)],
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
    domain:
      domainFacts.length > 0
        ? domainFacts.map((statement, index) => ({
            name:
              index === 0
                ? "Recorded domain concept"
                : `Additional domain concept ${index + 1}`,
            purpose: statement,
            attributes: [],
            relationships: [],
            invariants: [],
            persistenceExpectation: persistenceExpectation(persistenceFacts),
            sensitivity: "unknown" as const,
          }))
        : [
            {
              name: "Primary concept",
              purpose: productProblem,
              attributes: [],
              relationships: [],
              invariants: [],
              persistenceExpectation: persistenceExpectation(persistenceFacts),
              sensitivity: "unknown" as const,
            },
          ],
    ui: {
      personality: joinFactStatements(uiFacts) ?? "Unresolved product personality",
      visualDirection:
        joinFactStatements(uiFacts) ??
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
      unresolvedBrandingChoices: uiFacts.length > 0
        ? ["Final accent color"]
        : ["Product personality", "Visual direction", "Final accent color"],
    },
    security: {
      constraints: securityConstraints,
    },
    verification: {
      strategy:
        joinFactStatements(testingFacts) ??
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
        title: workingTitle(scopeFacts[0]),
        objective: scopeFacts.join("\n"),
        phase: "foundation",
        status: "planned",
        dependencies: [],
        scopeSummary: scopeFacts.join("\n"),
      },
    ],
    unresolvedDecisions: validatedState.gaps.map(renderUnresolvedDecision),
  });
}
