import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { runContextGenerator } from "./contract";
import { generateProjectOverview } from "./project-overview";

const blueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);

const firstRun = runContextGenerator(blueprint, generateProjectOverview);
const secondRun = runContextGenerator(blueprint, generateProjectOverview);

assert.equal(firstRun.length, 1);
assert.deepEqual(firstRun, secondRun);

const [artifact] = firstRun;
assert.equal(artifact?.relativePath, "context/project-overview.md");
assert.equal(artifact?.documentType, "markdown");

const content = artifact?.content ?? "";

assert.match(content, /^# Project Overview\n/);
assert.match(content, /## Product name\n\nRelease Notes Hub\n/);
assert.match(
  content,
  /## Summary\n\nA focused workspace for drafting and publishing release notes\.\n/,
);
assert.match(
  content,
  /## Problem\n\nSmall teams lose release context across tickets, chats, and documents\.\n/,
);
assert.match(content, /### Product engineer\n/);
assert.match(content, /- Capture meaningful changes quickly\n/);
assert.match(content, /## Goals\n\n- Create reviewable release notes\n/);
assert.match(content, /## Non-goals\n\n- Replace the issue tracker\n/);
assert.match(
  content,
  /## Success criteria\n\n- A release note draft can be created from a small set of inputs\.\n/,
);
assert.ok(content.endsWith("\n"));
assert.doesNotMatch(content, /Shared domain contract/);
assert.doesNotMatch(content, /Grill Me/);

console.log("Project overview generator checks passed.");
