import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
} from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

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

function isInside(root: string, candidate: string): boolean {
  const fromRoot = relative(root, candidate);

  return (
    fromRoot === "" ||
    (fromRoot !== ".." &&
      !fromRoot.startsWith(`..${sep}`) &&
      !isAbsolute(fromRoot))
  );
}

function isMissingPathError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = (error as NodeJS.ErrnoException).code;
  return code === "ENOENT" || code === "ENOTDIR";
}

export function createNodeProjectFilesystem(root: string): ProjectFilesystem {
  const resolvedRoot = resolve(root);

  function resolveInside(relativePath: string): string {
    const safePath = assertProjectRelativePath(relativePath);
    const absolute = safePath ? resolve(resolvedRoot, safePath) : resolvedRoot;

    if (!isInside(resolvedRoot, absolute)) {
      throw new Error("Path escapes the project root.");
    }

    let canonicalRoot: string;
    let canonicalAbsolute: string;

    try {
      canonicalRoot = realpathSync.native(resolvedRoot);
      canonicalAbsolute = realpathSync.native(absolute);
    } catch (error) {
      if (!isMissingPathError(error)) {
        throw error;
      }

      // Missing paths are safe to return after lexical containment. Read-only
      // operations will report them as missing, while existing paths receive
      // the real-path containment check below.
      return absolute;
    }

    if (!isInside(canonicalRoot, canonicalAbsolute)) {
      throw new Error("Path escapes the project root through a symlink.");
    }

    return canonicalAbsolute;
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
      const walkRoot = resolveInside("");

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
            const linkStats = lstatSync(absolute);
            if (linkStats.isSymbolicLink()) {
              continue;
            }

            stats = statSync(absolute);
          } catch {
            continue;
          }

          if (stats.isDirectory()) {
            walk(absolute);
            continue;
          }

          const relativePath = toPosix(relative(walkRoot, absolute));

          if (relativePath.startsWith(prefix) && relativePath.endsWith(suffix)) {
            collected.push(relativePath);
          }

          if (collected.length >= max) {
            return;
          }
        }
      }

      walk(prefix ? resolveInside(prefix) : walkRoot);
      return collected.sort();
    },
  };
}
