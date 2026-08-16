import type { UnresolvedDecision } from "../schemas/decisions";
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

const FEATURE_STATUSES = [
  "complete",
  "in-progress",
  "planned",
  "blocked",
  "deferred",
] as const;

function renderOptionalList(
  title: string,
  items: readonly string[],
): string | null {
  if (items.length === 0) {
    return null;
  }

  return joinMarkdownBlocks([`${title}:`, markdownBulletList(items)]);
}

function groupFeaturesByPhase(
  features: readonly FeatureSummary[],
): [string, FeatureSummary[]][] {
  const groups = new Map<string, FeatureSummary[]>();
  const phaseOrder: string[] = [];

  for (const feature of features) {
    const existing = groups.get(feature.phase);

    if (existing) {
      existing.push(feature);
      continue;
    }

    groups.set(feature.phase, [feature]);
    phaseOrder.push(feature.phase);
  }

  return phaseOrder.map((phase) => [phase, groups.get(phase) ?? []]);
}

function renderFeature(feature: FeatureSummary): string {
  return joinMarkdownBlocks([
    markdownHeading(3, `${feature.id} — ${feature.title}`),
    markdownBulletList([
      `Status: ${feature.status}`,
      `Phase: ${feature.phase}`,
    ]),
    markdownParagraph(`Objective: ${feature.objective}`),
    markdownParagraph(`Scope: ${feature.scopeSummary}`),
    renderOptionalList("Dependencies", feature.dependencies),
  ]);
}

function renderFeatureStatusCounts(
  features: readonly FeatureSummary[],
): string {
  const counts = Object.fromEntries(
    FEATURE_STATUSES.map((status) => [status, 0]),
  ) as Record<(typeof FEATURE_STATUSES)[number], number>;

  for (const feature of features) {
    counts[feature.status] += 1;
  }

  return markdownBulletList([
    `Recorded features: ${features.length}`,
    `Complete: ${counts.complete}`,
    `In progress: ${counts["in-progress"]}`,
    `Planned: ${counts.planned}`,
    `Blocked: ${counts.blocked}`,
    `Deferred: ${counts.deferred}`,
  ]);
}

function renderCurrentFeatures(
  features: readonly FeatureSummary[],
): string {
  const currentFeatures = features.filter(
    (feature) => feature.status === "in-progress",
  );

  if (currentFeatures.length === 0) {
    return markdownParagraph("No feature is currently in progress.");
  }

  return markdownBulletList(
    currentFeatures.map(
      (feature) => `${feature.id} — ${feature.title} — ${feature.status}`,
    ),
  );
}

function renderFeatureRoadmap(features: readonly FeatureSummary[]): string {
  return joinMarkdownBlocks(
    groupFeaturesByPhase(features).flatMap(([phase, phaseFeatures]) => [
      markdownHeading(3, phase),
      ...phaseFeatures.map(renderFeature),
    ]),
  );
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

export function renderProgressTrackerMarkdown(
  blueprint: ProjectBlueprint,
): string {
  return markdownDocument([
    markdownHeading(1, "Progress Tracker"),
    markdownHeading(2, "Project"),
    markdownBulletList([
      `Name: ${blueprint.product.name}`,
      `Schema version: ${blueprint.metadata.schemaVersion}`,
    ]),
    markdownHeading(2, "Recorded feature status"),
    renderFeatureStatusCounts(blueprint.features),
    markdownHeading(2, "Current feature"),
    renderCurrentFeatures(blueprint.features),
    markdownHeading(2, "Features"),
    renderFeatureRoadmap(blueprint.features),
    markdownHeading(2, "Unresolved decisions"),
    renderUnresolvedDecisions(blueprint.unresolvedDecisions),
  ]);
}

export const generateProgressTracker: ContextGenerator = (blueprint) => [
  {
    relativePath: "context/progress-tracker.md",
    content: renderProgressTrackerMarkdown(blueprint),
    documentType: "markdown",
  },
];
