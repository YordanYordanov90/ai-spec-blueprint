import type { ContextGenerator } from "./contract";

/**
 * Contract-level fixture only. Not a product context document renderer.
 * Returns artifacts out of path order so the contract can prove it stabilizes output.
 */
export const representativeContextGenerator: ContextGenerator = (blueprint) => [
  {
    relativePath: "generator-contract/summary.txt",
    content: `summary=${blueprint.product.summary}\n`,
    documentType: "text",
  },
  {
    relativePath: "generator-contract/name.txt",
    content: `name=${blueprint.product.name}\n`,
    documentType: "text",
  },
];
