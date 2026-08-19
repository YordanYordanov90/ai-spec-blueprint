import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  resolveArtifactPath,
  sanitizeExportRoot,
  type ArtifactWritePlan,
} from "@/src/lib/blueprint";

export function writeArtifactPlan(
  root: string,
  plan: ArtifactWritePlan,
): void {
  const exportRoot = sanitizeExportRoot(resolve(root));

  for (const action of plan.actions) {
    if (action.status === "skipped-existing") {
      continue;
    }

    const absolute = resolveArtifactPath(exportRoot, action.relativePath);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, action.content, "utf8");
  }
}
