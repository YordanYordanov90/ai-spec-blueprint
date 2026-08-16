import assert from "node:assert/strict";

import { analyzeMissingInformation } from "./analyze-missing-information";
import { applyExtractedFacts } from "./apply-extracted-facts";
import { createInitialDiscoveryState } from "./apply-extracted-facts";
import { proposeProjectBlueprint } from "./propose-blueprint";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";

const unreadyState = analyzeMissingInformation(
  createInitialDiscoveryState("A small workspace for drafting release notes."),
);

assert.equal(unreadyState.readyForBlueprintProposal, false);
assert.throws(() => proposeProjectBlueprint(unreadyState));

const requiredFacts = applyExtractedFacts(
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
);

const readyState = analyzeMissingInformation(requiredFacts);
const firstProposal = proposeProjectBlueprint(readyState);
const secondProposal = proposeProjectBlueprint(readyState);

assert.equal(readyState.readyForBlueprintProposal, true);
assert.deepEqual(firstProposal, secondProposal);
assert.deepEqual(firstProposal, ProjectBlueprintSchema.parse(firstProposal));
assert.equal(
  firstProposal.product.problem,
  "Teams lose release context across tickets and chats.",
);
assert.equal(firstProposal.stack[0]?.status, "unresolved");
assert.equal(firstProposal.stack[0]?.review.status, "unresolved");
assert.equal(firstProposal.architecture[0]?.status, "proposed");
assert.equal(firstProposal.architecture[0]?.review.status, "proposed");
assert.notEqual(firstProposal.architecture[0]?.review.status, "approved");
assert.equal(firstProposal.features[0]?.status, "planned");
assert.match(
  firstProposal.unresolvedDecisions.map((decision) => decision.question).join("\n"),
  /durable storage/,
);
assert.match(
  firstProposal.unresolvedDecisions.map((decision) => decision.question).join("\n"),
  /signed-in users/,
);
assert.notEqual(firstProposal.stack[0]?.status, "confirmed");
assert.notEqual(firstProposal.stack[0]?.review.status, "approved");

const coveredState = analyzeMissingInformation(
  applyExtractedFacts(requiredFacts, [
    {
      id: "fact-persistence",
      statement: "V1 does not require a database.",
      source: "explicit",
      topic: "persistence",
    },
    {
      id: "fact-auth",
      statement: "V1 does not require authentication.",
      source: "explicit",
      topic: "authentication",
    },
  ]),
);

const coveredProposal = proposeProjectBlueprint(coveredState);

assert.equal(coveredProposal.stack[0]?.status, "preferred-if-needed");
assert.equal(coveredProposal.stack[0]?.review.status, "proposed");
assert.equal(coveredProposal.unresolvedDecisions.length, 0);
assert.match(
  coveredProposal.security.constraints.join("\n"),
  /V1 does not require authentication/,
);
assert.equal(coveredProposal.domain[0]?.persistenceExpectation, "unknown");

console.log("Blueprint proposal checks passed.");
