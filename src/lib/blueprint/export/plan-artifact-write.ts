import type { ProjectFilesystem } from "../project-filesystem";
import type { GeneratedArtifact } from "../schemas/generated-artifact";
import { validateGeneratedArtifacts } from "../generators/contract";
import { assertSafeArtifactPaths } from "./safe-path";

export type ArtifactWriteAction = {
  relativePath: string;
  content: string;
  status: "create" | "overwrite" | "skipped-existing";
};

export type ArtifactWritePlan = {
  actions: readonly ArtifactWriteAction[];
  blocked: readonly string[];
};

export function planArtifactWrite(
  filesystem: ProjectFilesystem,
  artifacts: readonly GeneratedArtifact[],
  options: { force?: boolean } = {},
): ArtifactWritePlan {
  const validated = validateGeneratedArtifacts(artifacts);
  assertSafeArtifactPaths("export-root", validated.map((file) => file.relativePath));

  const actions: ArtifactWriteAction[] = [];
  const blocked: string[] = [];
  const force = options.force === true;

  for (const artifact of validated) {
    const exists = filesystem.exists(artifact.relativePath);

    if (exists && !force) {
      blocked.push(artifact.relativePath);
      actions.push({
        relativePath: artifact.relativePath,
        content: artifact.content,
        status: "skipped-existing",
      });
      continue;
    }

    actions.push({
      relativePath: artifact.relativePath,
      content: artifact.content,
      status: exists ? "overwrite" : "create",
    });
  }

  return { actions, blocked };
}

export function assertWritablePlan(plan: ArtifactWritePlan): void {
  if (plan.blocked.length > 0) {
    throw new Error(
      `Refusing to overwrite existing files: ${plan.blocked.join(", ")}. Pass --force to replace them.`,
    );
  }
}
