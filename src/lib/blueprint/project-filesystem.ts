import { GeneratedArtifactPathSchema } from "./schemas/generated-artifact";

/**
 * Framework-independent view of a project root.
 * Interface layers implement this with Node fs, memory, or uploads.
 */
export type ProjectFilesystem = {
  exists(relativePath: string): boolean;
  readText(relativePath: string): string | null;
  list(relativePath: string): readonly string[] | null;
  listFiles(options?: {
    prefix?: string;
    suffix?: string;
    max?: number;
  }): readonly string[];
};

export function assertProjectRelativePath(relativePath: string): string {
  if (relativePath === "" || relativePath === ".") {
    return "";
  }

  return GeneratedArtifactPathSchema.parse(relativePath);
}

export function createMemoryFilesystem(
  files: Record<string, string> = {},
): ProjectFilesystem {
  const store = new Map(Object.entries(files));

  return {
    exists(relativePath) {
      const path = assertProjectRelativePath(relativePath);
      if (path === "") {
        return true;
      }

      return (
        store.has(path) ||
        [...store.keys()].some(
          (key) => key.startsWith(`${path}/`) || key === path,
        )
      );
    },
    readText(relativePath) {
      return store.get(assertProjectRelativePath(relativePath)) ?? null;
    },
    list(relativePath) {
      const path = assertProjectRelativePath(relativePath);
      const prefix = path === "" ? "" : `${path}/`;
      const entries = new Set<string>();

      for (const key of store.keys()) {
        if (path !== "" && key !== path && !key.startsWith(prefix)) {
          continue;
        }

        const remainder = path === "" ? key : key.slice(prefix.length);
        const [entry] = remainder.split("/");

        if (entry) {
          entries.add(entry);
        }
      }

      return [...entries].sort();
    },
    listFiles(options = {}) {
      const prefix = options.prefix ?? "";
      const suffix = options.suffix ?? "";
      const max = options.max ?? 400;

      return [...store.keys()]
        .filter((key) => key.startsWith(prefix) && key.endsWith(suffix))
        .sort()
        .slice(0, max);
    },
  };
}
