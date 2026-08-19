import type { ProjectFilesystem } from "../project-filesystem";
import type { GeneratedArtifact } from "../schemas/generated-artifact";
import { planArtifactWrite, type ArtifactWritePlan } from "../export/plan-artifact-write";

export const CONTEXT_DIRECTORY_README = `context/README.md`;

export function createInitializationArtifacts(): readonly GeneratedArtifact[] {
  return [
    {
      relativePath: CONTEXT_DIRECTORY_README,
      content: `# Context

Durable project context is generated from an approved ProjectBlueprint.

Use \`blueprint generate\` after a blueprint is approved, or export the package from the Web workspace.
`,
      documentType: "markdown",
    },
    {
      relativePath: "features/current-feature.md",
      content: `# Current Feature

No feature is currently in progress. Do not start planned, blocked, or deferred work without an approved active feature.
`,
      documentType: "markdown",
    },
    {
      relativePath: "decisions/README.md",
      content: `# Architecture Decision Records

This directory contains approved architecture decisions selected for durable project context.

No approved architecture decisions currently require an ADR.
`,
      documentType: "markdown",
    },
  ];
}

export function planProjectInitialization(
  filesystem: ProjectFilesystem,
): ArtifactWritePlan {
  return planArtifactWrite(filesystem, createInitializationArtifacts());
}

export function projectLooksInitialized(filesystem: ProjectFilesystem): boolean {
  return (
    filesystem.exists("blueprint.json") ||
    filesystem.exists("context/project-overview.md") ||
    filesystem.exists("AGENTS.md")
  );
}
