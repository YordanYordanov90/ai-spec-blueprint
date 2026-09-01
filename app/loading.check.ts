import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/loading.tsx", "utf8");

assert.match(source, /role="status"/);
assert.match(source, /aria-live="polite"/);
assert.match(source, /Preparing your blueprint workspace/);
assert.match(source, /Definition state/);
assert.match(source, /animate-pulse/);

console.log("Loading state checks passed.");
