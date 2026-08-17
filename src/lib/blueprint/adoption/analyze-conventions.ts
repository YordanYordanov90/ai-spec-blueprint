import type { ProjectFilesystem } from "../project-filesystem";

export type ConventionFinding = {
  id: string;
  title: string;
  evidence: string;
};

function countMatches(files: readonly string[], pattern: RegExp): number {
  return files.filter((file) => pattern.test(file)).length;
}

export function analyzeConventions(
  filesystem: ProjectFilesystem,
): readonly ConventionFinding[] {
  const findings: ConventionFinding[] = [];
  const files = filesystem.listFiles({ max: 400 });
  const tsFiles = files.filter((file) => /\.(ts|tsx|mts)$/.test(file));
  const clientComponents = tsFiles.filter((file) => {
    const source = filesystem.readText(file);
    return Boolean(source?.includes('"use client"') || source?.includes("'use client'"));
  });

  if (tsFiles.some((file) => file.startsWith("app/"))) {
    findings.push({
      id: "app-router-files",
      title: "Routes live in the App Router tree",
      evidence: "TypeScript files exist under app/",
    });
  }

  if (tsFiles.some((file) => file.startsWith("src/lib/"))) {
    findings.push({
      id: "src-lib-modules",
      title: "Shared logic lives under src/lib",
      evidence: "TypeScript modules exist under src/lib/",
    });
  }

  if (clientComponents.length > 0) {
    findings.push({
      id: "explicit-client-components",
      title: "Client Components are explicitly marked",
      evidence: `${clientComponents.length} file(s) contain a use client directive`,
    });
  }

  if (countMatches(files, /\.check\.ts$/) > 0) {
    findings.push({
      id: "focused-check-files",
      title: "Focused Node assert checks are used",
      evidence: "One or more *.check.ts files are present",
    });
  }

  const kebabFiles = files.filter((file) =>
    /\/[a-z0-9]+(?:-[a-z0-9]+)+\.(ts|tsx|md)$/.test(`/${file}`),
  );

  if (kebabFiles.length >= 3) {
    findings.push({
      id: "kebab-case-filenames",
      title: "Source files commonly use kebab-case names",
      evidence: `${kebabFiles.length} kebab-case source or Markdown files were observed`,
    });
  }

  const tsconfig = filesystem.readText("tsconfig.json");
  if (tsconfig?.includes('"@/*"')) {
    findings.push({
      id: "path-alias",
      title: "TypeScript path alias @/* is configured",
      evidence: "tsconfig.json maps @/*",
    });
  }

  if (filesystem.exists("components/ui")) {
    findings.push({
      id: "shadcn-primitives",
      title: "UI primitives live under components/ui",
      evidence: "components/ui exists",
    });
  }

  return findings;
}
