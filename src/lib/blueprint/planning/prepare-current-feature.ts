import { renderCurrentFeatureMarkdown } from "../generators/current-feature";
import {
  ProjectBlueprintSchema,
  type FeatureSummary,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";
import type { GeneratedArtifact } from "../schemas/generated-artifact";

export type PreparedCurrentFeature = {
  blueprint: ProjectBlueprint;
  feature: FeatureSummary;
  artifact: GeneratedArtifact;
};

function selectFeature(
  features: readonly FeatureSummary[],
  requestedId?: string,
): FeatureSummary {
  if (requestedId) {
    const match = features.find((feature) => feature.id === requestedId);

    if (!match) {
      throw new Error(`Feature ${requestedId} was not found in the blueprint.`);
    }

    return match;
  }

  const inProgress = features.find((feature) => feature.status === "in-progress");

  if (inProgress) {
    return inProgress;
  }

  const nextPlanned = features.find((feature) => feature.status === "planned");

  if (!nextPlanned) {
    throw new Error("No planned or in-progress feature is available.");
  }

  return nextPlanned;
}

export function prepareCurrentFeature(
  blueprint: ProjectBlueprint,
  requestedId?: string,
): PreparedCurrentFeature {
  const validated = ProjectBlueprintSchema.parse(blueprint);
  const selected = selectFeature(validated.features, requestedId);

  const features = validated.features.map((feature) => {
    if (feature.id === selected.id) {
      return { ...feature, status: "in-progress" as const };
    }

    if (feature.status === "in-progress") {
      return { ...feature, status: "planned" as const };
    }

    return feature;
  });

  const nextBlueprint = ProjectBlueprintSchema.parse({
    ...validated,
    features,
  });
  const active = nextBlueprint.features.find(
    (feature) => feature.id === selected.id,
  );

  if (!active) {
    throw new Error("Prepared feature is missing from the updated blueprint.");
  }

  return {
    blueprint: nextBlueprint,
    feature: active,
    artifact: {
      relativePath: "features/current-feature.md",
      content: renderCurrentFeatureMarkdown(nextBlueprint),
      documentType: "markdown",
    },
  };
}
