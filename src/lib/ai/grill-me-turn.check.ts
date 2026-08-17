import assert from "node:assert/strict";

import type { ApprovedLanguageModel } from "./model-config";
import {
  advanceGrillMeTurn,
  runGrillMeAnswer,
  runGrillMeStart,
} from "./grill-me-turn";

function createStubModel(
  output: unknown,
): Pick<ApprovedLanguageModel, "generateStructured"> {
  return {
    generateStructured: async (_input, _approval, schema) => schema.parse(output),
  };
}

const idea = "A small workspace for drafting release notes.";

async function runAsyncChecks(): Promise<void> {
  const started = await runGrillMeStart({
    initialIdea: idea,
    model: createStubModel({
      facts: [
        {
          id: "fact-problem",
          statement: "Teams lose release context across tickets and chats.",
          source: "explicit",
          topic: "product-problem",
        },
      ],
    }),
  });

  assert.equal(started.ok, true);
  if (!started.ok) {
    throw new Error("Expected Grill Me start to succeed.");
  }

  assert.equal(started.value.initialIdea, idea);
  assert.equal(started.value.facts.length, 1);
  assert.equal(started.value.currentQuestion?.topic, "users");
  assert.equal(started.value.readyForBlueprintProposal, false);
  assert.match(started.value.currentQuestion?.whyItMatters ?? "", /Users shape/);

  const emptyStart = await runGrillMeStart({
    initialIdea: "   ",
    model: createStubModel({ facts: [] }),
  });

  assert.equal(emptyStart.ok, false);
  if (emptyStart.ok) {
    throw new Error("Expected empty start to fail.");
  }
  assert.equal(emptyStart.error.kind, "user-input-failure");

  const invalidOutput = await runGrillMeStart({
    initialIdea: idea,
    model: createStubModel({
      facts: [
        {
          id: "fact-invalid",
          statement: "This should not become a fact.",
          source: "guess",
          topic: "product-problem",
        },
      ],
    }),
  });

  assert.equal(invalidOutput.ok, false);
  if (invalidOutput.ok) {
    throw new Error("Expected invalid structured output to fail.");
  }
  assert.equal(invalidOutput.error.kind, "invalid-structured-output");

  const answered = await runGrillMeAnswer({
    state: started.value,
    answer: "The first user is a product engineer preparing a release.",
    model: createStubModel({
      facts: [
        {
          id: "fact-users",
          statement: "The first user is a product engineer preparing a release.",
          source: "explicit",
          topic: "users",
        },
      ],
    }),
  });

  assert.equal(answered.ok, true);
  if (!answered.ok) {
    throw new Error("Expected Grill Me answer to succeed.");
  }
  assert.equal(answered.value.facts.length, 2);
  assert.equal(answered.value.currentQuestion?.topic, "mvp-scope");
  assert.equal(
    answered.value.messages.at(-2)?.content,
    started.value.currentQuestion?.prompt,
  );

  const emptyAnswer = await runGrillMeAnswer({
    state: started.value,
    answer: " ",
    model: createStubModel({ facts: [] }),
  });
  assert.equal(emptyAnswer.ok, false);
  if (emptyAnswer.ok) {
    throw new Error("Expected empty answer to fail.");
  }
  assert.equal(emptyAnswer.error.kind, "user-input-failure");

  const invalidState = await runGrillMeAnswer({
    state: { not: "discovery" },
    answer: "A useful answer",
    model: createStubModel({ facts: [] }),
  });
  assert.equal(invalidState.ok, false);
  if (invalidState.ok) {
    throw new Error("Expected invalid state to fail.");
  }
  assert.equal(invalidState.error.kind, "user-input-failure");

  const advanced = await advanceGrillMeTurn({
    input: { initialIdea: idea },
    model: createStubModel({
      facts: [
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
    }),
    approval: {
      approvedBy: "human",
      purpose: "Extract project facts from the initial idea",
      dataScope: ["initial-idea"],
      includesSecrets: false,
    },
  });

  assert.equal(advanced.readyForBlueprintProposal, true);
  assert.equal(advanced.currentQuestion, undefined);

  const alreadyReady = await runGrillMeAnswer({
    state: advanced,
    answer: "Another answer",
    model: createStubModel({ facts: [] }),
  });
  assert.equal(alreadyReady.ok, false);
  if (alreadyReady.ok) {
    throw new Error("Expected ready discovery to reject another answer.");
  }
  assert.equal(alreadyReady.error.kind, "application-validation-failure");
}

void runAsyncChecks()
  .then(() => {
    console.log("Grill Me turn checks passed.");
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
