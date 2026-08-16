import {
  DiscoveryStateSchema,
  type CompletenessArea,
  type CompletenessEntry,
  type CompletenessStatus,
  type DiscoveryState,
  type DiscoveryTopic,
  type ExtractedFact,
  type InformationGap,
} from "../schemas/discovery";

type MaterialTopicRule = {
  topic: DiscoveryTopic;
  blocking: boolean;
  question: string;
  whyItMatters: string;
};

const MATERIAL_TOPIC_RULES: readonly MaterialTopicRule[] = [
  {
    topic: "product-problem",
    blocking: true,
    question: "What problem does this product solve, and for whom at a high level?",
    whyItMatters:
      "Without a stated problem the generated overview and scope cannot be grounded.",
  },
  {
    topic: "users",
    blocking: true,
    question: "Who is the first user, and what do they need to accomplish?",
    whyItMatters:
      "Users shape flows, language, and which features belong in the first blueprint.",
  },
  {
    topic: "mvp-scope",
    blocking: true,
    question: "What must the first version do, and what is explicitly out of scope?",
    whyItMatters:
      "MVP scope prevents the blueprint from treating future work as current work.",
  },
  {
    topic: "persistence",
    blocking: false,
    question: "Does V1 need durable storage, or can state stay in-memory or local?",
    whyItMatters:
      "Persistence changes the architecture boundary even when it can remain unresolved.",
  },
  {
    topic: "authentication",
    blocking: false,
    question: "Does V1 require signed-in users, or can it stay unauthenticated?",
    whyItMatters:
      "Authentication is a high-impact architecture choice and must not be invented.",
  },
];

function hasTopicFact(
  facts: readonly ExtractedFact[],
  topic: DiscoveryTopic,
): boolean {
  return facts.some((fact) => fact.topic === topic);
}

function completenessStatus(
  facts: readonly ExtractedFact[],
  area: CompletenessArea,
): CompletenessStatus {
  switch (area) {
    case "product":
      return hasTopicFact(facts, "product-problem") ? "complete" : "missing";
    case "users":
      return hasTopicFact(facts, "users") ? "complete" : "missing";
    case "goals":
      return hasTopicFact(facts, "mvp-scope") ? "complete" : "missing";
    case "stack":
      return hasTopicFact(facts, "persistence") ? "complete" : "unresolved";
    case "architecture":
      return "unresolved";
    case "domain":
      return hasTopicFact(facts, "domain") ? "complete" : "unresolved";
    case "ui":
      return hasTopicFact(facts, "ui") ? "complete" : "unresolved";
    case "security":
      return hasTopicFact(facts, "security") ||
        hasTopicFact(facts, "authentication")
        ? "complete"
        : "unresolved";
    case "ai":
      return hasTopicFact(facts, "ai") ? "complete" : "unresolved";
    case "verification":
      return hasTopicFact(facts, "testing") ? "complete" : "unresolved";
    case "features":
      return hasTopicFact(facts, "mvp-scope") ||
        hasTopicFact(facts, "core-flows")
        ? "complete"
        : "unresolved";
  }
}

const COMPLETENESS_AREAS: readonly CompletenessArea[] = [
  "product",
  "users",
  "goals",
  "stack",
  "architecture",
  "domain",
  "ui",
  "security",
  "ai",
  "verification",
  "features",
];

function renderCompleteness(
  facts: readonly ExtractedFact[],
): CompletenessEntry[] {
  return COMPLETENESS_AREAS.map((area) => ({
    area,
    status: completenessStatus(facts, area),
  }));
}

function renderGaps(facts: readonly ExtractedFact[]): InformationGap[] {
  return MATERIAL_TOPIC_RULES.filter((rule) => !hasTopicFact(facts, rule.topic)).map(
    (rule) => ({
      id: `gap-${rule.topic}`,
      topic: rule.topic,
      question: rule.question,
      whyItMatters: rule.whyItMatters,
      blocking: rule.blocking,
    }),
  );
}

function canBeReady(state: {
  messages: DiscoveryState["messages"];
  facts: DiscoveryState["facts"];
  gaps: InformationGap[];
  draftDecisions: DiscoveryState["draftDecisions"];
  completeness: CompletenessEntry[];
}): boolean {
  const hasUserMessage = state.messages.some((message) => message.role === "user");
  const hasBlockingGap = state.gaps.some((gap) => gap.blocking);
  const hasIncompleteArea = state.completeness.some(
    (entry) => entry.status === "missing" || entry.status === "partial",
  );

  return (
    hasUserMessage &&
    state.facts.length > 0 &&
    !hasBlockingGap &&
    !hasIncompleteArea &&
    state.draftDecisions.length === 0
  );
}

export function analyzeMissingInformation(
  state: DiscoveryState,
): DiscoveryState {
  const validatedState = DiscoveryStateSchema.parse(state);
  const gaps = renderGaps(validatedState.facts);
  const completeness = renderCompleteness(validatedState.facts);
  const gapIds = new Set(gaps.map((gap) => gap.id));
  const currentQuestion =
    validatedState.currentQuestion &&
    validatedState.currentQuestion.relatedGapIds.every((gapId) =>
      gapIds.has(gapId),
    )
      ? validatedState.currentQuestion
      : undefined;
  const readyForBlueprintProposal = canBeReady({
    messages: validatedState.messages,
    facts: validatedState.facts,
    gaps,
    draftDecisions: validatedState.draftDecisions,
    completeness,
  });

  return DiscoveryStateSchema.parse({
    ...validatedState,
    gaps,
    completeness,
    currentQuestion: readyForBlueprintProposal ? undefined : currentQuestion,
    readyForBlueprintProposal,
  });
}
