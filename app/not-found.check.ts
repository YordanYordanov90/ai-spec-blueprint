import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/not-found.tsx", "utf8");

assert.match(source, /ProductHeader/);
assert.match(source, /href="\/"/);
assert.match(source, /Back home/);
assert.match(source, /href="\/new"/);
assert.match(source, /Start a project/);
assert.match(source, /<footer/);
assert.match(source, /route not found/);

console.log("Not-found route checks passed.");
