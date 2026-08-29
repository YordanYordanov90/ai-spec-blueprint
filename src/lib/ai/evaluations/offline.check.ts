import assert from "node:assert/strict";

import { AI_QUALITY_EVALUATION_CORPUS } from "./corpus";
import { runOfflineEvaluation } from "./offline";

const run = runOfflineEvaluation();
const logoResult = run.results.find(
  (result) => result.scenarioId === "ai-logo-creator",
);
const incompleteResult = run.results.find(
  (result) => result.scenarioId === "incomplete-idea",
);
const contradictionResult = run.results.find(
  (result) => result.scenarioId === "contradictory-answers",
);

assert.equal(run.corpusVersion, AI_QUALITY_EVALUATION_CORPUS.version);
assert.equal(run.results.length, AI_QUALITY_EVALUATION_CORPUS.scenarios.length);
assert.ok(logoResult);
assert.ok(incompleteResult);
assert.ok(contradictionResult);

assert.equal(logoResult.passed, false);
assert.ok(
  logoResult.issues.some((item) => item.id === "product-naming"),
);
assert.ok(
  logoResult.issues.some((item) => item.id === "section-content"),
);
assert.ok(
  logoResult.issues.some((item) => item.id === "ai-section-coverage"),
);
assert.ok(
  logoResult.issues.some((item) => item.id === "stack-decision-coverage"),
);
assert.ok(
  logoResult.issues.some((item) => item.id === "project-specificity"),
);
assert.equal(incompleteResult.proposalGenerated, false);
assert.ok(
  incompleteResult.issues.some((item) => item.id === "material-gap-recall"),
);
assert.equal(contradictionResult.passed, false);
assert.ok(
  contradictionResult.issues.some((item) => item.id === "contradiction-detection"),
);

console.log("AI quality offline evaluation checks passed.");
