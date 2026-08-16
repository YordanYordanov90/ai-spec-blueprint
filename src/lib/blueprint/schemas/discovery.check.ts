import assert from "node:assert/strict";

import {
  invalidDuplicateFactDiscoveryExample,
  invalidReadyWithBlockingGapExample,
  invalidUnknownRelatedGapExample,
  readyDiscoveryStateExample,
  validDiscoveryStateExample,
} from "./discovery-examples";
import {
  DiscoveryStateSchema,
  DraftDecisionSchema,
} from "./discovery";
import { ProjectBlueprintSchema } from "./project-blueprint";
import { validProjectBlueprintExample } from "./examples";

const parsed = DiscoveryStateSchema.parse(validDiscoveryStateExample);

assert.equal(parsed.initialIdea, validDiscoveryStateExample.initialIdea);
assert.equal(parsed.facts[0]?.source, "explicit");
assert.equal(parsed.draftDecisions[0]?.status, "proposed");
assert.equal(parsed.readyForBlueprintProposal, false);
assert.equal(parsed.currentQuestion?.id, "question-auth");

const ready = DiscoveryStateSchema.parse(readyDiscoveryStateExample);
assert.equal(ready.readyForBlueprintProposal, true);
assert.equal(ready.currentQuestion, undefined);
assert.equal(ready.gaps.some((gap) => gap.blocking), false);

assert.throws(() =>
  DiscoveryStateSchema.parse({
    ...validDiscoveryStateExample,
    initialIdea: "   ",
  }),
);
assert.throws(() =>
  DiscoveryStateSchema.parse({
    ...validDiscoveryStateExample,
    facts: [
      {
        ...validDiscoveryStateExample.facts[0],
        statement: "",
      },
    ],
  }),
);
assert.throws(() =>
  DiscoveryStateSchema.parse(invalidDuplicateFactDiscoveryExample),
);
assert.throws(() =>
  DiscoveryStateSchema.parse(invalidReadyWithBlockingGapExample),
);
assert.throws(() =>
  DiscoveryStateSchema.parse(invalidUnknownRelatedGapExample),
);
assert.throws(() =>
  DiscoveryStateSchema.parse({
    ...validDiscoveryStateExample,
    completeness: [
      { area: "product", status: "partial" },
      { area: "product", status: "complete" },
    ],
  }),
);
assert.throws(() =>
  DiscoveryStateSchema.parse({
    ...readyDiscoveryStateExample,
    currentQuestion: {
      id: "question-late",
      prompt: "Should this still be asked?",
      topic: "ui",
      whyItMatters: "A current question means discovery is not finished.",
      relatedGapIds: ["gap-accent-color"],
    },
  }),
);

assert.throws(() =>
  DraftDecisionSchema.parse({
    id: "draft-approved",
    topic: "persistence",
    proposal: "Use a database now.",
    status: "approved",
    proposedBy: "ai",
  }),
);

assert.throws(() =>
  DiscoveryStateSchema.parse(validProjectBlueprintExample),
);
assert.throws(() =>
  ProjectBlueprintSchema.parse(validDiscoveryStateExample),
);

console.log("Discovery state schema checks passed.");
