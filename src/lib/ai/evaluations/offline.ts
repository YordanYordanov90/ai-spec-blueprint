import {
  EvaluationRunSchema,
  type EvaluationRun,
  type EvaluationScenarioResult,
} from "./schemas";
import { AI_QUALITY_EVALUATION_CORPUS } from "./corpus";
import { evaluateOfflineScenario } from "./graders";

export function runOfflineEvaluation(): EvaluationRun {
  const results = AI_QUALITY_EVALUATION_CORPUS.scenarios.map(
    evaluateOfflineScenario,
  );

  return EvaluationRunSchema.parse({
    corpusVersion: AI_QUALITY_EVALUATION_CORPUS.version,
    mode: "offline",
    provider: "deterministic",
    modelId: "current-deterministic-proposal",
    reasoningConfiguration: "not-applicable",
    results,
  });
}

export function summarizeEvaluationResults(
  results: readonly EvaluationScenarioResult[],
): { passed: number; failed: number } {
  return {
    passed: results.filter((result) => result.passed).length,
    failed: results.filter((result) => !result.passed).length,
  };
}
