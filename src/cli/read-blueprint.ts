import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "@/src/lib/blueprint";

export function readBlueprintFile(root: string, from: string): ProjectBlueprint {
  const absolute = resolve(root, from);
  const raw = readFileSync(absolute, "utf8");
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
