import assert from "node:assert/strict";

import { approveBlueprintProposal } from "../discovery/approve-blueprint";
import { buildZipArchive } from "../export/zip";
import { createBlueprintDocument } from "../export/create-context-export";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { validProjectBlueprintExample } from "../schemas/examples";
import { compareBlueprints } from "./compare-blueprints";
import { importBlueprintBytes } from "./import-blueprint";
import {
  assessBlueprintReadiness,
  assertBlueprintReadyForGeneration,
} from "./readiness";
import { reviewBlueprintDecision } from "./review-blueprint";

const approved = approveBlueprintProposal(
  ProjectBlueprintSchema.parse(validProjectBlueprintExample),
);

const proposal = ProjectBlueprintSchema.parse(validProjectBlueprintExample);
const reviewed = reviewBlueprintDecision(proposal, "stack", 1, "reject");
assert.equal(reviewed.stack[1]?.review.status, "rejected");
assert.equal(reviewed.stack[1]?.status, "rejected");

const readiness = assessBlueprintReadiness(approved);
assert.equal(readiness.status, "review");
assert(readiness.findings.some((finding) => finding.id === "non-blocking-decisions"));

const blocked = ProjectBlueprintSchema.parse({
  ...approved,
  unresolvedDecisions: approved.unresolvedDecisions.map((decision) => ({
    ...decision,
    blocking: true,
  })),
});
assert.equal(assessBlueprintReadiness(blocked).status, "blocking");
assert.throws(() => assertBlueprintReadyForGeneration(blocked));

const json = createBlueprintDocument(approved);
assert.deepEqual(
  importBlueprintBytes(new TextEncoder().encode(json.content), "blueprint.json"),
  approved,
);

const zip = buildZipArchive([json]);
assert.deepEqual(importBlueprintBytes(zip, "project.zip"), approved);
assert.throws(() => importBlueprintBytes(new TextEncoder().encode(json.content), "blueprint.txt"));
assert.throws(
  () =>
    importBlueprintBytes(
      new TextEncoder().encode(
        json.content.replace('"schemaVersion": "1.0"', '"schemaVersion": "2.0"'),
      ),
      "blueprint.json",
    ),
);

const changed = ProjectBlueprintSchema.parse({
  ...approved,
  goals: [...approved.goals, "Make project context recoverable"],
});
const diff = compareBlueprints(approved, changed);
assert.deepEqual(diff.changedSections, ["goals"]);
assert(diff.artifacts.some((artifact) => artifact.status === "changed"));

const metadataChanged = ProjectBlueprintSchema.parse({
  ...approved,
  metadata: { schemaVersion: "2.0" },
});
assert.deepEqual(compareBlueprints(approved, metadataChanged).changedSections, ["metadata"]);

console.log("lifecycle checks passed");
