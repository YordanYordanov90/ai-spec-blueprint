export type CliCommand =
  | { name: "help" }
  | { name: "init"; root: string }
  | { name: "generate"; root: string; from: string; force: boolean }
  | { name: "feature"; root: string; from: string; featureId?: string }
  | { name: "verify"; root: string; from?: string }
  | { name: "doctor"; root: string; from?: string }
  | {
      name: "adopt";
      root: string;
      answers?: string;
      approve: boolean;
      force: boolean;
    };

function readOption(
  args: readonly string[],
  name: string,
): string | undefined {
  const index = args.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

function hasFlag(args: readonly string[], name: string): boolean {
  return args.includes(name);
}

export function parseCliArgs(argv: readonly string[]): CliCommand {
  const [command, ...rest] = argv;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    return { name: "help" };
  }

  const root = readOption(rest, "--root") ?? ".";
  const from = readOption(rest, "--from") ?? "blueprint.json";
  const force = hasFlag(rest, "--force");

  switch (command) {
    case "init":
      return { name: "init", root };
    case "generate":
      return { name: "generate", root, from, force };
    case "feature": {
      const positional = rest.find((value) => !value.startsWith("-"));
      const featureId = hasFlag(rest, "--next") ? undefined : positional;
      return { name: "feature", root, from, featureId };
    }
    case "verify":
      return {
        name: "verify",
        root,
        from: rest.includes("--from") ? from : undefined,
      };
    case "doctor":
      return {
        name: "doctor",
        root,
        from: rest.includes("--from") ? from : undefined,
      };
    case "adopt":
      return {
        name: "adopt",
        root,
        answers: readOption(rest, "--answers"),
        approve: hasFlag(rest, "--approve"),
        force,
      };
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

export const CLI_HELP = `Usage: blueprint <command> [options]

Commands:
  init                 Create durable context directories
  generate             Generate context files from an approved blueprint
  feature [id|--next]  Prepare features/current-feature.md
  verify               Run configured project verification
  doctor               Inspect missing context and mismatches
  adopt                Detect the existing project and propose a blueprint

Options:
  --root <dir>         Project root (default: .)
  --from <file>        Blueprint JSON path (default: blueprint.json)
  --answers <file>     Adoption answers JSON
  --approve            Approve an adopted blueprint proposal
  --force              Overwrite existing generated files
  --next               Select the next planned feature
`;
