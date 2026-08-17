import type { ProjectFilesystem } from "../project-filesystem";
import {
  ProjectBlueprintSchema,
  type FeatureSummary,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";
import type { ArchitectureDecision, TechnologyDecision } from "../schemas/decisions";
import type { ConventionFinding } from "./analyze-conventions";
import {
  blockingUnansweredQuestions,
  type AdoptionAnswer,
  type AdoptionQuestion,
} from "./adoption-questions";
import type { DetectedTechnology } from "./detect-technology";

const DETECTED_STACK_CATEGORIES = new Set([
  "web framework",
  "ui library",
  "language",
  "validation",
  "styling",
  "ai sdk",
  "ai provider",
  "persistence",
  "authentication",
]);

function answerValue(
  answers: readonly AdoptionAnswer[],
  id: string,
): string | undefined {
  return answers.find((answer) => answer.id === id)?.value.trim();
}

function uniqueByChoice(
  facts: readonly DetectedTechnology[],
): DetectedTechnology[] {
  const seen = new Set<string>();
  const unique: DetectedTechnology[] = [];

  for (const fact of facts) {
    const key = `${fact.category}:${fact.choice}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(fact);
  }

  return unique;
}

function productName(facts: readonly DetectedTechnology[]): string {
  return (
    facts.find((fact) => fact.category === "package-name")?.choice ??
    "Existing project"
  );
}

function productSummary(
  filesystem: ProjectFilesystem,
  facts: readonly DetectedTechnology[],
  answers: readonly AdoptionAnswer[],
): string {
  const fromAnswer = answerValue(answers, "product-problem");
  if (fromAnswer) {
    return fromAnswer;
  }

  const description = facts.find(
    (fact) => fact.category === "package-description",
  )?.choice;
  if (description) {
    return description;
  }

  const readme = filesystem.readText("README.md") ?? filesystem.readText("readme.md");
  if (readme) {
    const paragraph = readme
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith("#") && line.length > 20);

    if (paragraph) {
      return paragraph;
    }
  }

  return "An existing repository being adopted into durable project context.";
}

function toDetectedStackDecision(fact: DetectedTechnology): TechnologyDecision | null {
  if (!DETECTED_STACK_CATEGORIES.has(fact.category)) {
    return null;
  }

  if (fact.choice.startsWith("No ")) {
    return {
      category: fact.category,
      choice: fact.choice,
      status: "unresolved",
      rationale: fact.evidence,
      constraints: ["Do not invent this capability during adoption."],
      review: {
        status: "unresolved",
        reason: fact.evidence,
      },
    };
  }

  return {
    category: fact.category,
    choice: fact.choice,
    status: "preferred-if-needed",
    rationale: `Detected from the existing repository: ${fact.evidence}`,
    constraints: ["Preserve the installed technology unless a later ADR changes it."],
    review: {
      status: "proposed",
      proposedBy: "system",
    },
  };
}

function architectureFromConventions(
  facts: readonly DetectedTechnology[],
  conventions: readonly ConventionFinding[],
): ArchitectureDecision[] {
  const decisions: ArchitectureDecision[] = [
    {
      title: "Preserve existing repository structure",
      decision:
        "Adoption records the current project layout and conventions instead of proposing a clean-slate rewrite.",
      rationale: "The repository already exists and is the source of detected facts.",
      constraints: [
        "Do not re-scaffold the application",
        "Do not invent missing infrastructure",
      ],
      status: "proposed",
      relatedAreas: ["architecture", "adoption"],
      requiresAdr: true,
      review: {
        status: "proposed",
        proposedBy: "system",
      },
    },
  ];

  if (conventions.some((item) => item.id === "src-lib-modules")) {
    decisions.push({
      title: "Keep shared logic in src/lib",
      decision:
        "Framework-independent modules remain under src/lib and interface layers depend on them.",
      rationale: "Observed TypeScript modules already live under src/lib.",
      constraints: ["Do not move domain logic into React components"],
      status: "proposed",
      relatedAreas: ["schemas", "interface boundaries"],
      requiresAdr: false,
      review: {
        status: "proposed",
        proposedBy: "system",
      },
    });
  }

  if (facts.some((fact) => fact.choice === "App Router")) {
    decisions.push({
      title: "Keep the existing Next.js App Router",
      decision: "Continue using the App Router already present in the repository.",
      rationale: "An app directory was detected.",
      constraints: ["Do not introduce a Pages Router migration"],
      status: "proposed",
      relatedAreas: ["routing"],
      requiresAdr: false,
      review: {
        status: "proposed",
        proposedBy: "system",
      },
    });
  }

  return decisions;
}

function parseBacklogFeatures(filesystem: ProjectFilesystem): FeatureSummary[] {
  const backlog = filesystem.readText("features/backlog.md");

  if (!backlog) {
    return [];
  }

  const features: FeatureSummary[] = [];
  const pattern = /^###\s+(F\d+|W\d+)\s+-\s+(.+?)(?:\s+—\s+complete)?$/gm;
  let match = pattern.exec(backlog);

  while (match) {
    const id = match[1];
    const title = match[2]?.trim();

    if (id && title) {
      const isComplete = /—\s+complete\s*$/.test(match[0]);
      features.push({
        id,
        title,
        objective: `Recorded from the existing backlog: ${title}.`,
        phase: id.startsWith("W") ? "web" : "recorded",
        status: isComplete ? "complete" : "planned",
        dependencies: [],
        scopeSummary: title,
      });
    }

    match = pattern.exec(backlog);
  }

  return features;
}

function defaultFeatures(): FeatureSummary[] {
  return [
    {
      id: "A001",
      title: "Complete adopted project context",
      objective:
        "Finish recording the existing repository as durable context without rewriting it.",
      phase: "adoption",
      status: "planned",
      dependencies: [],
      scopeSummary: "Generate and review context that matches the current codebase.",
    },
  ];
}

export function generateAdoptedBlueprint(input: {
  filesystem: ProjectFilesystem;
  facts: readonly DetectedTechnology[];
  conventions: readonly ConventionFinding[];
  questions: readonly AdoptionQuestion[];
  answers: readonly AdoptionAnswer[];
}): ProjectBlueprint {
  const unanswered = blockingUnansweredQuestions(input.questions, input.answers);

  if (unanswered.length > 0) {
    throw new Error(
      `Adoption still needs answers for: ${unanswered.map((item) => item.id).join(", ")}.`,
    );
  }

  const name = productName(input.facts);
  const summary = productSummary(input.filesystem, input.facts, input.answers);
  const users =
    answerValue(input.answers, "users") ??
    "The current maintainers of this repository.";
  const scope =
    answerValue(input.answers, "mvp-scope") ??
    "Capture the existing system in durable context without rewriting it.";
  const stack = uniqueByChoice(input.facts)
    .map(toDetectedStackDecision)
    .filter((decision): decision is TechnologyDecision => decision !== null);

  if (stack.length === 0) {
    stack.push({
      category: "language",
      choice: "Unresolved",
      status: "unresolved",
      rationale: "No installable technology facts were detected.",
      constraints: ["Do not invent a stack during adoption"],
      review: {
        status: "unresolved",
        reason: "Detection found no package or config evidence.",
      },
    });
  }

  const backlogFeatures = parseBacklogFeatures(input.filesystem);
  const nonBlockingGaps = input.questions.filter((question) => !question.blocking);

  const blueprint: ProjectBlueprint = {
    metadata: { schemaVersion: "1.0" },
    product: {
      name,
      summary,
      problem: summary,
      successCriteria: [
        "Durable context describes the existing repository.",
        "Undetected decisions remain unresolved instead of invented.",
      ],
    },
    users: [
      {
        name: "Repository user",
        description: users,
        needs: [scope],
      },
    ],
    goals: [scope, "Keep detected architecture and stack visible to coding agents"],
    nonGoals: [
      "Replace the existing application with a greenfield rewrite",
      "Invent authentication or persistence that the repository does not have",
    ],
    stack,
    architecture: architectureFromConventions(input.facts, input.conventions),
    domain: [
      {
        name: "Existing application",
        purpose: "The current repository being adopted as project context.",
        attributes: ["detected technologies", "observed conventions"],
        relationships: ["produces durable context files"],
        invariants: ["Detected facts remain distinct from unanswered questions"],
        persistenceExpectation: input.facts.some((fact) =>
          ["Drizzle ORM", "Prisma"].includes(fact.choice),
        )
          ? "database"
          : "unknown",
        sensitivity: "internal",
      },
    ],
    ui: {
      personality: "Preserve the existing product presentation",
      visualDirection: input.facts.some((fact) => fact.choice === "Tailwind CSS")
        ? "The repository already uses Tailwind CSS utility styling."
        : "Follow the visual system already present in the repository.",
      layoutPrinciples: [
        "Do not redesign the product during adoption",
        "Record existing layout conventions when they are observable",
      ],
      navigationModel: input.facts.some((fact) => fact.choice === "App Router")
        ? "Existing App Router routes remain the navigation model."
        : "Keep the repository's current navigation structure.",
      responsiveBehavior: "Preserve current responsive behavior.",
      accessibilityRequirements: [
        "Keep existing semantic structure",
        "Do not regress keyboard access while adopting context",
      ],
      componentStrategy: input.conventions.some(
        (item) => item.id === "shadcn-primitives",
      )
        ? "Reuse the existing components/ui primitives."
        : "Reuse the repository's current component organization.",
      unresolvedBrandingChoices: ["Final brand color remains unresolved unless already specified"],
    },
    security: {
      constraints: [
        "Do not invent authentication or secret storage during adoption",
        "Keep provider credentials out of generated context",
      ],
    },
    verification: {
      strategy: "Use the repository's existing scripts and focused checks.",
      requiredChecks: ["TypeScript", "Lint", "Focused schema tests"],
      riskAreas: ["Invented architecture", "Overwrite of existing context"],
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
      {
        id: "adoption-no-rewrite",
        title: "Do not rewrite during adoption",
        rule: "Generated context must describe the existing project, not a hypothetical replacement.",
        category: "architecture",
        source: "project-specific",
        severity: "required",
        rationale: "Adoption exists to capture the current system.",
      },
    ],
    features: backlogFeatures.length > 0 ? backlogFeatures : defaultFeatures(),
    unresolvedDecisions: nonBlockingGaps
      .filter((question) => !answerValue(input.answers, question.id))
      .map((question) => ({
        question: question.question,
        whyItMatters: question.whyItMatters,
        optionsConsidered: [],
        blocking: false,
        recommendedResolutionPoint: "Before changing the affected architecture area.",
      })),
  };

  return ProjectBlueprintSchema.parse(blueprint);
}

export function approveAdoptedBlueprint(
  blueprint: ProjectBlueprint,
): ProjectBlueprint {
  const validated = ProjectBlueprintSchema.parse(blueprint);

  return ProjectBlueprintSchema.parse({
    ...validated,
    stack: validated.stack.map((decision) => {
      if (decision.review.status !== "proposed") {
        return decision;
      }

      return {
        ...decision,
        status: "confirmed" as const,
        review: {
          status: "approved" as const,
          proposedBy: decision.review.proposedBy,
          approvedBy: "human" as const,
        },
      };
    }),
    architecture: validated.architecture.map((decision) => {
      if (decision.review.status !== "proposed") {
        return decision;
      }

      return {
        ...decision,
        status: "approved" as const,
        review: {
          status: "approved" as const,
          proposedBy: decision.review.proposedBy,
          approvedBy: "human" as const,
        },
      };
    }),
  });
}
