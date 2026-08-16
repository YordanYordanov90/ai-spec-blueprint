import assert from "node:assert/strict";

import { analyzeMissingInformation } from "./analyze-missing-information";
import { applyExtractedFacts } from "./apply-extracted-facts";
import {
  approveBlueprintProposal,
  blueprintHasPendingProposal,
} from "./approve-blueprint";
import { createInitialDiscoveryState } from "./apply-extracted-facts";
import { proposeProjectBlueprint } from "./propose-blueprint";

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
      {
        id: "fact-persistence",
        statement: "V1 must not use a database.",
        source: "explicit",
        topic: "persistence",
      },
    ],
  ),
);

const proposal = proposeProjectBlueprint(readyState);
const approved = approveBlueprintProposal(proposal);
const approvedAgain = approveBlueprintProposal(proposal);

assert.equal(blueprintHasPendingProposal(proposal), true);
assert.equal(blueprintHasPendingProposal(approved), false);
assert.deepEqual(approved, approvedAgain);
assert.equal(proposal.architecture[0]?.status, "proposed");
assert.equal(proposal.architecture[0]?.review.status, "proposed");
assert.equal(approved.architecture[0]?.status, "approved");
assert.equal(approved.architecture[0]?.review.status, "approved");
if (approved.architecture[0]?.review.status === "approved") {
  assert.equal(approved.architecture[0].review.approvedBy, "human");
  assert.equal(approved.architecture[0].review.proposedBy, "ai");
}
assert.equal(proposal.stack[0]?.status, "preferred-if-needed");
assert.equal(approved.stack[0]?.status, "preferred-if-needed");
assert.equal(approved.stack[0]?.review.status, "approved");
assert.notEqual(approved.stack[0]?.status, "confirmed");

const unresolvedProposal = proposeProjectBlueprint(
  analyzeMissingInformation(
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
  ),
);
const unresolvedApproved = approveBlueprintProposal(unresolvedProposal);

assert.equal(unresolvedProposal.stack[0]?.status, "unresolved");
assert.equal(unresolvedApproved.stack[0]?.status, "unresolved");
assert.equal(unresolvedApproved.stack[0]?.review.status, "unresolved");
assert.equal(unresolvedApproved.architecture[0]?.review.status, "approved");

console.log("Approve blueprint checks passed.");
