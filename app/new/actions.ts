"use server";

import {
  createAiFailure,
  createConfiguredLanguageModel,
  loadAiModelConfig,
  runGrillMeAnswer,
  runGrillMeStart,
  type AiResult,
} from "@/src/lib/ai";
import type { DiscoveryState } from "@/src/lib/blueprint/schemas/discovery";

function loadDiscoveryModel(): AiResult<
  ReturnType<typeof createConfiguredLanguageModel>
> {
  try {
    return {
      ok: true,
      value: createConfiguredLanguageModel(loadAiModelConfig()),
    };
  } catch (error) {
    return {
      ok: false,
      error: createAiFailure(
        "provider-failure",
        "AI model configuration is missing or invalid.",
        error instanceof Error ? [error.message] : [],
      ),
    };
  }
}

export async function startGrillMeDiscovery(
  initialIdea: string,
): Promise<AiResult<DiscoveryState>> {
  const model = loadDiscoveryModel();

  if (!model.ok) {
    return model;
  }

  return runGrillMeStart({
    initialIdea,
    model: model.value,
  });
}

export async function answerGrillMeQuestion(
  state: DiscoveryState,
  answer: string,
): Promise<AiResult<DiscoveryState>> {
  const model = loadDiscoveryModel();

  if (!model.ok) {
    return model;
  }

  return runGrillMeAnswer({
    state,
    answer,
    model: model.value,
  });
}
