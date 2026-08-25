import { z } from "zod";

import { DiscoveryStateSchema } from "@/src/lib/blueprint/schemas/discovery";
import {
  CURRENT_BLUEPRINT_SCHEMA_VERSION,
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "@/src/lib/blueprint/schemas/project-blueprint";
import type { DiscoveryState } from "@/src/lib/blueprint/schemas/discovery";

export const WORKSPACE_STORAGE_KEY = "ai-spec-blueprint.workspace.v1";
export const WORKSPACE_SNAPSHOT_VERSION = 1 as const;

export const WorkspaceSnapshotSchema = z
  .object({
    version: z.literal(WORKSPACE_SNAPSHOT_VERSION),
    savedAt: z.string().datetime(),
    discovery: DiscoveryStateSchema.nullable(),
    blueprint: ProjectBlueprintSchema.nullable(),
    baseline: ProjectBlueprintSchema.nullable(),
  })
  .strict()
  .superRefine((snapshot, context) => {
    if (
      snapshot.blueprint &&
      snapshot.blueprint.metadata.schemaVersion !== CURRENT_BLUEPRINT_SCHEMA_VERSION
    ) {
      context.addIssue({
        code: "custom",
        message: `Unsupported blueprint schema version ${snapshot.blueprint.metadata.schemaVersion}.`,
        path: ["blueprint", "metadata", "schemaVersion"],
      });
    }
    if (
      snapshot.baseline &&
      snapshot.baseline.metadata.schemaVersion !== CURRENT_BLUEPRINT_SCHEMA_VERSION
    ) {
      context.addIssue({
        code: "custom",
        message: `Unsupported baseline schema version ${snapshot.baseline.metadata.schemaVersion}.`,
        path: ["baseline", "metadata", "schemaVersion"],
      });
    }
  });

export type WorkspaceSnapshot = z.infer<typeof WorkspaceSnapshotSchema>;

const WorkspaceSnapshotEnvelopeSchema = z
  .object({
    version: z.literal(WORKSPACE_SNAPSHOT_VERSION),
    savedAt: z.string().datetime(),
    discovery: z.unknown().nullable(),
    blueprint: z.unknown().nullable(),
    baseline: z.unknown().nullable(),
  })
  .strict();

function parseCompatibleDiscovery(value: unknown): DiscoveryState | null {
  if (value === null) return null;
  const result = DiscoveryStateSchema.safeParse(value);
  return result.success ? result.data : null;
}

function parseCompatibleBlueprint(value: unknown): ProjectBlueprint | null {
  if (value === null) return null;
  const result = ProjectBlueprintSchema.safeParse(value);
  if (
    !result.success ||
    result.data.metadata.schemaVersion !== CURRENT_BLUEPRINT_SCHEMA_VERSION
  ) {
    return null;
  }
  return result.data;
}

export function loadWorkspaceSnapshot(
  storage: Pick<Storage, "getItem">,
): WorkspaceSnapshot | null {
  try {
    const raw = storage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return null;
    const envelope = WorkspaceSnapshotEnvelopeSchema.safeParse(JSON.parse(raw));
    if (!envelope.success) return null;

    const discovery = parseCompatibleDiscovery(envelope.data.discovery);
    const blueprint = parseCompatibleBlueprint(envelope.data.blueprint);
    const baseline = blueprint
      ? parseCompatibleBlueprint(envelope.data.baseline)
      : null;

    if (
      !discovery &&
      !blueprint &&
      (envelope.data.discovery !== null ||
        envelope.data.blueprint !== null ||
        envelope.data.baseline !== null)
    ) {
      return null;
    }

    return {
      version: WORKSPACE_SNAPSHOT_VERSION,
      savedAt: envelope.data.savedAt,
      discovery,
      blueprint,
      baseline,
    };
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
