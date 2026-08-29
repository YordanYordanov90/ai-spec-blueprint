import { z } from "zod";

import {
  extractProjectFactsResult,
} from "../fact-extraction";
import {
  analyzeMissingInformation,
} from "../../blueprint/discovery/analyze-missing-information";
import {
  createInitialDiscoveryState,
} from "../../blueprint/discovery/apply-extracted-facts";
import type { DiscoveryState } from "../../blueprint/schemas/discovery";
import type {
  AiCallApproval,
  ApprovedLanguageModel,
} from "../model-config";
import {
  EvaluationMetricsSchema,
  EvaluationRunSchema,
  type EvaluationIssue,
  type EvaluationMetrics,
  type EvaluationRun,
  type EvaluationScenario,
} from "./schemas";
import { AI_QUALITY_EVALUATION_CORPUS } from "./corpus";
import { evaluateScenario } from "./graders";

const ReasoningConfigurationSchema = z.enum([
  "default",
  "low",
  "medium",
  "high",
]);

type MutableMetrics = {
  latencyMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  schemaFailures: number;
  retries: number;
};

function addTokenUsage(
  current: number | null,
  next: number | null,
): number | null {
  if (current === null || next === null) {
    return current === null && next === null ? null : current ?? next;
  }

  return current + next;
}

function instrumentModel(
  model: ApprovedLanguageModel,
  metrics: MutableMetrics,
): Pick<ApprovedLanguageModel, "generateStructured"> {
  return {
    generateStructured: async (input, approval, schema) => {
      const startedAt = Date.now();

      try {
        if (model.generateStructuredWithMetrics) {
          const result = await model.generateStructuredWithMetrics(
            input,
            approval,
            schema,
          );
          metrics.inputTokens = addTokenUsage(
            metrics.inputTokens,
            result.usage.inputTokens,
          );
          metrics.outputTokens = addTokenUsage(
            metrics.outputTokens,
            result.usage.outputTokens,
          );
          metrics.totalTokens = addTokenUsage(
            metrics.totalTokens,
            result.usage.totalTokens,
          );
          return result.output;
        }

        return await model.generateStructured(input, approval, schema);
      } catch (error) {
        if (error instanceof z.ZodError) {
          metrics.schemaFailures += 1;
        }

        throw error;
      } finally {
        metrics.latencyMs += Date.now() - startedAt;
      }
    },
  };
}

function toMetrics(metrics: MutableMetrics): EvaluationMetrics {
  return EvaluationMetricsSchema.parse(metrics);
}

function appendIssue(
  issues: EvaluationIssue[],
  detail: string,
): void {
  issues.push({
    id: "provider-operation",
    stage: "fact-extraction",
    detail,
  });
}

async function runProviderScenario(options: {
  scenario: EvaluationScenario;
  model: ApprovedLanguageModel;
  approval: AiCallApproval;
}) {
  const metrics: MutableMetrics = {
    latencyMs: 0,
    inputTokens: null,
    outputTokens: null,
    totalTokens: null,
    schemaFailures: 0,
    retries: 0,
  };
  const instrumentedModel = instrumentModel(options.model, metrics);
  const issues: EvaluationIssue[] = [];
  let state: DiscoveryState = createInitialDiscoveryState(
    options.scenario.initialIdea,
  );

  for (const answer of options.scenario.answers) {
    const result = await extractProjectFactsResult({
      input: {
        initialIdea: options.scenario.initialIdea,
        additionalUserInput: answer,
        existingState: state,
      },
      model: instrumentedModel,
      approval: options.approval,
    });

    if (!result.ok) {
      appendIssue(issues, `${result.error.kind}: ${result.error.message}`);
      break;
    }

    state = result.value;
  }

  state = analyzeMissingInformation(state);

  return evaluateScenario({
    scenario: options.scenario,
    state,
    metrics: toMetrics(metrics),
    extraIssues: issues,
  });
}

export async function runProviderEvaluation(options: {
  model: ApprovedLanguageModel;
  approval: AiCallApproval;
  reasoningConfiguration: string;
}): Promise<EvaluationRun> {
  const reasoningConfiguration = ReasoningConfigurationSchema.parse(
    options.reasoningConfiguration,
  );
  const results = [];

  for (const scenario of AI_QUALITY_EVALUATION_CORPUS.scenarios) {
    results.push(
      await runProviderScenario({
        scenario,
        model: options.model,
        approval: options.approval,
      }),
    );
  }

  return EvaluationRunSchema.parse({
    corpusVersion: AI_QUALITY_EVALUATION_CORPUS.version,
    mode: "provider",
    provider: options.model.provider,
    modelId: options.model.modelId,
    reasoningConfiguration,
    results,
  });
}
