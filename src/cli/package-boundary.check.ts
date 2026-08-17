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
const launcher = readFileSync("src/cli/run.mjs", "utf8");

for (const file of files) {
  const source = readFileSync(file, "utf8");
  assert.doesNotMatch(source, /from ["']react["']/);
  assert.doesNotMatch(source, /from ["']react-dom/);
  assert.doesNotMatch(source, /from ["']next(\/|"|')/);
  assert.doesNotMatch(source, /from ["']@\/app\//);
  assert.doesNotMatch(source, /from ["']@\/components\//);
}

assert.match(launcher, /spawnSync/);
assert.match(launcher, /new URL\("\.\/index\.ts", import\.meta\.url\)/);
assert.match(launcher, /new URL\("\.\.\/\.\.\/node_modules\/tsx\/dist\/cli\.mjs/);
assert.doesNotMatch(launcher, /register\(/);

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
const featureWithRoot = parseCliArgs(["feature", "--root", "/repo", "F027"]);
assert.equal(featureWithRoot.name, "feature");
if (featureWithRoot.name === "feature") {
  assert.equal(featureWithRoot.featureId, "F027");
}
const featureWithSource = parseCliArgs(["feature", "--from", "custom.json", "F027"]);
assert.equal(featureWithSource.name, "feature");
if (featureWithSource.name === "feature") {
  assert.equal(featureWithSource.featureId, "F027");
}
assert.throws(() => parseCliArgs(["feature", "--next", "F027"]));
assert.throws(() => parseCliArgs(["feature", "F027", "F028"]));
assert.throws(() => parseCliArgs(["feature", "--force"]));
assert.equal(parseCliArgs(["adopt", "--approve", "--answers", "a.json"]).name, "adopt");
assert.throws(() => parseCliArgs(["scaffold"]));

console.log("CLI package boundary checks passed.");
