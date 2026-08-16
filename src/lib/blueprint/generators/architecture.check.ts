import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { generateArchitecture } from "./architecture";
import { runContextGenerator } from "./contract";

const blueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);

const firstRun = runContextGenerator(blueprint, generateArchitecture);
const secondRun = runContextGenerator(blueprint, generateArchitecture);

assert.equal(firstRun.length, 1);
assert.deepEqual(firstRun, secondRun);

const [artifact] = firstRun;
assert.equal(artifact?.relativePath, "context/architecture.md");
assert.equal(artifact?.documentType, "markdown");

const content = artifact?.content ?? "";

assert.match(content, /^# Architecture\n/);
assert.match(content, /### web framework\n/);
assert.match(content, /- Choice: Next\.js\n/);
assert.match(content, /- Status: confirmed\n/);
assert.match(content, /### persistence\n/);
assert.match(content, /- Choice: PostgreSQL with Drizzle\n/);
assert.match(content, /- Status: preferred-if-needed\n/);
assert.match(content, /- Review: proposed\n/);
assert.match(content, /### Shared domain contract\n/);
assert.match(content, /- Status: approved\n/);
assert.match(content, /- Requires ADR: yes\n/);
assert.match(content, /- Review: approved\n/);
assert.match(content, /- Approved by: human\n/);
assert.match(content, /### One active feature\n/);
assert.match(content, /- ID: scope-one-feature\n/);
assert.match(content, /- Source: universal\n/);
assert.match(
  content,
  /## Security constraints\n\n- Do not expose unpublished release notes publicly\n/,
);
assert.doesNotMatch(content, /install Drizzle now/i);
assert.doesNotMatch(content, /```text/);
assert.ok(content.endsWith("\n"));

console.log("Architecture generator checks passed.");
