import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/error.tsx", "utf8");

assert.match(source, /"use client"/);
assert.match(source, /retry/);
assert.match(source, /Try again/);
assert.match(source, /Back home/);
assert.match(source, /role="alert"/);

const globalSource = readFileSync("app/global-error.tsx", "utf8");

assert.match(globalSource, /<html lang="en"/);
assert.match(globalSource, /Try again/);
assert.match(globalSource, /Back home/);

console.log("Error boundary checks passed.");
