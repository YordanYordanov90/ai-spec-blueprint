import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  createNodeProjectFilesystem,
  resolveNodeProjectPath,
} from "./node-filesystem";

const root = mkdtempSync(join(tmpdir(), "blueprint-filesystem-"));
const outside = mkdtempSync(join(tmpdir(), "blueprint-outside-"));

try {
  mkdirSync(join(root, "nested"));
  writeFileSync(join(root, "nested", "inside.txt"), "inside");
  writeFileSync(join(outside, "secret.txt"), "secret");
  symlinkSync(outside, join(root, "linked"), "dir");

  const filesystem = createNodeProjectFilesystem(join(root, "."));

  assert.equal(filesystem.exists("."), true);
  assert.equal(filesystem.exists("nested"), true);
  assert.equal(filesystem.readText("nested/inside.txt"), "inside");
  assert.equal(filesystem.exists(".."), false);
  assert.equal(filesystem.exists("nested/../nested/inside.txt"), false);
  assert.throws(
    () => resolveNodeProjectPath(root, "linked/newfile.txt"),
    /symlink/,
  );
  assert.equal(filesystem.readText("linked/secret.txt"), null);
  assert.equal(filesystem.list("linked"), null);
  assert.deepEqual(filesystem.listFiles({ suffix: ".txt" }), [
    "nested/inside.txt",
  ]);
} finally {
  rmSync(root, { recursive: true, force: true });
  rmSync(outside, { recursive: true, force: true });
}

console.log("Node filesystem checks passed.");
