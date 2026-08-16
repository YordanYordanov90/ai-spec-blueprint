import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { analyzeMissingInformation } from "@/src/lib/blueprint/discovery/analyze-missing-information";
import { applyExtractedFacts } from "@/src/lib/blueprint/discovery/apply-extracted-facts";
import { approveBlueprintProposal } from "@/src/lib/blueprint/discovery/approve-blueprint";
import { createInitialDiscoveryState } from "@/src/lib/blueprint/discovery/apply-extracted-facts";
import { proposeProjectBlueprint } from "@/src/lib/blueprint/discovery/propose-blueprint";
import { generateApprovedContextPackage } from "@/src/lib/blueprint/generators/approved-package";

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

const proposal = proposeProjectBlueprint(readyState);
assert.throws(() => generateApprovedContextPackage(proposal));
const artifacts = generateApprovedContextPackage(
  approveBlueprintProposal(proposal),
);
assert.ok(artifacts.length > 0);
assert.ok(artifacts.every((artifact) => artifact.documentType === "markdown"));

const explorer = readFileSync(
  "components/files/generated-file-explorer.tsx",
  "utf8",
);
const preview = readFileSync("components/files/markdown-preview.tsx", "utf8");
const workspace = readFileSync(
  "components/onboarding/onboarding-workspace.tsx",
  "utf8",
);
const review = readFileSync("components/review/blueprint-review.tsx", "utf8");

assert.match(explorer, /Generated files/);
assert.match(explorer, /relativePath/);
assert.match(explorer, /MarkdownPreview/);
assert.doesNotMatch(explorer, /createObjectURL/);
assert.doesNotMatch(explorer, /application\/zip/);
assert.doesNotMatch(explorer, /Download package/);
assert.match(preview, /Preview/);
assert.match(preview, /<h1/);
assert.match(preview, /<h2/);
assert.match(workspace, /generateApprovedContextPackage/);
assert.match(workspace, /GeneratedFileExplorer/);
assert.match(review, /Preview generated files/);

console.log("Generated file explorer checks passed.");
