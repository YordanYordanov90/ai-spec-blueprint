import assert from "node:assert/strict";

import { validDiscoveryStateExample } from "../blueprint/schemas/discovery-examples";
import { ProjectBlueprintSchema } from "../blueprint/schemas/project-blueprint";
import { validProjectBlueprintExample } from "../blueprint/schemas/examples";
import {
  applyExtractedFacts,
  createInitialDiscoveryState,
} from "../blueprint/discovery/apply-extracted-facts";
import { DiscoveryStateSchema } from "../blueprint/schemas/discovery";
import {
  extractProjectFacts,
  ExtractedFactsOutputSchema,
  ProjectFactExtractionInputSchema,
} from "./fact-extraction";
import type { ApprovedLanguageModel } from "./model-config";

const extractedFacts = [
  {
    id: "fact-workspace",
    statement: "The product is a focused workspace for drafting release notes.",
    source: "explicit" as const,
    topic: "product-problem" as const,
  },
  {
    id: "fact-no-auto-publish",
    statement: "Release notes must not publish automatically.",
    source: "detected" as const,
    topic: "mvp-scope" as const,
  },
];

const initialState = createInitialDiscoveryState(
  "A small workspace for drafting release notes.",
);

assert.equal(initialState.facts.length, 0);
assert.equal(initialState.readyForBlueprintProposal, false);
assert.equal(initialState.gaps.length, 0);

const applied = applyExtractedFacts(initialState, extractedFacts);
const appliedAgain = applyExtractedFacts(initialState, extractedFacts);

assert.deepEqual(applied, appliedAgain);
assert.equal(applied.facts.length, 2);
assert.equal(applied.facts[0]?.source, "explicit");
assert.equal(applied.facts[1]?.source, "detected");
assert.equal(applied.gaps.length, 0);
assert.equal(applied.readyForBlueprintProposal, false);
assert.throws(() => ProjectBlueprintSchema.parse(applied));

const merged = applyExtractedFacts(applied, [
  extractedFacts[0],
  {
    id: "fact-reviewer",
    statement: "A reviewer must approve a draft before publication.",
    source: "explicit",
    topic: "core-flows",
  },
]);

assert.equal(merged.facts.length, 3);
assert.equal(
  merged.facts.filter((fact) => fact.id === "fact-workspace").length,
  1,
);

assert.throws(() =>
  applyExtractedFacts(initialState, [
    extractedFacts[0],
    { ...extractedFacts[0], statement: "A different statement." },
  ]),
);
assert.throws(() =>
  applyExtractedFacts(applied, [
    { ...extractedFacts[0], statement: "A different statement." },
  ]),
);
assert.throws(() =>
  applyExtractedFacts(initialState, [
    {
      id: "fact-bad",
      statement: "   ",
      source: "explicit",
      topic: "product-problem",
    },
  ]),
);
assert.throws(() =>
  applyExtractedFacts(initialState, [
    {
      id: "fact-bad-source",
      statement: "This is not a valid source.",
      source: "approved",
      topic: "product-problem",
    },
  ]),
);
assert.throws(() =>
  applyExtractedFacts(initialState, {
    facts: extractedFacts,
  }),
);

function createStubModel(
  output: unknown,
): Pick<ApprovedLanguageModel, "generateStructured"> {
  return {
    generateStructured: async (_input, _approval, schema) => schema.parse(output),
  };
}

const approval = {
  approvedBy: "human" as const,
  purpose: "Extract project facts from Grill Me input",
  dataScope: ["initial-idea" as const, "discovery-state" as const],
  includesSecrets: false as const,
};

async function runAsyncChecks(): Promise<void> {
  const extractedState = await extractProjectFacts({
    input: {
      initialIdea: "A small workspace for drafting release notes.",
    },
    model: createStubModel({ facts: extractedFacts }),
    approval,
  });

  assert.equal(extractedState.messages[0]?.content, extractedState.initialIdea);
  assert.deepEqual(
    extractedState.facts.map((fact) => fact.source),
    ["explicit", "detected"],
  );
  assert.equal(extractedState.gaps.length, 0);
  assert.equal(extractedState.draftDecisions.length, 0);
  assert.doesNotMatch(JSON.stringify(extractedState), /ProjectBlueprint/);

  const continued = await extractProjectFacts({
    input: {
      initialIdea: extractedState.initialIdea,
      existingState: extractedState,
      additionalUserInput: "A reviewer must approve a draft before publication.",
    },
    model: createStubModel({
      facts: [
        {
          id: "fact-reviewer",
          statement: "A reviewer must approve a draft before publication.",
          source: "explicit",
          topic: "core-flows",
        },
      ],
    }),
    approval,
  });

  assert.equal(
    continued.messages.at(-1)?.content,
    "A reviewer must approve a draft before publication.",
  );
  assert.equal(continued.facts.length, 3);

  await assert.rejects(() =>
    extractProjectFacts({
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
    }),
  );

  await assert.rejects(() =>
    extractProjectFacts({
      input: {
        initialIdea: "A small workspace for drafting release notes.",
      },
      model: createStubModel({
        facts: extractedFacts,
        extra: true,
      }),
      approval,
    }),
  );

  await assert.rejects(() =>
    extractProjectFacts({
      input: {
        initialIdea: "   ",
      },
      model: createStubModel({ facts: extractedFacts }),
      approval,
    }),
  );

  assert.throws(() =>
    ExtractedFactsOutputSchema.parse(validProjectBlueprintExample),
  );
  assert.throws(() =>
    ProjectFactExtractionInputSchema.parse({
      initialIdea: "A project idea",
      existingState: validDiscoveryStateExample,
      unexpected: true,
    }),
  );
  assert.ok(
    DiscoveryStateSchema.parse(extractedState).facts.every(
      (fact) => fact.source === "explicit" || fact.source === "detected",
    ),
  );
}

void runAsyncChecks()
  .then(() => {
    console.log("Fact extraction checks passed.");
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
