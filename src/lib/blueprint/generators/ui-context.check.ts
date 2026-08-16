import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { runContextGenerator } from "./contract";
import { generateUiContext } from "./ui-context";

const blueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);

const firstRun = runContextGenerator(blueprint, generateUiContext);
const secondRun = runContextGenerator(blueprint, generateUiContext);

assert.equal(firstRun.length, 1);
assert.deepEqual(firstRun, secondRun);

const [artifact] = firstRun;
assert.equal(artifact?.relativePath, "context/ui-context.md");
assert.equal(artifact?.documentType, "markdown");

const content = artifact?.content ?? "";

assert.match(content, /^# UI Context\n/);
assert.match(content, /## Product character\n\nPrecise and calm\n/);
assert.match(
  content,
  /## Visual direction\n\nA dark-forward developer tool with readable information blocks\.\n/,
);
assert.match(content, /- Keep review state visible\n/);
assert.match(
  content,
  /## Navigation\n\nA primary workspace with section-level navigation\.\n/,
);
assert.match(content, /## Responsive behavior\n\nStack review panels on smaller screens\.\n/);
assert.match(content, /- Keyboard-accessible controls\n/);
assert.match(
  content,
  /## Component strategy\n\nUse small composable components with a shared token system\.\n/,
);
assert.match(
  content,
  /## Unresolved branding choices\n\n- Final accent color\n/,
);
assert.doesNotMatch(content, /AI Blueprint/);
assert.doesNotMatch(content, /#0[a-fA-F0-9]{5}/);
assert.ok(content.endsWith("\n"));

console.log("UI context generator checks passed.");
