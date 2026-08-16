import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import type { ProjectBlueprint } from "../schemas/project-blueprint";
import { runContextGenerator, type ContextGenerator } from "./contract";
import { representativeContextGenerator } from "./representative-generator";

const blueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);

const firstRun = runContextGenerator(blueprint, representativeContextGenerator);
const secondRun = runContextGenerator(blueprint, representativeContextGenerator);

assert.deepEqual(firstRun, secondRun);
assert.deepEqual(
  firstRun.map((artifact) => artifact.relativePath),
  ["generator-contract/name.txt", "generator-contract/summary.txt"],
);
assert.equal(firstRun[0]?.content, `name=${blueprint.product.name}\n`);
assert.equal(firstRun[1]?.content, `summary=${blueprint.product.summary}\n`);

const invalidPathGenerator: ContextGenerator = () => [
  {
    relativePath: "/tmp/escape.md",
    content: "escaped",
    documentType: "markdown",
  },
];

const traversalPathGenerator: ContextGenerator = () => [
  {
    relativePath: "context/../secret.md",
    content: "escaped",
    documentType: "markdown",
  },
];

const emptyContentGenerator: ContextGenerator = () => [
  {
    relativePath: "generator-contract/empty.txt",
    content: "",
    documentType: "text",
  },
];

const duplicatePathGenerator: ContextGenerator = () => [
  {
    relativePath: "generator-contract/name.txt",
    content: "first",
    documentType: "text",
  },
  {
    relativePath: "generator-contract/name.txt",
    content: "second",
    documentType: "text",
  },
];

assert.throws(() => runContextGenerator(blueprint, invalidPathGenerator));
assert.throws(() => runContextGenerator(blueprint, traversalPathGenerator));
assert.throws(() => runContextGenerator(blueprint, emptyContentGenerator));
assert.throws(() => runContextGenerator(blueprint, duplicatePathGenerator));
assert.throws(() =>
  runContextGenerator(
    {} as ProjectBlueprint,
    representativeContextGenerator,
  ),
);

console.log("Generator contract checks passed.");
