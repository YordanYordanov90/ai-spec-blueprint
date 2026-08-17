import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { approveBlueprintProposal } from "../discovery/approve-blueprint";
import { proposeProjectBlueprint } from "../discovery/propose-blueprint";
import { analyzeMissingInformation } from "../discovery/analyze-missing-information";
import {
  applyExtractedFacts,
  createInitialDiscoveryState,
} from "../discovery/apply-extracted-facts";
import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { createMemoryFilesystem } from "../project-filesystem";
import {
  BLUEPRINT_DOCUMENT_PATH,
  createContextExport,
  slugifyExportName,
} from "./create-context-export";
import { planArtifactWrite } from "./plan-artifact-write";
import { resolveArtifactPath } from "./safe-path";
import { buildZipArchive, crc32 } from "./zip";

const readyState = analyzeMissingInformation(
  applyExtractedFacts(
    createInitialDiscoveryState("A small workspace for drafting release notes."),
    [
      {
        id: "fact-problem",
        statement: "Teams lose release context across tickets and chats.",
        source: "explicit",
        topic: "product-problem",
      },
      {
        id: "fact-users",
        statement: "The first user is a product engineer preparing a release.",
        source: "explicit",
        topic: "users",
      },
      {
        id: "fact-scope",
        statement: "V1 must create reviewable release notes without auto-publishing.",
        source: "explicit",
        topic: "mvp-scope",
      },
    ],
  ),
);

assert.doesNotMatch(
  readFileSync("src/lib/blueprint/export/safe-path.ts", "utf8"),
  /node:path/,
);

const proposal = proposeProjectBlueprint(readyState);
assert.throws(() => createContextExport(proposal));

const approved = approveBlueprintProposal(proposal);
const first = createContextExport(approved);
const second = createContextExport(approved);

assert.deepEqual(first.filename, second.filename);
assert.deepEqual(first.files, second.files);
assert.deepEqual(first.zipBytes, second.zipBytes);
assert.equal(first.filename, `${slugifyExportName(approved.product.name)}-context.zip`);
assert.match(first.filename, /-context\.zip$/);
assert.ok(first.files.some((file) => file.relativePath === "AGENTS.md"));
assert.ok(
  first.files.some((file) => file.relativePath === BLUEPRINT_DOCUMENT_PATH),
);
assert.match(
  first.files.find((file) => file.relativePath === BLUEPRINT_DOCUMENT_PATH)
    ?.content ?? "",
  /"schemaVersion": "1.0"/,
);
assert.ok(first.zipBytes.byteLength > 100);
assert.equal(first.zipBytes[0], 0x50);
assert.equal(first.zipBytes[1], 0x4b);

const example = ProjectBlueprintSchema.parse(validProjectBlueprintExample);
assert.equal(slugifyExportName(example.product.name), "release-notes-hub");

assert.equal(
  resolveArtifactPath("/tmp/export-root", "context/project-overview.md"),
  "/tmp/export-root/context/project-overview.md",
);
assert.throws(() => resolveArtifactPath("/tmp/export-root", "../secret.md"));
assert.throws(() => resolveArtifactPath("/tmp/export-root", "/etc/passwd"));

const existing = createMemoryFilesystem({
  "AGENTS.md": "# existing\n",
});
const blocked = planArtifactWrite(existing, first.files);
assert.ok(blocked.blocked.includes("AGENTS.md"));
assert.throws(() => {
  if (blocked.blocked.length > 0) {
    throw new Error("blocked");
  }
});

const forced = planArtifactWrite(existing, first.files, { force: true });
assert.equal(forced.blocked.length, 0);
assert.ok(forced.actions.some((action) => action.status === "overwrite"));

const bytes = new TextEncoder().encode("hello");
assert.equal(crc32(bytes), 0x3610a686);
assert.deepEqual(
  buildZipArchive(first.files.slice(0, 1)),
  buildZipArchive(first.files.slice(0, 1)),
);

console.log("Context export checks passed.");
