import type {
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

function renderFeature(feature: FeatureSummary): string {
  return joinMarkdownBlocks([
    markdownHeading(1, "Current Feature"),
    markdownHeading(2, `${feature.id} — ${feature.title}`),
    markdownBulletList([
      `Status: ${feature.status}`,
      `Phase: ${feature.phase}`,
    ]),
    markdownHeading(2, "Objective"),
    markdownParagraph(feature.objective),
    markdownHeading(2, "Scope"),
    markdownParagraph(feature.scopeSummary),
    feature.dependencies.length > 0
      ? joinMarkdownBlocks([
          markdownHeading(2, "Dependencies"),
          markdownBulletList(feature.dependencies),
        ])
      : null,
  ]);
}

export function renderCurrentFeatureMarkdown(
  blueprint: ProjectBlueprint,
): string {
  const currentFeatures = blueprint.features.filter(
    (feature) => feature.status === "in-progress",
  );

  if (currentFeatures.length === 0) {
    return markdownDocument([
      markdownHeading(1, "Current Feature"),
      markdownParagraph(
        "No feature is currently in progress. Do not start planned, blocked, or deferred work without an approved active feature.",
      ),
    ]);
  }

  if (currentFeatures.length === 1) {
    return markdownDocument([renderFeature(currentFeatures[0])]);
  }

  return markdownDocument([
    markdownHeading(1, "Current Feature"),
    markdownParagraph(
      "Multiple features are marked in progress. Resolve the active-feature scope before implementation begins.",
    ),
    markdownBulletList(
      currentFeatures.map((feature) => `${feature.id} — ${feature.title}`),
    ),
  ]);
}

export const generateCurrentFeature: ContextGenerator = (blueprint) => [
  {
    relativePath: "features/current-feature.md",
    content: renderCurrentFeatureMarkdown(blueprint),
    documentType: "markdown",
  },
];
