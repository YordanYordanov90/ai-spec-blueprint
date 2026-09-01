import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const favicon = readFileSync("app/favicon.ico");

assert.ok(favicon.length <= 32 * 1024);
assert.deepEqual(
  [...favicon.subarray(0, 6)],
  [0, 0, 1, 0, 1, 0],
);
assert.equal(favicon.readUInt8(6), 64);
assert.equal(favicon.readUInt8(7), 64);
assert.equal(favicon.readUInt32LE(18), 22);
assert.equal(favicon.readUInt8(22 + 25), 6);
assert.deepEqual(
  [...favicon.subarray(22, 30)],
  [137, 80, 78, 71, 13, 10, 26, 10],
);

console.log("Favicon checks passed.");
