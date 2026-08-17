#!/usr/bin/env node
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("tsx/esm", pathToFileURL("./"));

const { runCli } = await import("./index.ts");
process.exitCode = runCli(process.argv.slice(2));
