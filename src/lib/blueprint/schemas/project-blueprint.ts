import { z } from "zod";

import {
  ArchitectureDecisionSchema,
  GuardrailSchema,
  TechnologyDecisionSchema,
  UnresolvedDecisionSchema,
} from "./decisions";

const NonEmptyTextSchema = z.string().trim().min(1);
const TextListSchema = z.array(NonEmptyTextSchema).min(1);

export const BlueprintMetadataSchema = z
  .object({
    schemaVersion: z.string().trim().regex(/^\d+\.\d+$/),
  })
  .strict();

export const ProductDefinitionSchema = z
  .object({
    name: NonEmptyTextSchema,
    summary: NonEmptyTextSchema,
    problem: NonEmptyTextSchema,
    successCriteria: TextListSchema,
  })
  .strict();

export const TargetUserSchema = z
  .object({
    name: NonEmptyTextSchema,
    description: NonEmptyTextSchema,
    needs: TextListSchema,
  })
  .strict();

export const DomainConceptSchema = z
  .object({
    name: NonEmptyTextSchema,
    purpose: NonEmptyTextSchema,
    attributes: z.array(NonEmptyTextSchema),
    relationships: z.array(NonEmptyTextSchema),
    invariants: z.array(NonEmptyTextSchema),
    persistenceExpectation: z.enum([
      "in-memory",
      "local",
      "database",
      "external-service",
      "unknown",
    ]),
    sensitivity: z.enum(["public", "internal", "sensitive", "unknown"]),
  })
  .strict();

export const UiDirectionSchema = z
  .object({
    personality: NonEmptyTextSchema,
    visualDirection: NonEmptyTextSchema,
    layoutPrinciples: TextListSchema,
    navigationModel: NonEmptyTextSchema,
    responsiveBehavior: NonEmptyTextSchema,
    accessibilityRequirements: TextListSchema,
    componentStrategy: NonEmptyTextSchema,
    unresolvedBrandingChoices: z.array(NonEmptyTextSchema),
  })
  .strict();

export const AiUsageDefinitionSchema = z
  .object({
    purpose: NonEmptyTextSchema,
    allowedResponsibilities: TextListSchema,
    prohibitedResponsibilities: TextListSchema,
    providerModelConstraints: z.array(NonEmptyTextSchema),
    outputValidation: NonEmptyTextSchema,
    fallbackErrorExpectations: NonEmptyTextSchema,
    humanApprovalBoundaries: TextListSchema,
  })
  .strict();

export const SecurityDefinitionSchema = z
  .object({
    constraints: TextListSchema,
  })
  .strict();

export const VerificationDefinitionSchema = z
  .object({
    strategy: NonEmptyTextSchema,
    requiredChecks: TextListSchema,
    riskAreas: z.array(NonEmptyTextSchema),
  })
  .strict();

export const FeatureSummarySchema = z
  .object({
    id: NonEmptyTextSchema,
    title: NonEmptyTextSchema,
    objective: NonEmptyTextSchema,
    phase: NonEmptyTextSchema,
    status: z.enum(["planned", "in-progress", "complete", "blocked", "deferred"]),
    dependencies: z.array(NonEmptyTextSchema),
    scopeSummary: NonEmptyTextSchema,
  })
  .strict();

export const ProjectBlueprintSchema = z
  .object({
    metadata: BlueprintMetadataSchema,
    product: ProductDefinitionSchema,
    users: z.array(TargetUserSchema).min(1),
    goals: TextListSchema,
    nonGoals: TextListSchema,
    stack: z.array(TechnologyDecisionSchema).min(1),
    architecture: z.array(ArchitectureDecisionSchema).min(1),
    domain: z.array(DomainConceptSchema).min(1),
    ui: UiDirectionSchema,
    ai: AiUsageDefinitionSchema.optional(),
    security: SecurityDefinitionSchema,
    verification: VerificationDefinitionSchema,
    guardrails: z.array(GuardrailSchema).min(1),
    features: z.array(FeatureSummarySchema).min(1),
    unresolvedDecisions: z.array(UnresolvedDecisionSchema),
  })
  .strict();

export type AiUsageDefinition = z.infer<typeof AiUsageDefinitionSchema>;
export type ArchitectureDecision = z.infer<typeof ArchitectureDecisionSchema>;
export type BlueprintMetadata = z.infer<typeof BlueprintMetadataSchema>;
export type DomainConcept = z.infer<typeof DomainConceptSchema>;
export type FeatureSummary = z.infer<typeof FeatureSummarySchema>;
export type ProductDefinition = z.infer<typeof ProductDefinitionSchema>;
export type ProjectBlueprint = z.infer<typeof ProjectBlueprintSchema>;
export type SecurityDefinition = z.infer<typeof SecurityDefinitionSchema>;
export type TargetUser = z.infer<typeof TargetUserSchema>;
export type TechnologyDecision = z.infer<typeof TechnologyDecisionSchema>;
export type UiDirection = z.infer<typeof UiDirectionSchema>;
export type VerificationDefinition = z.infer<
  typeof VerificationDefinitionSchema
>;
