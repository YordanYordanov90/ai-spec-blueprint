import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import type { ProjectBlueprint } from "../schemas/project-blueprint";
import { generateAgents } from "./agents";
import { generateAiWorkflowRules } from "./ai-workflow-rules";
import { generateArchitecture } from "./architecture";
import { generateCodeStandards } from "./code-standards";
import { generateContextPackage } from "./context-package";
import { runContextGenerator } from "./contract";
import { generateProgressTracker } from "./progress-tracker";
import { generateProjectOverview } from "./project-overview";
import { generateSchemasContext } from "./schemas-context";
import { generateUiContext } from "./ui-context";

const expectedPaths = [
  "AGENTS.md",
  "context/ai-workflow-rules.md",
  "context/architecture.md",
  "context/code-standards.md",
  "context/progress-tracker.md",
  "context/project-overview.md",
  "context/schemas.md",
  "context/ui-context.md",
] as const;

const blueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);

const firstRun = runContextGenerator(blueprint, generateContextPackage);
const secondRun = runContextGenerator(blueprint, generateContextPackage);

assert.equal(firstRun.length, expectedPaths.length);
assert.deepEqual(firstRun, secondRun);
assert.deepEqual(
  firstRun.map((artifact) => artifact.relativePath),
  [...expectedPaths],
);

for (const artifact of firstRun) {
  assert.equal(artifact.documentType, "markdown");
  assert.ok(artifact.content.endsWith("\n"));
}

const artifactByPath = Object.fromEntries(
  firstRun.map((artifact) => [artifact.relativePath, artifact]),
);

assert.match(artifactByPath["AGENTS.md"]?.content ?? "", /^# AGENTS\.md\n/);
assert.match(
  artifactByPath["context/project-overview.md"]?.content ?? "",
  /^# Project Overview\n/,
);
assert.match(
  artifactByPath["context/architecture.md"]?.content ?? "",
  /^# Architecture\n/,
);
assert.match(
  artifactByPath["context/schemas.md"]?.content ?? "",
  /^# Schemas and Domain Model\n/,
);
assert.match(
  artifactByPath["context/code-standards.md"]?.content ?? "",
  /^# Code Standards\n/,
);
assert.match(
  artifactByPath["context/ui-context.md"]?.content ?? "",
  /^# UI Context\n/,
);
assert.match(
  artifactByPath["context/ai-workflow-rules.md"]?.content ?? "",
  /^# AI Workflow Rules\n/,
);
assert.match(
  artifactByPath["context/progress-tracker.md"]?.content ?? "",
  /^# Progress Tracker\n/,
);

assert.deepEqual(
  artifactByPath["AGENTS.md"],
  runContextGenerator(blueprint, generateAgents)[0],
);
assert.deepEqual(
  artifactByPath["context/project-overview.md"],
  runContextGenerator(blueprint, generateProjectOverview)[0],
);
assert.deepEqual(
  artifactByPath["context/architecture.md"],
  runContextGenerator(blueprint, generateArchitecture)[0],
);
assert.deepEqual(
  artifactByPath["context/schemas.md"],
  runContextGenerator(blueprint, generateSchemasContext)[0],
);
assert.deepEqual(
  artifactByPath["context/code-standards.md"],
  runContextGenerator(blueprint, generateCodeStandards)[0],
);
assert.deepEqual(
  artifactByPath["context/ui-context.md"],
  runContextGenerator(blueprint, generateUiContext)[0],
);
assert.deepEqual(
  artifactByPath["context/ai-workflow-rules.md"],
  runContextGenerator(blueprint, generateAiWorkflowRules)[0],
);
assert.deepEqual(
  artifactByPath["context/progress-tracker.md"],
  runContextGenerator(blueprint, generateProgressTracker)[0],
);

assert.doesNotMatch(
  firstRun.map((artifact) => artifact.relativePath).join("\n"),
  /features\/current-feature\.md/,
);
assert.doesNotMatch(
  firstRun.map((artifact) => artifact.relativePath).join("\n"),
  /decisions\//,
);

const blueprintWithAi = ProjectBlueprintSchema.parse({
  ...validProjectBlueprintExample,
  ai: {
    purpose: "Draft release note summaries from approved change lists.",
    allowedResponsibilities: ["Summarize approved changes"],
    prohibitedResponsibilities: ["Publish without approval"],
    providerModelConstraints: ["Do not hardcode a model name"],
    outputValidation: "Validate structured draft fields before display.",
    fallbackErrorExpectations:
      "Surface validation failures instead of publishing a partial draft.",
    humanApprovalBoundaries: ["A human must approve publication"],
  },
});

const packageWithAi = runContextGenerator(blueprintWithAi, generateContextPackage);

assert.deepEqual(
  packageWithAi.map((artifact) => artifact.relativePath),
  [...expectedPaths],
);
assert.match(
  packageWithAi.find(
    (artifact) => artifact.relativePath === "context/ai-workflow-rules.md",
  )?.content ?? "",
  /Draft release note summaries from approved change lists/,
);
assert.doesNotMatch(
  packageWithAi
    .find((artifact) => artifact.relativePath === "AGENTS.md")
    ?.content ?? "",
  /gpt-/i,
);

assert.throws(() =>
  runContextGenerator({} as ProjectBlueprint, generateContextPackage),
);

console.log("Context package generator checks passed.");
