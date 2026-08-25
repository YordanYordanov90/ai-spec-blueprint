import { z } from "zod";

import { DiscoveryStateSchema } from "@/src/lib/blueprint/schemas/discovery";
import { ProjectBlueprintSchema } from "@/src/lib/blueprint/schemas/project-blueprint";

export const WORKSPACE_STORAGE_KEY = "ai-spec-blueprint.workspace.v1";

export const WorkspaceSnapshotSchema = z
  .object({
    version: z.literal(1),
    savedAt: z.string().datetime(),
    discovery: DiscoveryStateSchema.nullable(),
    blueprint: ProjectBlueprintSchema.nullable(),
    baseline: ProjectBlueprintSchema.nullable(),
  })
  .strict();

export type WorkspaceSnapshot = z.infer<typeof WorkspaceSnapshotSchema>;

export function loadWorkspaceSnapshot(
  storage: Pick<Storage, "getItem">,
): WorkspaceSnapshot | null {
  try {
    const raw = storage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return null;
    const result = WorkspaceSnapshotSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveWorkspaceSnapshot(
  storage: Pick<Storage, "setItem">,
  snapshot: WorkspaceSnapshot,
): boolean {
  try {
    storage.setItem(
      WORKSPACE_STORAGE_KEY,
      JSON.stringify(WorkspaceSnapshotSchema.parse(snapshot)),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearWorkspaceSnapshot(
  storage: Pick<Storage, "removeItem">,
): void {
  try {
    storage.removeItem(WORKSPACE_STORAGE_KEY);
  } catch {
    // Browser storage may be unavailable in privacy-restricted contexts.
  }
}
