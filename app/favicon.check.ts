import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const favicon = readFileSync("app/favicon.ico");

assert.ok(favicon.length <= 32 * 1024);
assert.deepEqual(
  [...favicon.subarray(0, 8)],
  [137, 80, 78, 71, 13, 10, 26, 10],
);
assert.equal(favicon.readUInt32BE(16), 64);
assert.equal(favicon.readUInt32BE(20), 64);

console.log("Favicon checks passed.");
