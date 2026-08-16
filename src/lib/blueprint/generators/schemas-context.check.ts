import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { runContextGenerator } from "./contract";
import { generateSchemasContext } from "./schemas-context";

const blueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);

const firstRun = runContextGenerator(blueprint, generateSchemasContext);
const secondRun = runContextGenerator(blueprint, generateSchemasContext);

assert.equal(firstRun.length, 1);
assert.deepEqual(firstRun, secondRun);

const [artifact] = firstRun;
assert.equal(artifact?.relativePath, "context/schemas.md");
assert.equal(artifact?.documentType, "markdown");

const content = artifact?.content ?? "";

assert.match(content, /^# Schemas and Domain Model\n/);
assert.match(content, /- Schema version: 1\.0\n/);
assert.match(content, /### Release note\n/);
assert.match(
  content,
  /Purpose: The reviewable description of a product release\.\n/,
);
assert.match(content, /- Persistence: unknown\n/);
assert.match(content, /- Sensitivity: internal\n/);
assert.match(content, /Attributes:\n\n- title\n- summary\n- status\n/);
assert.match(content, /### F001 — Create a release note\n/);
assert.match(content, /- Status: planned\n/);
assert.match(
  content,
  /### Should drafts be recoverable after a browser refresh\?\n/,
);
assert.match(content, /- Blocking: no\n/);
assert.doesNotMatch(content, /Grill Me/);
assert.doesNotMatch(content, /z\.object/);
assert.ok(content.endsWith("\n"));

console.log("Schemas context generator checks passed.");
