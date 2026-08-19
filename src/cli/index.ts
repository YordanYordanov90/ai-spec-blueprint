import { CLI_HELP, parseCliArgs } from "./parse-args";
import {
  runAdopt,
  runDoctor,
  runFeature,
  runGenerate,
  runInit,
  runVerify,
} from "./commands";

export function runCli(argv: readonly string[]): number {
  try {
    const command = parseCliArgs(argv);

    const result =
      command.name === "help"
        ? { code: 0, stdout: CLI_HELP, stderr: "" }
        : command.name === "init"
          ? runInit(command.root)
          : command.name === "generate"
            ? runGenerate(command.root, command.from, command.force)
            : command.name === "feature"
              ? runFeature(command.root, command.from, command.featureId)
              : command.name === "verify"
                ? runVerify(command.root, command.from)
                : command.name === "doctor"
                  ? runDoctor(command.root, command.from)
                  : runAdopt(command.root, command);

    if (result.stdout) {
      process.stdout.write(`${result.stdout}\n`);
    }

    if (result.stderr) {
      process.stderr.write(`${result.stderr}\n`);
    }

    return result.code;
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : "CLI failed."}\n`,
    );
    return 1;
  }
}

const invokedDirectly = process.argv[1]?.includes("src/cli/index");

if (invokedDirectly) {
  process.exitCode = runCli(process.argv.slice(2));
}
