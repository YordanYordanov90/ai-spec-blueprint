import type { UnresolvedDecision } from "../schemas/decisions";
import type {
  DomainConcept,
  FeatureSummary,
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

function renderOptionalList(
  title: string,
  items: readonly string[],
): string | null {
  if (items.length === 0) {
    return null;
  }

  return joinMarkdownBlocks([`${title}:`, markdownBulletList(items)]);
}

function renderDomainConcept(concept: DomainConcept): string {
  return joinMarkdownBlocks([
    markdownHeading(3, concept.name),
    markdownParagraph(`Purpose: ${concept.purpose}`),
    markdownBulletList([
      `Persistence: ${concept.persistenceExpectation}`,
      `Sensitivity: ${concept.sensitivity}`,
    ]),
    renderOptionalList("Attributes", concept.attributes),
    renderOptionalList("Relationships", concept.relationships),
    renderOptionalList("Invariants", concept.invariants),
  ]);
}

function renderFeature(feature: FeatureSummary): string {
  return joinMarkdownBlocks([
    markdownHeading(3, `${feature.id} — ${feature.title}`),
    markdownBulletList([
      `Phase: ${feature.phase}`,
      `Status: ${feature.status}`,
    ]),
    markdownParagraph(`Objective: ${feature.objective}`),
    markdownParagraph(`Scope: ${feature.scopeSummary}`),
    renderOptionalList("Dependencies", feature.dependencies),
  ]);
}

function renderUnresolvedDecision(decision: UnresolvedDecision): string {
  return joinMarkdownBlocks([
    markdownHeading(3, decision.question),
    markdownParagraph(`Why it matters: ${decision.whyItMatters}`),
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

  return joinMarkdownBlocks(decisions.map(renderUnresolvedDecision));
}

export function renderSchemasMarkdown(blueprint: ProjectBlueprint): string {
  return markdownDocument([
    markdownHeading(1, "Schemas and Domain Model"),
    markdownHeading(2, "Metadata"),
    markdownBulletList([`Schema version: ${blueprint.metadata.schemaVersion}`]),
    markdownHeading(2, "Domain concepts"),
    ...blueprint.domain.map(renderDomainConcept),
    markdownHeading(2, "Features"),
    ...blueprint.features.map(renderFeature),
    markdownHeading(2, "Unresolved decisions"),
    renderUnresolvedDecisions(blueprint.unresolvedDecisions),
  ]);
}

export const generateSchemasContext: ContextGenerator = (blueprint) => [
  {
    relativePath: "context/schemas.md",
    content: renderSchemasMarkdown(blueprint),
    documentType: "markdown",
  },
];
