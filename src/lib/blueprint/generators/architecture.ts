import type {
  ArchitectureDecision,
  DecisionReview,
  Guardrail,
  TechnologyDecision,
} from "../schemas/decisions";
import type { ProjectBlueprint } from "../schemas/project-blueprint";
import type { ContextGenerator } from "./contract";
import {
  joinMarkdownBlocks,
  markdownBulletList,
  markdownDocument,
  markdownHeading,
  markdownParagraph,
} from "./markdown";

function renderReview(review: DecisionReview): string {
  if (review.status === "proposed") {
    return markdownBulletList([
      "Review: proposed",
      `Proposed by: ${review.proposedBy}`,
    ]);
  }

  if (review.status === "approved") {
    return markdownBulletList([
      "Review: approved",
      `Proposed by: ${review.proposedBy}`,
      `Approved by: ${review.approvedBy}`,
    ]);
  }

  if (review.status === "unresolved") {
    return markdownBulletList([
      "Review: unresolved",
      `Reason: ${review.reason}`,
    ]);
  }

  return markdownBulletList([
    "Review: rejected",
    `Rejected by: ${review.rejectedBy}`,
    `Reason: ${review.reason}`,
  ]);
}

function renderOptionalList(title: string, items: readonly string[]): string | null {
  if (items.length === 0) {
    return null;
  }

  return joinMarkdownBlocks([`${title}:`, markdownBulletList(items)]);
}

function renderStackDecision(decision: TechnologyDecision): string {
  return joinMarkdownBlocks([
    markdownHeading(3, decision.category),
    markdownBulletList([
      `Choice: ${decision.choice}`,
      `Status: ${decision.status}`,
    ]),
    renderReview(decision.review),
    markdownParagraph(`Rationale: ${decision.rationale}`),
    renderOptionalList("Constraints", decision.constraints),
  ]);
}

function renderArchitectureDecision(decision: ArchitectureDecision): string {
  return joinMarkdownBlocks([
    markdownHeading(3, decision.title),
    markdownBulletList([
      `Status: ${decision.status}`,
      `Requires ADR: ${decision.requiresAdr ? "yes" : "no"}`,
    ]),
    renderReview(decision.review),
    markdownParagraph(`Decision: ${decision.decision}`),
    markdownParagraph(`Rationale: ${decision.rationale}`),
    renderOptionalList("Related areas", decision.relatedAreas),
    renderOptionalList("Constraints", decision.constraints),
  ]);
}

function renderGuardrail(guardrail: Guardrail): string {
  return joinMarkdownBlocks([
    markdownHeading(3, guardrail.title),
    markdownBulletList([
      `ID: ${guardrail.id}`,
      `Category: ${guardrail.category}`,
      `Source: ${guardrail.source}`,
      `Severity: ${guardrail.severity}`,
    ]),
    markdownParagraph(`Rule: ${guardrail.rule}`),
    markdownParagraph(`Rationale: ${guardrail.rationale}`),
  ]);
}

export function renderArchitectureMarkdown(blueprint: ProjectBlueprint): string {
  return markdownDocument([
    markdownHeading(1, "Architecture"),
    markdownHeading(2, "Stack"),
    ...blueprint.stack.map(renderStackDecision),
    markdownHeading(2, "Architecture decisions"),
    ...blueprint.architecture.map(renderArchitectureDecision),
    markdownHeading(2, "Guardrails"),
    ...blueprint.guardrails.map(renderGuardrail),
    markdownHeading(2, "Security constraints"),
    markdownBulletList(blueprint.security.constraints),
  ]);
}

export const generateArchitecture: ContextGenerator = (blueprint) => [
  {
    relativePath: "context/architecture.md",
    content: renderArchitectureMarkdown(blueprint),
    documentType: "markdown",
  },
];
