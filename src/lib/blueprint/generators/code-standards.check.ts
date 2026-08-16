import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { generateCodeStandards } from "./code-standards";
import { runContextGenerator } from "./contract";

const blueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);

const firstRun = runContextGenerator(blueprint, generateCodeStandards);
const secondRun = runContextGenerator(blueprint, generateCodeStandards);

assert.equal(firstRun.length, 1);
assert.deepEqual(firstRun, secondRun);

const [artifact] = firstRun;
assert.equal(artifact?.relativePath, "context/code-standards.md");
assert.equal(artifact?.documentType, "markdown");

const content = artifact?.content ?? "";

const unapprovedBlueprint = ProjectBlueprintSchema.parse({
  ...validProjectBlueprintExample,
  architecture: [
    {
      ...validProjectBlueprintExample.architecture[0],
      status: "proposed",
      constraints: ["No unapproved architecture constraint"],
      review: {
        status: "proposed",
        proposedBy: "ai",
      },
    },
  ],
});
const unapprovedContent =
  runContextGenerator(unapprovedBlueprint, generateCodeStandards)[0]?.content ??
  "";

assert.match(content, /^# Code Standards\n/);
assert.match(content, /### web framework\n/);
assert.match(content, /- Status: confirmed\n/);
assert.match(content, /- Use the App Router\n/);
assert.match(content, /### persistence\n/);
assert.match(content, /- Status: preferred-if-needed\n/);
assert.match(content, /### Shared domain contract\n/);
assert.match(content, /- No React or Next\.js imports in Blueprint Core\n/);
assert.doesNotMatch(unapprovedContent, /No unapproved architecture constraint/);
assert.match(
  content,
  /Strategy: Verify domain invariants and critical review flows before release\.\n/,
);
assert.match(content, /Required checks:\n\n- TypeScript\n- Lint\n/);
assert.match(content, /### One active feature\n/);
assert.match(
  content,
  /## Security constraints\n\n- Do not expose unpublished release notes publicly\n/,
);
assert.doesNotMatch(content, /Avoid `any`/);
assert.doesNotMatch(content, /install Drizzle now/i);
assert.ok(content.endsWith("\n"));

console.log("Code standards generator checks passed.");
