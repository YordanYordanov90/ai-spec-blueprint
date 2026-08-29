import { z } from "zod";

import { DiscoveryTopicSchema } from "../../blueprint/schemas/discovery";

const NonEmptyTextSchema = z.string().trim().min(1);
const PatternListSchema = z.array(NonEmptyTextSchema);

export const EvaluationStageSchema = z.enum([
  "fact-extraction",
  "discovery-analysis",
  "blueprint-proposal",
  "artifact-generation",
]);

export type EvaluationStage = z.infer<typeof EvaluationStageSchema>;

export const EvaluationFactSchema = z
  .object({
    id: NonEmptyTextSchema,
    statement: NonEmptyTextSchema,
    topic: DiscoveryTopicSchema,
    source: z.enum(["explicit", "detected"]),
  })
  .strict();

export const BlueprintSectionSchema = z.enum([
  "product",
  "users",
  "goals",
  "non-goals",
  "stack",
  "architecture",
  "domain",
  "ui",
  "ai",
  "security",
  "verification",
  "features",
]);

export const RequiredSectionContentSchema = z
  .object({
    section: BlueprintSectionSchema,
    patterns: PatternListSchema.min(1),
  })
  .strict();

export const ExpectedStackDecisionSchema = z
  .object({
    categoryPattern: NonEmptyTextSchema,
    choicePattern: NonEmptyTextSchema,
    status: z
      .enum(["confirmed", "preferred-if-needed", "unresolved", "rejected"])
      .optional(),
    statusMustNotBe: z.enum(["confirmed"]).optional(),
  })
  .strict();

export const EvaluationExpectationSchema = z
  .object({
    requiredFactPatterns: PatternListSchema,
    materialGapTopics: z.array(DiscoveryTopicSchema),
    forbiddenGapTopics: z.array(DiscoveryTopicSchema),
    requiredSections: z.array(RequiredSectionContentSchema),
    requiredStackDecisions: z.array(ExpectedStackDecisionSchema),
    prohibitedBlueprintPatterns: PatternListSchema,
    requireAiSection: z.boolean(),
    expectedReady: z.boolean(),
    contradictionMustBlock: z.boolean(),
  })
  .strict();

export const EvaluationScenarioSchema = z
  .object({
    id: NonEmptyTextSchema.regex(/^[a-z0-9-]+$/),
    title: NonEmptyTextSchema,
    initialIdea: NonEmptyTextSchema,
    answers: z.array(NonEmptyTextSchema).min(1),
    facts: z.array(EvaluationFactSchema).min(1),
    expectations: EvaluationExpectationSchema,
  })
  .strict();

export const EvaluationCorpusSchema = z
  .object({
    version: z.literal("1"),
    scenarios: z.array(EvaluationScenarioSchema).min(1),
  })
  .strict()
  .superRefine((corpus, context) => {
    const seen = new Set<string>();

    corpus.scenarios.forEach((scenario, index) => {
      if (seen.has(scenario.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate evaluation scenario id: ${scenario.id}`,
          path: ["scenarios", index, "id"],
        });
      }

      seen.add(scenario.id);
    });
  });

export type BlueprintSection = z.infer<typeof BlueprintSectionSchema>;
export type EvaluationCorpus = z.infer<typeof EvaluationCorpusSchema>;
export type EvaluationFact = z.infer<typeof EvaluationFactSchema>;
export type EvaluationExpectation = z.infer<typeof EvaluationExpectationSchema>;
export type EvaluationScenario = z.infer<typeof EvaluationScenarioSchema>;
export type ExpectedStackDecision = z.infer<typeof ExpectedStackDecisionSchema>;
export type RequiredSectionContent = z.infer<typeof RequiredSectionContentSchema>;

export const EvaluationMetricsSchema = z
  .object({
    latencyMs: z.number().finite().nonnegative(),
    inputTokens: z.number().int().nonnegative().nullable(),
    outputTokens: z.number().int().nonnegative().nullable(),
    totalTokens: z.number().int().nonnegative().nullable(),
    schemaFailures: z.number().int().nonnegative(),
    retries: z.number().int().nonnegative(),
  })
  .strict();

export type EvaluationMetrics = z.infer<typeof EvaluationMetricsSchema>;

export const EvaluationIssueSchema = z
  .object({
    id: NonEmptyTextSchema,
    stage: EvaluationStageSchema,
    detail: NonEmptyTextSchema,
  })
  .strict();

export const EvaluationScenarioResultSchema = z
  .object({
    scenarioId: NonEmptyTextSchema,
    passed: z.boolean(),
    issues: z.array(EvaluationIssueSchema),
    metrics: EvaluationMetricsSchema,
    proposalGenerated: z.boolean(),
  })
  .strict();

export const EvaluationRunSchema = z
  .object({
    corpusVersion: z.literal("1"),
    mode: z.enum(["offline", "provider"]),
    provider: NonEmptyTextSchema,
    modelId: NonEmptyTextSchema,
    reasoningConfiguration: NonEmptyTextSchema,
    results: z.array(EvaluationScenarioResultSchema),
  })
  .strict();

export type EvaluationIssue = z.infer<typeof EvaluationIssueSchema>;
export type EvaluationRun = z.infer<typeof EvaluationRunSchema>;
export type EvaluationScenarioResult = z.infer<
  typeof EvaluationScenarioResultSchema
>;
