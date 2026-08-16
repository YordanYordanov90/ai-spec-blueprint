import { z } from "zod";

import { GeneratedArtifactSchema } from "../schemas/generated-artifact";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import type { GeneratedArtifact } from "../schemas/generated-artifact";
import type { ProjectBlueprint } from "../schemas/project-blueprint";

/**
 * Deterministic context generator.
 * Implementations must not call an LLM or depend on interface layers.
 */
export type ContextGenerator = (
  blueprint: ProjectBlueprint,
) => readonly GeneratedArtifact[];

export const GeneratedArtifactsSchema = z
  .array(GeneratedArtifactSchema)
  .superRefine((artifacts, context) => {
    const seenPaths = new Set<string>();

    artifacts.forEach((artifact, index) => {
      if (seenPaths.has(artifact.relativePath)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate artifact path: ${artifact.relativePath}`,
          path: [index, "relativePath"],
        });
      }

      seenPaths.add(artifact.relativePath);
    });
  });

function compareArtifactPaths(
  left: GeneratedArtifact,
  right: GeneratedArtifact,
): number {
  if (left.relativePath < right.relativePath) {
    return -1;
  }

  if (left.relativePath > right.relativePath) {
    return 1;
  }

  return 0;
}

export function validateGeneratedArtifacts(
  artifacts: unknown,
): GeneratedArtifact[] {
  return [...GeneratedArtifactsSchema.parse(artifacts)].sort(
    compareArtifactPaths,
  );
}

export function runContextGenerator(
  blueprint: ProjectBlueprint,
  generate: ContextGenerator,
): GeneratedArtifact[] {
  const validatedBlueprint = ProjectBlueprintSchema.parse(blueprint);
  return validateGeneratedArtifacts(generate(validatedBlueprint));
}
