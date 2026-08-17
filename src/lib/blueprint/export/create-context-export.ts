import { blueprintHasPendingProposal } from "../discovery/approve-blueprint";
import { generateApprovedContextPackage } from "../generators/approved-package";
import {
  validateGeneratedArtifacts,
} from "../generators/contract";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";
import type { GeneratedArtifact } from "../schemas/generated-artifact";
import { assertSafeArtifactPaths } from "./safe-path";
import { buildZipArchive } from "./zip";

export const BLUEPRINT_DOCUMENT_PATH = "blueprint.json";

export type ContextExport = {
  files: readonly GeneratedArtifact[];
  zipBytes: Uint8Array;
  filename: string;
};

export function slugifyExportName(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project"
  );
}

export function createBlueprintDocument(
  blueprint: ProjectBlueprint,
): GeneratedArtifact {
  return {
    relativePath: BLUEPRINT_DOCUMENT_PATH,
    content: `${JSON.stringify(blueprint, null, 2)}\n`,
    documentType: "json",
  };
}

export function createContextExport(
  blueprint: ProjectBlueprint,
): ContextExport {
  const validated = ProjectBlueprintSchema.parse(blueprint);

  if (blueprintHasPendingProposal(validated)) {
    throw new Error("Cannot export context from an unapproved blueprint proposal.");
  }

  const generated = generateApprovedContextPackage(validated);
  const files = validateGeneratedArtifacts([
    ...generated,
    createBlueprintDocument(validated),
  ]);

  assertSafeArtifactPaths("export-root", files.map((file) => file.relativePath));

  return {
    files,
    zipBytes: buildZipArchive(files),
    filename: `${slugifyExportName(validated.product.name)}-context.zip`,
  };
}
