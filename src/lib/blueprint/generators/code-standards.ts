import type {
  ArchitectureDecision,
  Guardrail,
  TechnologyDecision,
} from "../schemas/decisions";
import type {
  ProjectBlueprint,
  VerificationDefinition,
} from "../schemas/project-blueprint";
import type { ContextGenerator } from "./contract";
import {
  joinMarkdownBlocks,
  markdownBulletList,
  markdownDocument,
  markdownHeading,
  markdownParagraph,
} from "./markdown";

function renderOptionalList(
  title: string,
  items: readonly string[],
): string | null {
  if (items.length === 0) {
    return null;
  }

  return joinMarkdownBlocks([`${title}:`, markdownBulletList(items)]);
}

function renderStackStandard(decision: TechnologyDecision): string {
  return joinMarkdownBlocks([
    markdownHeading(3, decision.category),
    markdownBulletList([
      `Choice: ${decision.choice}`,
      `Status: ${decision.status}`,
    ]),
    markdownParagraph(`Rationale: ${decision.rationale}`),
    renderOptionalList("Constraints", decision.constraints),
  ]);
}

function renderArchitectureConstraints(
  decisions: readonly ArchitectureDecision[],
): string {
  const sections = decisions
    .filter(
      (decision) =>
        decision.status === "approved" &&
        decision.review.status === "approved" &&
        decision.constraints.length > 0,
    )
    .map((decision) =>
      joinMarkdownBlocks([
        markdownHeading(3, decision.title),
        markdownBulletList(decision.constraints),
      ]),
    );

  if (sections.length === 0) {
    return markdownParagraph("No architecture constraints were recorded.");
  }

  return joinMarkdownBlocks(sections);
}

function renderVerification(verification: VerificationDefinition): string {
  return joinMarkdownBlocks([
    markdownParagraph(`Strategy: ${verification.strategy}`),
    joinMarkdownBlocks([
      "Required checks:",
      markdownBulletList(verification.requiredChecks),
    ]),
    renderOptionalList("Risk areas", verification.riskAreas),
  ]);
}

function renderGuardrail(guardrail: Guardrail): string {
  return joinMarkdownBlocks([
    markdownHeading(3, guardrail.title),
    markdownBulletList([
      `ID: ${guardrail.id}`,
      `Severity: ${guardrail.severity}`,
      `Source: ${guardrail.source}`,
    ]),
    markdownParagraph(`Rule: ${guardrail.rule}`),
    markdownParagraph(`Rationale: ${guardrail.rationale}`),
  ]);
}

export function renderCodeStandardsMarkdown(
  blueprint: ProjectBlueprint,
): string {
  return markdownDocument([
    markdownHeading(1, "Code Standards"),
    markdownHeading(2, "Stack"),
    ...blueprint.stack.map(renderStackStandard),
    markdownHeading(2, "Architecture constraints"),
    renderArchitectureConstraints(blueprint.architecture),
    markdownHeading(2, "Verification"),
    renderVerification(blueprint.verification),
    markdownHeading(2, "Guardrails"),
    ...blueprint.guardrails.map(renderGuardrail),
    markdownHeading(2, "Security constraints"),
    markdownBulletList(blueprint.security.constraints),
  ]);
}

export const generateCodeStandards: ContextGenerator = (blueprint) => [
  {
    relativePath: "context/code-standards.md",
    content: renderCodeStandardsMarkdown(blueprint),
    documentType: "markdown",
  },
];
