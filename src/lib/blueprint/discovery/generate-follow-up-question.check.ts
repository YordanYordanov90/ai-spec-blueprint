import assert from "node:assert/strict";

import { analyzeMissingInformation } from "./analyze-missing-information";
import { applyExtractedFacts } from "./apply-extracted-facts";
import { createInitialDiscoveryState } from "./apply-extracted-facts";
import { generateFollowUpQuestion } from "./generate-follow-up-question";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";

const emptyQuestion = generateFollowUpQuestion(
  analyzeMissingInformation(
    createInitialDiscoveryState("A small workspace for drafting release notes."),
  ),
);
const emptyQuestionAgain = generateFollowUpQuestion(
  analyzeMissingInformation(
    createInitialDiscoveryState("A small workspace for drafting release notes."),
  ),
);

assert.deepEqual(emptyQuestion, emptyQuestionAgain);
assert.equal(emptyQuestion.currentQuestion?.topic, "product-problem");
assert.equal(emptyQuestion.currentQuestion?.id, "question-gap-product-problem");
assert.deepEqual(emptyQuestion.currentQuestion?.relatedGapIds, [
  "gap-product-problem",
]);
assert.equal(emptyQuestion.readyForBlueprintProposal, false);
assert.match(
  emptyQuestion.currentQuestion?.prompt ?? "",
  /What problem does this product solve/,
);
assert.throws(() => ProjectBlueprintSchema.parse(emptyQuestion));

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
const readyQuestion = generateFollowUpQuestion(readyState);

assert.equal(readyState.readyForBlueprintProposal, true);
assert.equal(readyQuestion.currentQuestion, undefined);
assert.equal(readyQuestion.readyForBlueprintProposal, true);

const usersMissing = generateFollowUpQuestion(
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
      ],
    ),
  ),
);

assert.equal(usersMissing.currentQuestion?.topic, "users");
assert.notEqual(usersMissing.currentQuestion?.topic, "persistence");
assert.equal(usersMissing.readyForBlueprintProposal, false);

const noGaps = generateFollowUpQuestion(
  analyzeMissingInformation(
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
  ),
);

assert.deepEqual(noGaps.gaps, []);
assert.equal(noGaps.currentQuestion, undefined);
assert.equal(noGaps.readyForBlueprintProposal, true);

console.log("Follow-up question checks passed.");
