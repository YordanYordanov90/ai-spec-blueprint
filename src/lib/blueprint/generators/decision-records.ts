import type { ArchitectureDecision } from "../schemas/decisions";
import type { ProjectBlueprint } from "../schemas/project-blueprint";
import type { ContextGenerator } from "./contract";
import {
  joinMarkdownBlocks,
  markdownBulletList,
  markdownDocument,
  markdownHeading,
  markdownParagraph,
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

function adrStatus(decision: ArchitectureDecision): string {
  if (decision.status === "approved") {
    return "Accepted";
  }

  if (decision.status === "rejected") {
    return "Superseded";
  }

  return "Proposed";
}

function renderDecisionRecord(
  decision: ArchitectureDecision,
  index: number,
): string {
  return markdownDocument([
    markdownHeading(
      1,
      `ADR-${decisionRecordNumber(index)} — ${decision.title}`,
    ),
    markdownHeading(2, "Status"),
    markdownParagraph(adrStatus(decision)),
    markdownHeading(2, "Context"),
    markdownParagraph(
      `This record captures the architecture decision for ${decision.relatedAreas.join(", ")}.`,
    ),
    markdownHeading(2, "Decision"),
    markdownParagraph(decision.decision),
    markdownHeading(2, "Rationale"),
    markdownParagraph(decision.rationale),
    markdownHeading(2, "Constraints"),
    decision.constraints.length > 0
      ? markdownBulletList(decision.constraints)
      : markdownParagraph("No additional constraints were recorded."),
    markdownHeading(2, "Review"),
    markdownBulletList(
      decision.review.status === "approved"
        ? [
            "Review: approved",
            `Proposed by: ${decision.review.proposedBy}`,
            `Approved by: ${decision.review.approvedBy}`,
          ]
        : decision.review.status === "proposed"
          ? [
              "Review: proposed",
              `Proposed by: ${decision.review.proposedBy}`,
            ]
          : decision.review.status === "unresolved"
            ? ["Review: unresolved", `Reason: ${decision.review.reason}`]
            : [
                "Review: rejected",
                `Rejected by: ${decision.review.rejectedBy}`,
                `Reason: ${decision.review.reason}`,
              ],
    ),
  ]);
}

function renderDecisionIndex(blueprint: ProjectBlueprint): string {
  const records = blueprint.architecture.flatMap((decision, index) =>
    decision.requiresAdr
      ? [
          `[${decision.title}](${architectureDecisionRecordPath(decision, index)})`,
        ]
      : [],
  );

  return markdownDocument([
    markdownHeading(1, "Architecture Decision Records"),
    markdownParagraph(
      "This directory contains the architecture decisions selected for durable project context.",
    ),
    records.length > 0
      ? joinMarkdownBlocks([
          markdownHeading(2, "Included records"),
          markdownBulletList(records),
        ])
      : markdownParagraph(
          "No architecture decisions currently require an ADR.",
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
    decision.requiresAdr
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
