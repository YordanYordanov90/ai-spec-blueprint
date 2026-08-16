import { z } from "zod";

const NonEmptyTextSchema = z.string().trim().min(1);
const TextListSchema = z.array(NonEmptyTextSchema).min(1);

export const TechnologyDecisionStatusSchema = z.enum([
  "confirmed",
  "preferred-if-needed",
  "unresolved",
  "rejected",
]);

export const TechnologyDecisionSchema = z
  .object({
    category: NonEmptyTextSchema,
    choice: NonEmptyTextSchema,
    status: TechnologyDecisionStatusSchema,
    rationale: NonEmptyTextSchema,
    constraints: z.array(NonEmptyTextSchema),
  })
  .strict();

export const ArchitectureDecisionStatusSchema = z.enum([
  "approved",
  "proposed",
  "unresolved",
  "rejected",
]);

export const ArchitectureDecisionSchema = z
  .object({
    title: NonEmptyTextSchema,
    decision: NonEmptyTextSchema,
    rationale: NonEmptyTextSchema,
    constraints: z.array(NonEmptyTextSchema),
    status: ArchitectureDecisionStatusSchema,
    relatedAreas: TextListSchema,
    requiresAdr: z.boolean(),
  })
  .strict();

export const GuardrailCategorySchema = z.enum([
  "architecture",
  "scope",
  "security",
  "data",
  "AI",
  "UI",
  "testing",
  "workflow",
  "dependency",
  "Git",
]);

export const GuardrailSourceSchema = z.enum([
  "universal",
  "stack-profile",
  "project-specific",
  "human-authored",
]);

export const GuardrailSeveritySchema = z.enum([
  "required",
  "strong-preference",
  "advisory",
]);

export const GuardrailSchema = z
  .object({
    id: NonEmptyTextSchema,
    title: NonEmptyTextSchema,
    rule: NonEmptyTextSchema,
    category: GuardrailCategorySchema,
    source: GuardrailSourceSchema,
    severity: GuardrailSeveritySchema,
    rationale: NonEmptyTextSchema,
  })
  .strict();

export const UnresolvedDecisionSchema = z
  .object({
    question: NonEmptyTextSchema,
    whyItMatters: NonEmptyTextSchema,
    optionsConsidered: z.array(NonEmptyTextSchema),
    blocking: z.boolean(),
    recommendedResolutionPoint: NonEmptyTextSchema,
  })
  .strict();

export type ArchitectureDecision = z.infer<
  typeof ArchitectureDecisionSchema
>;
export type Guardrail = z.infer<typeof GuardrailSchema>;
export type TechnologyDecision = z.infer<typeof TechnologyDecisionSchema>;
export type UnresolvedDecision = z.infer<typeof UnresolvedDecisionSchema>;
