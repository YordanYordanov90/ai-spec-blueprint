import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

import {
  assertProjectRelativePath,
  type ProjectFilesystem,
} from "@/src/lib/blueprint";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  "node_modules",
  "out",
  "dist",
  "coverage",
]);

function toPosix(path: string): string {
  return path.split(sep).join("/");
}

export function createNodeProjectFilesystem(root: string): ProjectFilesystem {
  const resolvedRoot = resolve(root);

  function resolveInside(relativePath: string): string {
    const safePath = assertProjectRelativePath(relativePath);
    const absolute = safePath ? resolve(resolvedRoot, safePath) : resolvedRoot;
    const fromRoot = relative(resolvedRoot, absolute);

    if (fromRoot.startsWith("..") || fromRoot === "") {
      if (fromRoot === "") {
        return resolvedRoot;
      }

      throw new Error("Path escapes the project root.");
    }

    return absolute;
  }

  return {
    exists(relativePath) {
      try {
        return existsSync(resolveInside(relativePath));
      } catch {
        return false;
      }
    },
    readText(relativePath) {
      try {
        const absolute = resolveInside(relativePath);
        if (!existsSync(absolute) || !statSync(absolute).isFile()) {
          return null;
        }

        return readFileSync(absolute, "utf8");
      } catch {
        return null;
      }
    },
    list(relativePath) {
      try {
        const absolute = resolveInside(relativePath);
        if (!existsSync(absolute) || !statSync(absolute).isDirectory()) {
          return null;
        }

        return readdirSync(absolute)
          .filter((entry) => !IGNORED_DIRECTORIES.has(entry))
          .sort();
      } catch {
        return null;
      }
    },
    listFiles(options = {}) {
      const prefix = options.prefix ?? "";
      const suffix = options.suffix ?? "";
      const max = options.max ?? 400;
      const collected: string[] = [];

      function walk(directory: string): void {
        if (collected.length >= max) {
          return;
        }

        let entries: string[] = [];

        try {
          entries = readdirSync(directory);
        } catch {
          return;
        }

        for (const entry of entries) {
          if (IGNORED_DIRECTORIES.has(entry)) {
            continue;
          }

          const absolute = join(directory, entry);
          let stats;

          try {
            stats = statSync(absolute);
          } catch {
            continue;
          }

          if (stats.isDirectory()) {
            walk(absolute);
            continue;
          }

          const relativePath = toPosix(relative(resolvedRoot, absolute));

          if (relativePath.startsWith(prefix) && relativePath.endsWith(suffix)) {
            collected.push(relativePath);
          }

          if (collected.length >= max) {
            return;
          }
        }
      }

      walk(prefix ? resolveInside(prefix) : resolvedRoot);
      return collected.sort();
    },
  };
}
