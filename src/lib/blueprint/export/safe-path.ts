import { posix } from "node:path";

import { GeneratedArtifactPathSchema } from "../schemas/generated-artifact";

export function sanitizeExportRoot(root: string): string {
  const trimmed = root.trim();

  if (!trimmed) {
    throw new Error("Export root is required.");
  }

  return trimmed;
}

export function resolveArtifactPath(root: string, relativePath: string): string {
  const validatedPath = GeneratedArtifactPathSchema.parse(relativePath);
  const normalizedRoot = posix.normalize(root.replaceAll("\\", "/"));
  const resolved = posix.normalize(posix.join(normalizedRoot, validatedPath));
  const relative = posix.relative(normalizedRoot, resolved);

  if (relative.startsWith("..") || posix.isAbsolute(relative)) {
    throw new Error("Artifact path escapes the export root.");
  }

  return resolved;
}

export function assertSafeArtifactPaths(
  root: string,
  relativePaths: readonly string[],
): string[] {
  return relativePaths.map((relativePath) =>
    resolveArtifactPath(root, relativePath),
  );
}
