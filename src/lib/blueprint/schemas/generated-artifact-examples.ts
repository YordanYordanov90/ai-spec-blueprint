import type { z } from "zod";

import { GeneratedArtifactSchema } from "./generated-artifact";

export const validGeneratedArtifactExample = {
  relativePath: "context/project-overview.md",
  content: "# Project Overview\n",
  documentType: "markdown",
} as const satisfies z.input<typeof GeneratedArtifactSchema>;

export const invalidAbsolutePathArtifactExample = {
  relativePath: "/context/project-overview.md",
  content: "# Project Overview\n",
  documentType: "markdown",
};

export const invalidTraversalPathArtifactExample = {
  relativePath: "context/../project-overview.md",
  content: "# Project Overview\n",
  documentType: "markdown",
};

export const invalidContentArtifactExample = {
  relativePath: "context/project-overview.md",
  content: "",
  documentType: "markdown",
};
