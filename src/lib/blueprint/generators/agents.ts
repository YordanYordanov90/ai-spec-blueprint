import type {
  ArchitectureDecision,
  Guardrail,
  UnresolvedDecision,
} from "../schemas/decisions";
import type {
  AiUsageDefinition,
  FeatureSummary,
  ProjectBlueprint,
  VerificationDefinition,
} from "../schemas/project-blueprint";
import type { ContextGenerator } from "./contract";
import { architectureDecisionRecordPath } from "./decision-records";
import {
  joinMarkdownBlocks,
  markdownBulletList,
  markdownDocument,
  markdownHeading,
  markdownParagraph,
  markdownPlainText,
} from "./markdown";

const REQUIRED_READING_PREFIX = [
  "context/project-overview.md",
  "context/architecture.md",
  "context/schemas.md",
  "context/code-standards.md",
  "context/ui-context.md",
  "context/ai-workflow-rules.md",
  "context/progress-tracker.md",
] as const;

function requiredReadingOrder(blueprint: ProjectBlueprint): string[] {
  return [
    ...REQUIRED_READING_PREFIX,
    "features/current-feature.md",
    "decisions/README.md",
    ...blueprint.architecture.flatMap((decision, index) =>
      decision.requiresAdr
        ? [architectureDecisionRecordPath(decision, index)]
        : [],
    ),
  ];
}

function renderOptionalList(
  title: string,
  items: readonly string[],
): string | null {
  if (items.length === 0) {
    return null;
  }

  return joinMarkdownBlocks([`${title}:`, markdownBulletList(items)]);
}

function renderNumberedList(items: readonly string[]): string {
  return items
    .map((item, index) => `${index + 1}. ${item.trim()}`)
    .join("\n");
}

function renderCurrentFeatures(features: readonly FeatureSummary[]): string {
  const currentFeatures = features.filter(
    (feature) => feature.status === "in-progress",
  );

  if (currentFeatures.length === 0) {
    return markdownParagraph(
      "No feature is currently in progress. Do not start planned, blocked, or deferred work without an approved active feature.",
    );
  }

  return markdownBulletList(
    currentFeatures.map(
      (feature) => `${feature.id} — ${feature.title} — ${feature.status}`,
    ),
  );
}

function renderGuardrail(guardrail: Guardrail): string {
  return joinMarkdownBlocks([
    markdownHeading(3, guardrail.title),
    markdownBulletList([
      `ID: ${guardrail.id}`,
      `Severity: ${guardrail.severity}`,
      `Source: ${guardrail.source}`,
    ]),
    markdownPlainText(`Rule: ${guardrail.rule}`),
  ]);
}

function renderApprovedArchitecture(
  decisions: readonly ArchitectureDecision[],
): string {
  const approved = decisions.filter(
    (decision) =>
      decision.status === "approved" && decision.review.status === "approved",
  );

  if (approved.length === 0) {
    return markdownParagraph(
      "No approved architecture constraints were recorded.",
    );
  }

  return joinMarkdownBlocks(
    approved.map((decision) =>
      joinMarkdownBlocks([
        markdownHeading(3, decision.title),
        markdownPlainText(`Decision: ${decision.decision}`),
        renderOptionalList("Constraints", decision.constraints),
      ]),
    ),
  );
}

function renderVerification(verification: VerificationDefinition): string {
  return joinMarkdownBlocks([
    markdownPlainText(`Strategy: ${verification.strategy}`),
    joinMarkdownBlocks([
      "Required checks:",
      markdownBulletList(verification.requiredChecks),
    ]),
    renderOptionalList("Risk areas", verification.riskAreas),
  ]);
}

function renderUnresolvedDecision(decision: UnresolvedDecision): string {
  return joinMarkdownBlocks([
    markdownHeading(3, decision.question),
    markdownPlainText(`Why it matters: ${decision.whyItMatters}`),
    markdownBulletList([
      `Blocking: ${decision.blocking ? "yes" : "no"}`,
      `Recommended resolution point: ${decision.recommendedResolutionPoint}`,
    ]),
    renderOptionalList("Options considered", decision.optionsConsidered),
  ]);
}

function renderUnresolvedDecisions(
  decisions: readonly UnresolvedDecision[],
): string {
  if (decisions.length === 0) {
    return markdownParagraph("There are no unresolved decisions.");
  }

  return joinMarkdownBlocks([
    markdownParagraph(
      "Do not invent answers to unresolved decisions or treat them as approved.",
    ),
    ...decisions.map(renderUnresolvedDecision),
  ]);
}

function renderAiGuidance(ai: AiUsageDefinition | undefined): string {
  if (!ai) {
    return markdownParagraph(
      "AI is not part of the approved scope for this project.",
    );
  }

  return joinMarkdownBlocks([
    markdownPlainText(`Purpose: ${ai.purpose}`),
    joinMarkdownBlocks([
      "Allowed responsibilities:",
      markdownBulletList(ai.allowedResponsibilities),
    ]),
    joinMarkdownBlocks([
      "Prohibited responsibilities:",
      markdownBulletList(ai.prohibitedResponsibilities),
    ]),
    joinMarkdownBlocks([
      "Human approval boundaries:",
      markdownBulletList(ai.humanApprovalBoundaries),
    ]),
  ]);
}

export function renderAgentsMarkdown(blueprint: ProjectBlueprint): string {
  return markdownDocument([
    markdownHeading(1, "AGENTS.md"),
    markdownHeading(2, "Purpose"),
    markdownPlainText(blueprint.product.summary),
    markdownPlainText(blueprint.product.problem),
    markdownHeading(2, "Required reading order"),
    renderNumberedList(requiredReadingOrder(blueprint)),
    markdownParagraph(
      "If a required context file is missing, contradictory, or materially incomplete, do not invent a replacement architecture.",
    ),
    markdownHeading(2, "Scope control"),
    markdownParagraph(
      "Implement only the approved active feature. Do not implement future, blocked, or deferred work because it appears easy.",
    ),
    renderCurrentFeatures(blueprint.features),
    markdownHeading(2, "Guardrails"),
    ...blueprint.guardrails.map(renderGuardrail),
    markdownHeading(2, "Architecture"),
    renderApprovedArchitecture(blueprint.architecture),
    markdownHeading(2, "Verification"),
    renderVerification(blueprint.verification),
    markdownHeading(2, "Security constraints"),
    markdownBulletList(blueprint.security.constraints),
    markdownHeading(2, "AI"),
    renderAiGuidance(blueprint.ai),
    markdownHeading(2, "Unresolved decisions"),
    renderUnresolvedDecisions(blueprint.unresolvedDecisions),
  ]);
}

export const generateAgents: ContextGenerator = (blueprint) => [
  {
    relativePath: "AGENTS.md",
    content: renderAgentsMarkdown(blueprint),
    documentType: "markdown",
  },
];
