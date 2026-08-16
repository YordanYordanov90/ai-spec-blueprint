import type { ArchitectureDecision } from "../schemas/decisions";
import type { ProjectBlueprint } from "../schemas/project-blueprint";
import type { ContextGenerator } from "./contract";
import {
  joinMarkdownBlocks,
  markdownBulletList,
  markdownDocument,
  markdownHeading,
  markdownParagraph,
  markdownPlainText,
} from "./markdown";

const MAX_SLUG_LENGTH = 60;

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, MAX_SLUG_LENGTH)
      .replace(/-+$/g, "") || "architecture-decision"
  );
}

function decisionRecordNumber(index: number): string {
  return String(index + 1).padStart(3, "0");
}

export function architectureDecisionRecordPath(
  decision: ArchitectureDecision,
  index: number,
): string {
  return `decisions/ADR-${decisionRecordNumber(index)}-${slugify(decision.title)}.md`;
}

export function shouldGenerateArchitectureDecisionRecord(
  decision: ArchitectureDecision,
): boolean {
  return (
    decision.requiresAdr &&
    decision.status === "approved" &&
    decision.review.status === "approved"
  );
}

function renderDecisionRecord(
  decision: ArchitectureDecision,
  index: number,
): string {
  if (decision.status !== "approved" || decision.review.status !== "approved") {
    throw new Error("Only approved architecture decisions can generate ADRs.");
  }

  return markdownDocument([
    markdownHeading(
      1,
      `ADR-${decisionRecordNumber(index)} — ${decision.title}`,
    ),
    markdownHeading(2, "Status"),
    markdownParagraph("Accepted"),
    markdownHeading(2, "Context"),
    markdownPlainText(
      `This record captures the architecture decision for ${decision.relatedAreas.join(", ")}.`,
    ),
    markdownHeading(2, "Decision"),
    markdownPlainText(decision.decision),
    markdownHeading(2, "Rationale"),
    markdownPlainText(decision.rationale),
    markdownHeading(2, "Constraints"),
    decision.constraints.length > 0
      ? markdownBulletList(decision.constraints)
      : markdownParagraph("No additional constraints were recorded."),
    markdownHeading(2, "Review"),
    markdownBulletList([
      "Review: approved",
      `Proposed by: ${decision.review.proposedBy}`,
      `Approved by: ${decision.review.approvedBy}`,
    ]),
  ]);
}

function renderDecisionIndex(blueprint: ProjectBlueprint): string {
  const records = blueprint.architecture.flatMap((decision, index) =>
    shouldGenerateArchitectureDecisionRecord(decision)
      ? [
          `[${decision.title}](${architectureDecisionRecordPath(decision, index)})`,
        ]
      : [],
  );

  return markdownDocument([
    markdownHeading(1, "Architecture Decision Records"),
    markdownParagraph(
      "This directory contains approved architecture decisions selected for durable project context.",
    ),
    records.length > 0
      ? joinMarkdownBlocks([
          markdownHeading(2, "Included records"),
          markdownBulletList(records),
        ])
      : markdownParagraph(
          "No approved architecture decisions currently require an ADR.",
        ),
  ]);
}

export const generateDecisionRecords: ContextGenerator = (blueprint) => [
  {
    relativePath: "decisions/README.md",
    content: renderDecisionIndex(blueprint),
    documentType: "markdown",
  },
  ...blueprint.architecture.flatMap((decision, index) =>
    shouldGenerateArchitectureDecisionRecord(decision)
      ? [
          {
            relativePath: architectureDecisionRecordPath(decision, index),
            content: renderDecisionRecord(decision, index),
            documentType: "markdown" as const,
          },
        ]
      : [],
  ),
];
