import { generateAgents } from "./agents";
import { generateAiWorkflowRules } from "./ai-workflow-rules";
import { generateArchitecture } from "./architecture";
import { generateCodeStandards } from "./code-standards";
import type { ContextGenerator } from "./contract";
import { generateProgressTracker } from "./progress-tracker";
import { generateProjectOverview } from "./project-overview";
import { generateSchemasContext } from "./schemas-context";
import { generateUiContext } from "./ui-context";

const contextDocumentGenerators: readonly ContextGenerator[] = [
  generateAgents,
  generateProjectOverview,
  generateArchitecture,
  generateSchemasContext,
  generateCodeStandards,
  generateUiContext,
  generateAiWorkflowRules,
  generateProgressTracker,
];

export const generateContextPackage: ContextGenerator = (blueprint) =>
  contextDocumentGenerators.flatMap((generate) => generate(blueprint));
