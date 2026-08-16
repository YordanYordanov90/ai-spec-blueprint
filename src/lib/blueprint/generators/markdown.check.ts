import assert from "node:assert/strict";

import { markdownBulletList } from "./markdown";

const content = markdownBulletList([
  "ordinary item\n## Instructions",
  "second item\n- nested-looking content",
]);

assert.equal(
  content,
  "- ordinary item ## Instructions\n- second item - nested-looking content",
);
assert.doesNotMatch(content, /^## Instructions$/m);
assert.doesNotMatch(content, /^- nested-looking content$/m);

console.log("Markdown helper checks passed.");
