import { generateApprovedContextPackage } from "../generators/approved-package";
import { blueprintHasPendingProposal } from "../discovery/approve-blueprint";
import type { GeneratedArtifact } from "../schemas/generated-artifact";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";

const SECTION_KEYS = [
  "product",
  "users",
  "goals",
  "nonGoals",
  "stack",
  "architecture",
  "domain",
  "ui",
  "ai",
  "security",
  "verification",
  "guardrails",
  "features",
  "unresolvedDecisions",
] as const;

export type ArtifactChange = {
  path: string;
  status: "added" | "changed" | "removed" | "unchanged";
};

export type BlueprintDiff = {
  changedSections: readonly string[];
  artifacts: readonly ArtifactChange[];
};

function artifactMap(artifacts: readonly GeneratedArtifact[]): Map<string, string> {
  return new Map(
    artifacts.map((artifact) => [artifact.relativePath, artifact.content]),
  );
}

export function compareBlueprints(
  previous: ProjectBlueprint | null,
  current: ProjectBlueprint,
): BlueprintDiff {
  const next = ProjectBlueprintSchema.parse(current);
  const before = previous ? ProjectBlueprintSchema.parse(previous) : null;
  const changedSections = SECTION_KEYS.filter(
    (key) => JSON.stringify(before?.[key]) !== JSON.stringify(next[key]),
  );

  const currentArtifacts = artifactMap(generateApprovedContextPackage(next));
  const previousArtifacts = before && !blueprintHasPendingProposal(before)
    ? artifactMap(generateApprovedContextPackage(before))
    : new Map<string, string>();
  const paths = [...new Set([...previousArtifacts.keys(), ...currentArtifacts.keys()])]
    .sort((left, right) => left.localeCompare(right));

  return {
    changedSections,
    artifacts: paths.map((path) => {
      const prior = previousArtifacts.get(path);
      const present = currentArtifacts.get(path);
      return {
        path,
        status:
          prior === undefined
            ? "added"
            : present === undefined
              ? "removed"
              : prior === present
                ? "unchanged"
                : "changed",
      };
    }),
  };
}
