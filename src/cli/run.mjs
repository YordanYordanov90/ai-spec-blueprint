#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cliEntrypoint = fileURLToPath(new URL("./index.ts", import.meta.url));
const tsxCli = fileURLToPath(
  new URL("../../node_modules/tsx/dist/cli.mjs", import.meta.url),
);
const result = spawnSync(
  process.execPath,
  [tsxCli, cliEntrypoint, ...process.argv.slice(2)],
  { stdio: "inherit" },
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
