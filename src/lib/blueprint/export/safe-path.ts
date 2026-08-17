import { GeneratedArtifactPathSchema } from "../schemas/generated-artifact";

function normalizePosixPath(value: string): string {
  const isAbsolute = value.startsWith("/");
  const segments: string[] = [];

  for (const segment of value.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }

    if (segment === "..") {
      if (segments.length > 0 && segments.at(-1) !== "..") {
        segments.pop();
      } else if (!isAbsolute) {
        segments.push(segment);
      }
      continue;
    }

    segments.push(segment);
  }

  const normalized = segments.join("/");
  if (isAbsolute) {
    return `/${normalized}`;
  }

  return normalized || ".";
}

function relativePosixPath(from: string, to: string): string {
  const fromAbsolute = from.startsWith("/");
  const toAbsolute = to.startsWith("/");

  if (fromAbsolute !== toAbsolute) {
    return to;
  }

  const fromSegments = from.split("/").filter((segment) => segment && segment !== ".");
  const toSegments = to.split("/").filter((segment) => segment && segment !== ".");
  let commonLength = 0;

  while (
    commonLength < fromSegments.length &&
    commonLength < toSegments.length &&
    fromSegments[commonLength] === toSegments[commonLength]
  ) {
    commonLength += 1;
  }

  return [
    ...fromSegments.slice(commonLength).map(() => ".."),
    ...toSegments.slice(commonLength),
  ].join("/");
}

export function sanitizeExportRoot(root: string): string {
  const trimmed = root.trim();

  if (!trimmed) {
    throw new Error("Export root is required.");
  }

  return trimmed;
}

export function resolveArtifactPath(root: string, relativePath: string): string {
  const validatedPath = GeneratedArtifactPathSchema.parse(relativePath);
  const normalizedRoot = normalizePosixPath(root.replaceAll("\\", "/"));
  const resolved = normalizePosixPath(`${normalizedRoot}/${validatedPath}`);
  const relative = relativePosixPath(normalizedRoot, resolved);

  if (relative.startsWith("..") || relative.startsWith("/")) {
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
