import assert from "node:assert/strict";

import { analyzeMissingInformation } from "../blueprint/discovery/analyze-missing-information";
import { applyExtractedFacts } from "../blueprint/discovery/apply-extracted-facts";
import { createInitialDiscoveryState } from "../blueprint/discovery/apply-extracted-facts";
import { ProjectBlueprintSchema } from "../blueprint/schemas/project-blueprint";
import {
  classifyAiError,
  proposeProjectBlueprintResult,
} from "./ai-failure";
import { extractProjectFactsResult } from "./fact-extraction";
import type { ApprovedLanguageModel } from "./model-config";

const approval = {
  approvedBy: "human" as const,
  purpose: "Extract project facts from Grill Me input",
  dataScope: ["initial-idea" as const, "discovery-state" as const],
  includesSecrets: false as const,
};

function createStubModel(
  output: unknown,
): Pick<ApprovedLanguageModel, "generateStructured"> {
  return {
    generateStructured: async (_input, _approval, schema) =>
      schema.parse(output),
  };
}

function createThrowingModel(
  error: Error,
): Pick<ApprovedLanguageModel, "generateStructured"> {
  return {
    generateStructured: async () => {
      throw error;
    },
  };
}

async function runAsyncChecks(): Promise<void> {
  const invalidOutput = await extractProjectFactsResult({
    input: {
      initialIdea: "A small workspace for drafting release notes.",
    },
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
    approval,
  });

  assert.equal(invalidOutput.ok, false);
  if (!invalidOutput.ok) {
    assert.equal(invalidOutput.error.kind, "invalid-structured-output");
    assert.doesNotMatch(invalidOutput.error.message, /sk-/);
  }

  const invalidInput = await extractProjectFactsResult({
    input: {
      initialIdea: "   ",
    },
    model: createStubModel({ facts: [] }),
    approval,
  });

  assert.equal(invalidInput.ok, false);
  if (!invalidInput.ok) {
    assert.equal(invalidInput.error.kind, "user-input-failure");
  }

  const providerFailure = await extractProjectFactsResult({
    input: {
      initialIdea: "A small workspace for drafting release notes.",
    },
    model: createThrowingModel(new Error("Provider unavailable")),
    approval,
  });

  assert.equal(providerFailure.ok, false);
  if (!providerFailure.ok) {
    assert.equal(providerFailure.error.kind, "provider-failure");
    assert.equal(providerFailure.error.message, "Provider unavailable");
  }

  const secretFailure = classifyAiError(
    new Error("Request failed with api_key=sk-secret-value"),
  );
  assert.doesNotMatch(secretFailure.message, /sk-secret-value/);
  assert.match(secretFailure.message, /\[redacted\]/);

  const unready = proposeProjectBlueprintResult(
    createInitialDiscoveryState("A small workspace for drafting release notes."),
  );

  assert.equal(unready.ok, false);
  if (!unready.ok) {
    assert.equal(unready.error.kind, "application-validation-failure");
  }
  assert.throws(() => {
    if (!unready.ok) {
      ProjectBlueprintSchema.parse(unready.error);
    }
  });

  const readyState = analyzeMissingInformation(
    applyExtractedFacts(
      createInitialDiscoveryState(
        "A small workspace for drafting release notes.",
      ),
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
          statement:
            "V1 must create reviewable release notes without auto-publishing.",
          source: "explicit",
          topic: "mvp-scope",
        },
      ],
    ),
  );

  const proposal = proposeProjectBlueprintResult(readyState);
  assert.equal(proposal.ok, true);
  if (proposal.ok) {
    assert.equal(proposal.value.architecture[0]?.review.status, "proposed");
  }

  const extracted = await extractProjectFactsResult({
    input: {
      initialIdea: "A small workspace for drafting release notes.",
    },
    model: createStubModel({
      facts: [
        {
          id: "fact-workspace",
          statement:
            "The product is a focused workspace for drafting release notes.",
          source: "explicit",
          topic: "product-problem",
        },
      ],
    }),
    approval,
  });

  assert.equal(extracted.ok, true);
  if (extracted.ok) {
    assert.equal(extracted.value.facts[0]?.source, "explicit");
  }
}

void runAsyncChecks()
  .then(() => {
    console.log("AI failure checks passed.");
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
