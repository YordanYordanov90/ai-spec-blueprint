import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const landing = readFileSync("app/page.tsx", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");

assert.match(landing, /Chat history is not a project architecture/);
assert.match(landing, /Grill Me/);
assert.match(landing, /durable/i);
assert.match(landing, /Blueprint Core/);
assert.match(landing, /CLI/);
assert.match(landing, /Start a project/);
assert.match(landing, /href="\/new"/);
assert.match(landing, /AGENTS\.md/);
assert.match(landing, /context\/architecture\.md/);
assert.doesNotMatch(landing, /Create Next App/);
assert.doesNotMatch(landing, /Unlock the magic/);
assert.doesNotMatch(landing, /gpt-/i);
assert.doesNotMatch(landing, /To get started, edit the/);
assert.doesNotMatch(layout, /Create Next App/);
assert.match(layout, /AI Spec Blueprint/);

console.log("Landing page checks passed.");
