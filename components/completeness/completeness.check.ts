import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CompletenessAreaSchema } from "@/src/lib/blueprint/schemas/discovery";
import { analyzeMissingInformation } from "@/src/lib/blueprint/discovery/analyze-missing-information";
import { applyExtractedFacts } from "@/src/lib/blueprint/discovery/apply-extracted-facts";
import { createInitialDiscoveryState } from "@/src/lib/blueprint/discovery/apply-extracted-facts";

import { completenessRows } from "./completeness-rows";

const unassessed = completenessRows([]);
assert.equal(unassessed.length, CompletenessAreaSchema.options.length);
assert.ok(unassessed.every((row) => row.status === "not-assessed"));
assert.ok(unassessed.every((row) => row.statusLabel === "Not assessed"));
assert.deepEqual(
  unassessed.map((row) => row.area),
  [...CompletenessAreaSchema.options],
);

const analyzed = analyzeMissingInformation(
  applyExtractedFacts(
    createInitialDiscoveryState("A small workspace for drafting release notes."),
    [
      {
        id: "fact-problem",
        statement: "Teams lose release context across tickets and chats.",
        source: "explicit",
        topic: "product-problem",
      },
    ],
  ),
);

const rows = completenessRows(analyzed.completeness);
const product = rows.find((row) => row.area === "product");
const stack = rows.find((row) => row.area === "stack");
const users = rows.find((row) => row.area === "users");

assert.equal(product?.status, "complete");
assert.equal(product?.statusLabel, "Complete");
assert.equal(users?.status, "missing");
assert.equal(users?.statusLabel, "Missing");
assert.equal(stack?.status, "unresolved");
assert.equal(stack?.statusLabel, "Unresolved");
assert.ok(rows.some((row) => row.statusLabel === "Complete"));
assert.ok(rows.some((row) => row.statusLabel === "Missing"));
assert.ok(rows.some((row) => row.statusLabel === "Unresolved"));

const page = readFileSync("app/new/page.tsx", "utf8");
const workspace = readFileSync(
  "components/onboarding/onboarding-workspace.tsx",
  "utf8",
);
const panel = readFileSync(
  "components/completeness/completeness-panel.tsx",
  "utf8",
);
const rowSource = readFileSync(
  "components/completeness/completeness-rows.ts",
  "utf8",
);

assert.doesNotMatch(page, /["']use client["']/);
assert.match(page, /OnboardingWorkspace/);
assert.match(workspace, /CompletenessPanel/);
assert.match(workspace, /state\?\.completeness/);
assert.match(rowSource, /Complete/);
assert.match(rowSource, /Partial/);
assert.match(rowSource, /Missing/);
assert.match(rowSource, /Unresolved/);
assert.match(rowSource, /Not assessed/);
assert.match(panel, /statusLabel/);
assert.match(panel, /statusMarks/);
assert.doesNotMatch(panel, /generateContextPackage/);
assert.doesNotMatch(panel, /proposeProjectBlueprint/);

console.log("Completeness panel checks passed.");
