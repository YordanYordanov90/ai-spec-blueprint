#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const cliEntrypoint = fileURLToPath(new URL("./index.ts", import.meta.url));
const require = createRequire(import.meta.url);
let tsxCli;

try {
  tsxCli = require.resolve("tsx/cli");
} catch (error) {
  throw new Error(
    "Cannot start the Blueprint CLI because the tsx runtime dependency is unavailable.",
    { cause: error },
  );
}

const result = spawnSync(
  process.execPath,
  [tsxCli, cliEntrypoint, ...process.argv.slice(2)],
  { stdio: "inherit" },
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
