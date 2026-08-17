import type { ProjectFilesystem } from "../project-filesystem";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";

export type DoctorSeverity = "error" | "warning" | "info";

export type DoctorFinding = {
  id: string;
  severity: DoctorSeverity;
  title: string;
  detail: string;
};

export type DoctorReport = {
  findings: readonly DoctorFinding[];
  healthy: boolean;
};

const REQUIRED_CONTEXT_FILES = [
  "AGENTS.md",
  "context/project-overview.md",
  "context/architecture.md",
  "context/schemas.md",
  "context/code-standards.md",
  "context/ui-context.md",
  "context/ai-workflow-rules.md",
  "context/progress-tracker.md",
  "features/current-feature.md",
] as const;

type PackageManifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function readJson(filesystem: ProjectFilesystem, path: string): unknown {
  const raw = filesystem.readText(path);

  if (raw === null) {
    return null;
  }

  if (raw.trim().length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function dependencyNames(manifest: PackageManifest): string[] {
  return [
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.devDependencies ?? {}),
  ];
}

function finding(
  id: string,
  severity: DoctorSeverity,
  title: string,
  detail: string,
): DoctorFinding {
  return { id, severity, title, detail };
}

export function inspectProject(
  filesystem: ProjectFilesystem,
  blueprint?: ProjectBlueprint,
): DoctorReport {
  const findings: DoctorFinding[] = [];
  const providedBlueprint = blueprint
    ? ProjectBlueprintSchema.safeParse(blueprint)
    : undefined;

  if (providedBlueprint && !providedBlueprint.success) {
    findings.push(
      finding(
        "blueprint-invalid",
        "error",
        "Blueprint is invalid",
        "The provided ProjectBlueprint failed schema validation.",
      ),
    );
  }

  const hasDurableBlueprint = filesystem.exists("blueprint.json");
  const rawBlueprint = readJson(filesystem, "blueprint.json");
  let durableBlueprint: ProjectBlueprint | undefined;

  if (hasDurableBlueprint && rawBlueprint === undefined) {
    findings.push(
      finding(
        "blueprint-json-unreadable",
        "error",
        "blueprint.json is not valid JSON",
        "The durable blueprint document cannot be parsed.",
      ),
    );
  } else if (hasDurableBlueprint) {
    const parsedDurableBlueprint = ProjectBlueprintSchema.safeParse(rawBlueprint);

    if (!parsedDurableBlueprint.success) {
      findings.push(
        finding(
          "blueprint-schema-invalid",
          "error",
          "blueprint.json does not match the ProjectBlueprint schema",
          "The durable blueprint document is valid JSON but cannot be used as project context.",
        ),
      );
    } else {
      durableBlueprint = parsedDurableBlueprint.data;
    }
  }

  const validBlueprint = providedBlueprint?.success
    ? providedBlueprint.data
    : durableBlueprint;

  for (const path of REQUIRED_CONTEXT_FILES) {
    if (!filesystem.exists(path)) {
      findings.push(
        finding(
          `missing-${path}`,
          "error",
          `Missing ${path}`,
          "Required durable context is not present in the repository.",
        ),
      );
    }
  }

  if (validBlueprint) {
    const inProgress = validBlueprint.features.filter(
      (feature) => feature.status === "in-progress",
    );

    if (inProgress.length > 1) {
      findings.push(
        finding(
          "multiple-active-features",
          "error",
          "Multiple in-progress features",
          inProgress.map((feature) => feature.id).join(", "),
        ),
      );
    }

    if (inProgress.length === 0) {
      findings.push(
        finding(
          "no-active-feature",
          "warning",
          "No in-progress feature",
          "Implementation should wait until a current feature is prepared.",
        ),
      );
    }

    const manifest = readJson(filesystem, "package.json");
    if (manifest && typeof manifest === "object") {
      const installed = dependencyNames(manifest as PackageManifest).map((name) =>
        name.toLowerCase(),
      );

      for (const decision of validBlueprint.stack) {
        if (decision.status !== "confirmed") {
          continue;
        }

        const token = decision.choice.toLowerCase().split(/\s+/)[0] ?? "";
        const knownPackage =
          token === "next.js"
            ? "next"
            : token === "typescript"
              ? "typescript"
              : token.replaceAll(".", "");

        if (
          knownPackage &&
          ["next", "react", "zod", "typescript", "tailwindcss"].includes(knownPackage) &&
          !installed.includes(knownPackage)
        ) {
          findings.push(
            finding(
              `stack-mismatch-${knownPackage}`,
              "warning",
              `Declared ${decision.choice} was not found`,
              `The blueprint confirms ${decision.choice}, but package.json does not list ${knownPackage}.`,
            ),
          );
        }
      }
    }
  }

  if (
    filesystem.exists("context/README.md") &&
    !filesystem.exists("context/project-overview.md")
  ) {
    findings.push(
      finding(
        "initialized-not-generated",
        "info",
        "Context initialized but not generated",
        "Run blueprint generate after an approved blueprint is available.",
      ),
    );
  }

  return {
    findings,
    healthy: findings.every((item) => item.severity !== "error"),
  };
}
