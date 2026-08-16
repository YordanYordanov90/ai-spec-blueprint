import type { Guardrail } from "../schemas/decisions";
import type {
  AiUsageDefinition,
  ProjectBlueprint,
} from "../schemas/project-blueprint";
import type { ContextGenerator } from "./contract";
import {
  joinMarkdownBlocks,
  markdownBulletList,
  markdownDocument,
  markdownHeading,
  markdownParagraph,
} from "./markdown";

function renderAiUsage(ai: AiUsageDefinition): string {
  return joinMarkdownBlocks([
    markdownHeading(2, "Purpose"),
    markdownParagraph(ai.purpose),
    markdownHeading(2, "Allowed responsibilities"),
    markdownBulletList(ai.allowedResponsibilities),
    markdownHeading(2, "Prohibited responsibilities"),
    markdownBulletList(ai.prohibitedResponsibilities),
    markdownHeading(2, "Provider and model constraints"),
    ai.providerModelConstraints.length > 0
      ? markdownBulletList(ai.providerModelConstraints)
      : markdownParagraph("No provider or model constraints were recorded."),
    markdownHeading(2, "Output validation"),
    markdownParagraph(ai.outputValidation),
    markdownHeading(2, "Fallback and error expectations"),
    markdownParagraph(ai.fallbackErrorExpectations),
    markdownHeading(2, "Human approval boundaries"),
    markdownBulletList(ai.humanApprovalBoundaries),
  ]);
}

function renderAiGuardrail(guardrail: Guardrail): string {
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

function renderAiGuardrails(guardrails: readonly Guardrail[]): string | null {
  const aiGuardrails = guardrails.filter(
    (guardrail) => guardrail.category === "AI",
  );

  if (aiGuardrails.length === 0) {
    return null;
  }

  return joinMarkdownBlocks([
    markdownHeading(2, "AI guardrails"),
    ...aiGuardrails.map(renderAiGuardrail),
  ]);
}

export function renderAiWorkflowRulesMarkdown(
  blueprint: ProjectBlueprint,
): string {
  if (!blueprint.ai) {
    return markdownDocument([
      markdownHeading(1, "AI Workflow Rules"),
      markdownParagraph(
        "AI is not part of the approved scope for this project.",
      ),
      markdownParagraph(
        "Do not introduce AI behavior unless an approved decision adds it.",
      ),
    ]);
  }

  return markdownDocument([
    markdownHeading(1, "AI Workflow Rules"),
    renderAiUsage(blueprint.ai),
    renderAiGuardrails(blueprint.guardrails),
  ]);
}

export const generateAiWorkflowRules: ContextGenerator = (blueprint) => [
  {
    relativePath: "context/ai-workflow-rules.md",
    content: renderAiWorkflowRulesMarkdown(blueprint),
    documentType: "markdown",
  },
];
