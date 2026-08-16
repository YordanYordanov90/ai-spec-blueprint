import { z } from "zod";

export const GeneratedArtifactPathSchema = z
  .string()
  .trim()
  .min(1)
  .superRefine((path, context) => {
    const isWindowsAbsolutePath = /^[A-Za-z]:[\\/]/.test(path);
    const hasInvalidSeparator = path.includes("\\");
    const hasTraversalSegment = path
      .split("/")
      .some((segment) => segment === "" || segment === "." || segment === "..");

    if (path.startsWith("/") || path.startsWith("\\") || isWindowsAbsolutePath) {
      context.addIssue({
        code: "custom",
        message: "Artifact paths must be relative.",
      });
    }

    if (hasInvalidSeparator) {
      context.addIssue({
        code: "custom",
        message: "Artifact paths must use forward slashes.",
      });
    }

    if (path.includes("\0")) {
      context.addIssue({
        code: "custom",
        message: "Artifact paths must not contain null characters.",
      });
    }

    if (hasTraversalSegment) {
      context.addIssue({
        code: "custom",
        message: "Artifact paths must not contain empty or traversal segments.",
      });
    }
  });

export const GeneratedDocumentTypeSchema = z.enum([
  "markdown",
  "text",
  "json",
]);

export const GeneratedArtifactSchema = z
  .object({
    relativePath: GeneratedArtifactPathSchema,
    content: z.string().min(1),
    documentType: GeneratedDocumentTypeSchema,
  })
  .strict();

export type GeneratedArtifact = z.infer<typeof GeneratedArtifactSchema>;
