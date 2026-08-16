import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { analyzeMissingInformation } from "@/src/lib/blueprint/discovery/analyze-missing-information";
import { applyExtractedFacts } from "@/src/lib/blueprint/discovery/apply-extracted-facts";
import {
  approveBlueprintProposal,
  blueprintHasPendingProposal,
} from "@/src/lib/blueprint/discovery/approve-blueprint";
import { createInitialDiscoveryState } from "@/src/lib/blueprint/discovery/apply-extracted-facts";
import { proposeProjectBlueprint } from "@/src/lib/blueprint/discovery/propose-blueprint";

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
assert.equal(blueprintHasPendingProposal(proposal), true);
assert.equal(approveBlueprintProposal(proposal).architecture[0]?.review.status, "approved");

const review = readFileSync("components/review/blueprint-review.tsx", "utf8");
const workspace = readFileSync(
  "components/onboarding/onboarding-workspace.tsx",
  "utf8",
);
const grillMe = readFileSync(
  "components/grill-me/grill-me-interface.tsx",
  "utf8",
);

assert.match(review, /Approve blueprint/);
assert.match(review, /Proposed/);
assert.match(review, /Approved by human/);
assert.match(review, /Product/);
assert.match(review, /Users/);
assert.match(review, /Goals/);
assert.match(review, /Stack/);
assert.match(review, /Architecture/);
assert.match(review, /Domain/);
assert.match(review, /Security/);
assert.match(review, /Guardrails/);
assert.match(review, /Unresolved decisions/);
assert.match(review, /review.status/);
assert.doesNotMatch(review, /generateContextPackage/);
assert.match(review, /Preview generated files/);
assert.match(workspace, /proposeProjectBlueprintResult/);
assert.match(workspace, /approveBlueprintProposal/);
assert.match(workspace, /BlueprintReview/);
assert.match(grillMe, /Review blueprint proposal/);

console.log("Blueprint review checks passed.");
