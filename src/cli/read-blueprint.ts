import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "@/src/lib/blueprint";

import { createNodeProjectFilesystem } from "./node-filesystem";

export function readBlueprintFile(root: string, from: string): ProjectBlueprint {
  const raw = createNodeProjectFilesystem(root).readText(from);
  if (raw === null) {
    throw new Error(`Could not read blueprint file inside project root: ${from}`);
  }

  return ProjectBlueprintSchema.parse(JSON.parse(raw));
}

export function tryReadBlueprintFile(
  root: string,
  from?: string,
): ProjectBlueprint | undefined {
  if (!from) {
    return undefined;
  }

  try {
    return readBlueprintFile(root, from);
  } catch {
    return undefined;
  }
}
