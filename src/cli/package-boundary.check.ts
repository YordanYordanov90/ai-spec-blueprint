import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { CLI_HELP, parseCliArgs } from "./parse-args";

function collectFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return collectFiles(path);
    }

    return /\.(ts|mts|js|mjs)$/.test(entry) ? [path] : [];
  });
}

const files = collectFiles("src/cli");

for (const file of files) {
  const source = readFileSync(file, "utf8");
  assert.doesNotMatch(source, /from ["']react["']/);
  assert.doesNotMatch(source, /from ["']react-dom/);
  assert.doesNotMatch(source, /from ["']next(\/|"|')/);
  assert.doesNotMatch(source, /from ["']@\/app\//);
  assert.doesNotMatch(source, /from ["']@\/components\//);
}

assert.match(CLI_HELP, /init/);
assert.match(CLI_HELP, /generate/);
assert.match(CLI_HELP, /feature/);
assert.match(CLI_HELP, /verify/);
assert.match(CLI_HELP, /doctor/);
assert.match(CLI_HELP, /adopt/);

assert.deepEqual(parseCliArgs(["help"]).name, "help");
assert.deepEqual(parseCliArgs(["init", "--root", "tmp"]).name, "init");
assert.equal(parseCliArgs(["generate", "--force"]).name, "generate");
assert.equal(parseCliArgs(["feature", "F027"]).name, "feature");
assert.equal(parseCliArgs(["adopt", "--approve", "--answers", "a.json"]).name, "adopt");
assert.throws(() => parseCliArgs(["scaffold"]));

console.log("CLI package boundary checks passed.");
