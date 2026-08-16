import assert from "node:assert/strict";

import { createInitialDiscoveryState } from "./apply-extracted-facts";
import { analyzeMissingInformation } from "./analyze-missing-information";
import { applyExtractedFacts } from "./apply-extracted-facts";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";

const emptyAnalysis = analyzeMissingInformation(
  createInitialDiscoveryState("A small workspace for drafting release notes."),
);
const emptyAnalysisAgain = analyzeMissingInformation(
  createInitialDiscoveryState("A small workspace for drafting release notes."),
);

assert.deepEqual(emptyAnalysis, emptyAnalysisAgain);
assert.deepEqual(
  emptyAnalysis.gaps.map((gap) => gap.id),
  [
    "gap-product-problem",
    "gap-users",
    "gap-mvp-scope",
    "gap-persistence",
    "gap-authentication",
  ],
);
assert.equal(
  emptyAnalysis.gaps.filter((gap) => gap.blocking).map((gap) => gap.topic).join(","),
  "product-problem,users,mvp-scope",
);
assert.equal(emptyAnalysis.readyForBlueprintProposal, false);
assert.equal(emptyAnalysis.currentQuestion, undefined);
assert.equal(
  emptyAnalysis.completeness.find((entry) => entry.area === "product")?.status,
  "missing",
);
assert.equal(
  emptyAnalysis.completeness.find((entry) => entry.area === "stack")?.status,
  "unresolved",
);
assert.throws(() => ProjectBlueprintSchema.parse(emptyAnalysis));

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

const requiredAnalysis = analyzeMissingInformation(requiredFacts);
const requiredAnalysisAgain = analyzeMissingInformation(requiredFacts);

assert.deepEqual(requiredAnalysis, requiredAnalysisAgain);
assert.deepEqual(
  requiredAnalysis.gaps.map((gap) => gap.id),
  ["gap-persistence", "gap-authentication"],
);
assert.equal(
  requiredAnalysis.gaps.every((gap) => gap.blocking === false),
  true,
);
assert.equal(requiredAnalysis.readyForBlueprintProposal, true);
assert.equal(requiredAnalysis.currentQuestion, undefined);
assert.equal(
  requiredAnalysis.completeness.find((entry) => entry.area === "product")
    ?.status,
  "complete",
);
assert.equal(
  requiredAnalysis.completeness.find((entry) => entry.area === "users")?.status,
  "complete",
);
assert.equal(
  requiredAnalysis.completeness.find((entry) => entry.area === "goals")?.status,
  "complete",
);
assert.doesNotMatch(
  requiredAnalysis.gaps.map((gap) => gap.topic).join(","),
  /product-problem|users|mvp-scope/,
);

const allCovered = analyzeMissingInformation(
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

assert.deepEqual(allCovered.gaps, []);
assert.equal(allCovered.readyForBlueprintProposal, true);
assert.equal(
  allCovered.completeness.find((entry) => entry.area === "stack")?.status,
  "complete",
);
assert.equal(
  allCovered.completeness.find((entry) => entry.area === "security")?.status,
  "complete",
);

const staleQuestionState = analyzeMissingInformation({
  ...requiredFacts,
  gaps: [
    {
      id: "gap-users",
      topic: "users",
      question: "Who is the first user?",
      whyItMatters: "Users shape the first blueprint.",
      blocking: true,
    },
  ],
  currentQuestion: {
    id: "question-users",
    prompt: "Who is the first user?",
    topic: "users",
    whyItMatters: "Users shape the first blueprint.",
    relatedGapIds: ["gap-users"],
  },
  readyForBlueprintProposal: false,
});

assert.equal(staleQuestionState.currentQuestion, undefined);

console.log("Missing-information analysis checks passed.");
