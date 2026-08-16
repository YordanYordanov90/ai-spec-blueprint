import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

const NonEmptyTextSchema = z.string().trim().min(1);

export const AiProviderSchema = z.literal("openai");

export const AiModelConfigSchema = z
  .object({
    provider: AiProviderSchema,
    model: NonEmptyTextSchema,
    apiKey: NonEmptyTextSchema,
  })
  .strict();

export type AiModelConfig = z.infer<typeof AiModelConfigSchema>;

const AiModelEnvSchema = z
  .object({
    OPENAI_API_KEY: NonEmptyTextSchema,
    OPENAI_MODEL: NonEmptyTextSchema,
  })
  .strict();

export function parseAiModelConfig(
  env: Record<string, string | undefined>,
): AiModelConfig {
  const parsedEnv = AiModelEnvSchema.parse({
    OPENAI_API_KEY: env.OPENAI_API_KEY,
    OPENAI_MODEL: env.OPENAI_MODEL,
  });

  return AiModelConfigSchema.parse({
    provider: "openai",
    model: parsedEnv.OPENAI_MODEL,
    apiKey: parsedEnv.OPENAI_API_KEY,
  });
}

export function loadAiModelConfig(
  env: NodeJS.ProcessEnv = process.env,
): AiModelConfig {
  return parseAiModelConfig(env);
}

export function createConfiguredLanguageModel(config: AiModelConfig) {
  const validatedConfig = AiModelConfigSchema.parse(config);
  const openai = createOpenAI({
    apiKey: validatedConfig.apiKey,
  });

  return openai(validatedConfig.model);
}
