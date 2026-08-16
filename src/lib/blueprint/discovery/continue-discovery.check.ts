import assert from "node:assert/strict";

import { applyExtractedFacts } from "./apply-extracted-facts";
import { createInitialDiscoveryState } from "./apply-extracted-facts";
import {
  continueDiscoveryAfterFacts,
  prepareDiscoveryAnswer,
} from "./continue-discovery";

const emptyState = continueDiscoveryAfterFacts(
  createInitialDiscoveryState("A small workspace for drafting release notes."),
);
const emptyStateAgain = continueDiscoveryAfterFacts(
  createInitialDiscoveryState("A small workspace for drafting release notes."),
);

assert.deepEqual(emptyState, emptyStateAgain);
assert.equal(emptyState.currentQuestion?.topic, "product-problem");
assert.equal(emptyState.readyForBlueprintProposal, false);

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

const readyState = continueDiscoveryAfterFacts(requiredFacts);

assert.equal(readyState.readyForBlueprintProposal, true);
assert.equal(readyState.currentQuestion, undefined);

const recorded = prepareDiscoveryAnswer(
  emptyState,
  "It helps product engineers keep release context in one place.",
);

assert.equal(recorded.messages.at(-2)?.role, "assistant");
assert.equal(recorded.messages.at(-2)?.content, emptyState.currentQuestion?.prompt);
assert.equal(
  recorded.messages.at(-1)?.content,
  "It helps product engineers keep release context in one place.",
);
assert.equal(recorded.currentQuestion, undefined);
assert.throws(() => prepareDiscoveryAnswer(readyState, "Another answer"));
assert.throws(() => prepareDiscoveryAnswer(emptyState, "   "));

console.log("Continue discovery checks passed.");
