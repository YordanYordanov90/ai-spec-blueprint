import { blueprintHasPendingProposal } from "../discovery/approve-blueprint";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";
import type { GeneratedArtifact } from "../schemas/generated-artifact";
import { generateContextPackage } from "./context-package";

export function generateApprovedContextPackage(
  blueprint: ProjectBlueprint,
): readonly GeneratedArtifact[] {
  const validated = ProjectBlueprintSchema.parse(blueprint);

  if (blueprintHasPendingProposal(validated)) {
    throw new Error(
      "Cannot generate context files from an unapproved blueprint proposal.",
    );
  }

  return generateContextPackage(validated);
}
