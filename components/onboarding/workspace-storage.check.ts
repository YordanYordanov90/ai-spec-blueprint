import assert from "node:assert/strict";

import {
  WORKSPACE_STORAGE_KEY,
  WORKSPACE_SNAPSHOT_VERSION,
  clearWorkspaceSnapshot,
  loadWorkspaceSnapshot,
  saveWorkspaceSnapshot,
} from "./workspace-storage";
import { createInitialDiscoveryState } from "@/src/lib/blueprint/discovery/apply-extracted-facts";
import { validProjectBlueprintExample } from "@/src/lib/blueprint/schemas/examples";
import { ProjectBlueprintSchema } from "@/src/lib/blueprint/schemas/project-blueprint";

const values = new Map<string, string>();
const storage = {
  getItem(key: string) {
    return values.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    values.set(key, value);
  },
  removeItem(key: string) {
    values.delete(key);
  },
};

const snapshot = {
  version: WORKSPACE_SNAPSHOT_VERSION,
  savedAt: "2026-08-25T12:00:00.000Z",
  discovery: null,
  blueprint: null,
  baseline: null,
};

assert.equal(saveWorkspaceSnapshot(storage, snapshot), true);
assert.deepEqual(loadWorkspaceSnapshot(storage), snapshot);

const validDiscovery = createInitialDiscoveryState("A small workspace.");
const validBlueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);
const staleBlueprint = {
  ...validBlueprint,
  metadata: { schemaVersion: "2.0" },
};
assert.equal(
  saveWorkspaceSnapshot(storage, {
    ...snapshot,
    discovery: validDiscovery,
    blueprint: staleBlueprint,
    baseline: validBlueprint,
  }),
  false,
);
values.set(
  WORKSPACE_STORAGE_KEY,
  JSON.stringify({
    ...snapshot,
    discovery: validDiscovery,
    blueprint: staleBlueprint,
    baseline: validBlueprint,
  }),
);
const partiallyRecovered = loadWorkspaceSnapshot(storage);
assert.deepEqual(partiallyRecovered?.discovery, validDiscovery);
assert.equal(partiallyRecovered?.blueprint, null);
assert.equal(partiallyRecovered?.baseline, null);

values.set(WORKSPACE_STORAGE_KEY, "{broken");
assert.equal(loadWorkspaceSnapshot(storage), null);

clearWorkspaceSnapshot(storage);
assert.equal(values.has(WORKSPACE_STORAGE_KEY), false);

console.log("workspace storage checks passed");
