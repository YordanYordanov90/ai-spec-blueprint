import type { ProjectFilesystem } from "../project-filesystem";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";

export type VerificationStep = {
  id: string;
  label: string;
  command: string;
  args: readonly string[];
  source: "package-script" | "fallback-binary";
};

export type VerificationPlan = {
  steps: readonly VerificationStep[];
  missing: readonly { check: string; reason: string }[];
};

type PackageManifest = {
  scripts?: Record<string, string>;
};

function readPackageManifest(filesystem: ProjectFilesystem): PackageManifest {
  const raw = filesystem.readText("package.json");

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as PackageManifest;
  } catch {
    return {};
  }
}

function scriptNames(scripts: Record<string, string> | undefined): string[] {
  return Object.keys(scripts ?? {});
}

function findScript(
  scripts: Record<string, string> | undefined,
  candidates: readonly string[],
): string | undefined {
  const names = scriptNames(scripts);

  return candidates.find((candidate) => names.includes(candidate));
}

function planTypecheck(scripts: Record<string, string> | undefined): VerificationStep | null {
  const script = findScript(scripts, ["typecheck", "check:types", "tsc"]);

  if (script) {
    return {
      id: "typecheck",
      label: "TypeScript",
      command: "npm",
      args: ["run", script],
      source: "package-script",
    };
  }

  return {
    id: "typecheck",
    label: "TypeScript",
    command: "npx",
    args: ["tsc", "--noEmit"],
    source: "fallback-binary",
  };
}

function planLint(scripts: Record<string, string> | undefined): VerificationStep | null {
  const script = findScript(scripts, ["lint", "check:lint"]);

  if (!script) {
    return null;
  }

  return {
    id: "lint",
    label: "Lint",
    command: "npm",
    args: ["run", script],
    source: "package-script",
  };
}

function planFocusedChecks(
  scripts: Record<string, string> | undefined,
): VerificationStep[] {
  const exact = findScript(scripts, ["test", "check", "check:all"]);

  if (exact) {
    return [
      {
        id: exact,
        label: exact,
        command: "npm",
        args: ["run", exact],
        source: "package-script",
      },
    ];
  }

  return scriptNames(scripts)
    .filter((name) => name.startsWith("check:"))
    .sort()
    .map((name) => ({
      id: name,
      label: name,
      command: "npm",
      args: ["run", name],
      source: "package-script" as const,
    }));
}

function planBuild(scripts: Record<string, string> | undefined): VerificationStep | null {
  const script = findScript(scripts, ["build"]);

  if (!script) {
    return null;
  }

  return {
    id: "build",
    label: "Production build",
    command: "npm",
    args: ["run", script],
    source: "package-script",
  };
}

function classifyCheck(check: string): "typecheck" | "lint" | "tests" | "build" | "unknown" {
  const normalized = check.toLowerCase();

  if (/typescript|typecheck|tsc/.test(normalized)) {
    return "typecheck";
  }

  if (/lint|eslint/.test(normalized)) {
    return "lint";
  }

  if (/build|production/.test(normalized)) {
    return "build";
  }

  if (/test|schema|focused|check/.test(normalized)) {
    return "tests";
  }

  return "unknown";
}

export function planVerification(
  filesystem: ProjectFilesystem,
  blueprint?: ProjectBlueprint,
): VerificationPlan {
  const scripts = readPackageManifest(filesystem).scripts;
  const requiredChecks = blueprint
    ? ProjectBlueprintSchema.parse(blueprint).verification.requiredChecks
    : ["TypeScript", "Lint", "Focused checks"];

  const steps: VerificationStep[] = [];
  const missing: { check: string; reason: string }[] = [];
  const seen = new Set<string>();

  for (const check of requiredChecks) {
    const kind = classifyCheck(check);
    const typecheck = kind === "typecheck" ? planTypecheck(scripts) : null;
    const lint = kind === "lint" ? planLint(scripts) : null;
    const build = kind === "build" ? planBuild(scripts) : null;
    const planned =
      kind === "tests"
        ? planFocusedChecks(scripts)
        : typecheck
          ? [typecheck]
          : lint
            ? [lint]
            : build
              ? [build]
              : [];

    if (planned.length === 0) {
      missing.push({
        check,
        reason: "No matching package script is configured for this check.",
      });
      continue;
    }

    for (const step of planned) {
      if (!step || seen.has(step.id)) {
        continue;
      }

      seen.add(step.id);
      steps.push(step);
    }
  }

  return { steps, missing };
}
