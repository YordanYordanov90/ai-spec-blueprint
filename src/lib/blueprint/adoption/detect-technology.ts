import type { ProjectFilesystem } from "../project-filesystem";

export type DetectedTechnology = {
  category: string;
  choice: string;
  evidence: string;
};

type PackageManifest = {
  name?: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function readPackageManifest(filesystem: ProjectFilesystem): PackageManifest | null {
  const raw = filesystem.readText("package.json");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PackageManifest;
  } catch {
    return null;
  }
}

function dependencyMap(manifest: PackageManifest): Record<string, string> {
  return {
    ...(manifest.dependencies ?? {}),
    ...(manifest.devDependencies ?? {}),
  };
}

function addIfDependency(
  facts: DetectedTechnology[],
  dependencies: Record<string, string>,
  packageName: string,
  category: string,
  choice: string,
): void {
  if (dependencies[packageName]) {
    facts.push({
      category,
      choice,
      evidence: `package.json lists ${packageName}`,
    });
  }
}

export function detectTechnology(
  filesystem: ProjectFilesystem,
): readonly DetectedTechnology[] {
  const facts: DetectedTechnology[] = [];
  const manifest = readPackageManifest(filesystem);
  const dependencies = manifest ? dependencyMap(manifest) : {};

  if (manifest?.name) {
    facts.push({
      category: "package-name",
      choice: manifest.name,
      evidence: "package.json name",
    });
  }

  if (manifest?.description) {
    facts.push({
      category: "package-description",
      choice: manifest.description,
      evidence: "package.json description",
    });
  }

  addIfDependency(facts, dependencies, "next", "web framework", "Next.js");
  addIfDependency(facts, dependencies, "react", "ui library", "React");
  addIfDependency(facts, dependencies, "typescript", "language", "TypeScript");
  addIfDependency(facts, dependencies, "zod", "validation", "Zod");
  addIfDependency(facts, dependencies, "tailwindcss", "styling", "Tailwind CSS");
  addIfDependency(facts, dependencies, "ai", "ai sdk", "Vercel AI SDK");
  addIfDependency(facts, dependencies, "@ai-sdk/openai", "ai provider", "OpenAI");
  addIfDependency(facts, dependencies, "drizzle-orm", "persistence", "Drizzle ORM");
  addIfDependency(facts, dependencies, "prisma", "persistence", "Prisma");
  addIfDependency(facts, dependencies, "@clerk/nextjs", "authentication", "Clerk");
  addIfDependency(facts, dependencies, "next-auth", "authentication", "NextAuth");

  if (filesystem.exists("tsconfig.json")) {
    facts.push({
      category: "language",
      choice: "TypeScript",
      evidence: "tsconfig.json is present",
    });
  }

  if (
    filesystem.exists("next.config.ts") ||
    filesystem.exists("next.config.js") ||
    filesystem.exists("next.config.mjs")
  ) {
    facts.push({
      category: "web framework",
      choice: "Next.js",
      evidence: "Next.js config file is present",
    });
  }

  if (filesystem.exists("app") || filesystem.exists("src/app")) {
    facts.push({
      category: "routing",
      choice: "App Router",
      evidence: "an app directory is present",
    });
  } else if (filesystem.exists("pages") || filesystem.exists("src/pages")) {
    facts.push({
      category: "routing",
      choice: "Pages Router",
      evidence: "a pages directory is present",
    });
  }

  if (!dependencies["drizzle-orm"] && !dependencies.prisma) {
    facts.push({
      category: "persistence",
      choice: "No database package detected",
      evidence: "package.json has no Drizzle or Prisma dependency",
    });
  }

  if (!dependencies["@clerk/nextjs"] && !dependencies["next-auth"]) {
    facts.push({
      category: "authentication",
      choice: "No authentication package detected",
      evidence: "package.json has no Clerk or NextAuth dependency",
    });
  }

  return facts;
}

export function hasDetectedChoice(
  facts: readonly DetectedTechnology[],
  category: string,
  choice: string,
): boolean {
  return facts.some(
    (fact) => fact.category === category && fact.choice === choice,
  );
}
