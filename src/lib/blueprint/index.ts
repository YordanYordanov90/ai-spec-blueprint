export { analyzeMissingInformation } from "./discovery/analyze-missing-information";
export {
  applyExtractedFacts,
  createInitialDiscoveryState,
} from "./discovery/apply-extracted-facts";
export {
  approveBlueprintProposal,
  blueprintHasPendingProposal,
} from "./discovery/approve-blueprint";
export { proposeProjectBlueprint } from "./discovery/propose-blueprint";
export { generateApprovedContextPackage } from "./generators/approved-package";
export { generateContextPackage } from "./generators/context-package";
export {
  GeneratedArtifactsSchema,
  runContextGenerator,
  validateGeneratedArtifacts,
} from "./generators/contract";
export type { ContextGenerator } from "./generators/contract";
export { createContextExport, slugifyExportName } from "./export/create-context-export";
export type { ContextExport } from "./export/create-context-export";
export { buildZipArchive, crc32 } from "./export/zip";
export {
  assertSafeArtifactPaths,
  resolveArtifactPath,
  sanitizeExportRoot,
} from "./export/safe-path";
export {
  assertWritablePlan,
  planArtifactWrite,
} from "./export/plan-artifact-write";
export type {
  ArtifactWriteAction,
  ArtifactWritePlan,
} from "./export/plan-artifact-write";
export {
  createInitializationArtifacts,
  planProjectInitialization,
  projectLooksInitialized,
} from "./cli-workflows/initialize-project";
export { prepareCurrentFeature } from "./planning/prepare-current-feature";
export type { PreparedCurrentFeature } from "./planning/prepare-current-feature";
export { planVerification } from "./verification/plan-verification";
export type {
  VerificationPlan,
  VerificationStep,
} from "./verification/plan-verification";
export { inspectProject } from "./doctor/inspect-project";
export type { DoctorFinding, DoctorReport } from "./doctor/inspect-project";
export { detectTechnology } from "./adoption/detect-technology";
export type { DetectedTechnology } from "./adoption/detect-technology";
export { analyzeConventions } from "./adoption/analyze-conventions";
export type { ConventionFinding } from "./adoption/analyze-conventions";
export {
  blockingUnansweredQuestions,
  collectAdoptionQuestions,
  unansweredAdoptionQuestions,
} from "./adoption/adoption-questions";
export type {
  AdoptionAnswer,
  AdoptionQuestion,
} from "./adoption/adoption-questions";
export {
  approveAdoptedBlueprint,
  generateAdoptedBlueprint,
} from "./adoption/generate-adopted-blueprint";
export {
  assertProjectRelativePath,
  createMemoryFilesystem,
} from "./project-filesystem";
export type { ProjectFilesystem } from "./project-filesystem";
export {
  ProjectBlueprintSchema,
  GeneratedArtifactSchema,
} from "./schemas";
export type { GeneratedArtifact, ProjectBlueprint } from "./schemas";
