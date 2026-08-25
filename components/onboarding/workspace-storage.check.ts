import assert from "node:assert/strict";

import {
  WORKSPACE_STORAGE_KEY,
  clearWorkspaceSnapshot,
  loadWorkspaceSnapshot,
  saveWorkspaceSnapshot,
} from "./workspace-storage";

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
  version: 1 as const,
  savedAt: "2026-08-25T12:00:00.000Z",
  discovery: null,
  blueprint: null,
  baseline: null,
};

assert.equal(saveWorkspaceSnapshot(storage, snapshot), true);
assert.deepEqual(loadWorkspaceSnapshot(storage), snapshot);

values.set(WORKSPACE_STORAGE_KEY, "{broken");
assert.equal(loadWorkspaceSnapshot(storage), null);

clearWorkspaceSnapshot(storage);
assert.equal(values.has(WORKSPACE_STORAGE_KEY), false);

console.log("workspace storage checks passed");
