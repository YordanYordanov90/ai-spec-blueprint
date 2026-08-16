import assert from "node:assert/strict";

import { analyzeMissingInformation } from "../discovery/analyze-missing-information";
import { applyExtractedFacts } from "../discovery/apply-extracted-facts";
import { approveBlueprintProposal } from "../discovery/approve-blueprint";
import { createInitialDiscoveryState } from "../discovery/apply-extracted-facts";
import { proposeProjectBlueprint } from "../discovery/propose-blueprint";
import { generateContextPackage } from "./context-package";
import { generateApprovedContextPackage } from "./approved-package";

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

const approved = approveBlueprintProposal(proposal);
const first = generateApprovedContextPackage(approved);
const second = generateApprovedContextPackage(approved);

assert.deepEqual(first, second);
assert.deepEqual(first, generateContextPackage(approved));
assert.ok(first.some((artifact) => artifact.relativePath === "AGENTS.md"));
assert.ok(
  first.some((artifact) => artifact.relativePath === "context/architecture.md"),
);
assert.ok(first.every((artifact) => !artifact.relativePath.startsWith("/")));
assert.ok(first.every((artifact) => !artifact.relativePath.includes("..")));

console.log("Approved context package checks passed.");
