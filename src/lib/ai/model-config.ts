import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output, streamText } from "ai";
import { z } from "zod";

import {
  AI_MAX_OUTPUT_TOKENS,
  AI_MAX_PROMPT_CHARS,
  AI_MAX_SYSTEM_PROMPT_CHARS,
} from "./limits";

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

export const AiDataScopeSchema = z.enum([
  "initial-idea",
  "discovery-state",
  "approved-blueprint",
]);

export const AiCallApprovalSchema = z
  .object({
    approvedBy: z.literal("human"),
    purpose: NonEmptyTextSchema,
    dataScope: z.array(AiDataScopeSchema).min(1),
    includesSecrets: z.literal(false),
  })
  .strict();

export type AiCallApproval = z.infer<typeof AiCallApprovalSchema>;

export const AiCallInputSchema = z
  .object({
    prompt: NonEmptyTextSchema.max(AI_MAX_PROMPT_CHARS),
    system: NonEmptyTextSchema.max(AI_MAX_SYSTEM_PROMPT_CHARS).optional(),
  })
  .strict();

export type AiCallInput = z.infer<typeof AiCallInputSchema>;

export type ApprovedLanguageModel = Readonly<{
  provider: string;
  modelId: string;
  generateText: (
    input: AiCallInput,
    approval: AiCallApproval,
  ) => ReturnType<typeof generateText>;
  streamText: (
    input: AiCallInput,
    approval: AiCallApproval,
  ) => ReturnType<typeof streamText>;
  generateStructured: <Schema extends z.ZodType>(
    input: AiCallInput,
    approval: AiCallApproval,
    schema: Schema,
  ) => Promise<z.infer<Schema>>;
}>;

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

export function createConfiguredLanguageModel(
  config: AiModelConfig,
): ApprovedLanguageModel {
  const validatedConfig = AiModelConfigSchema.parse(config);
  const openai = createOpenAI({
    apiKey: validatedConfig.apiKey,
  });
  const model = openai(validatedConfig.model);

  return Object.freeze({
    provider: model.provider,
    modelId: model.modelId,
    generateText: (
      input: AiCallInput,
      approval: AiCallApproval,
    ) => {
      const validatedInput = AiCallInputSchema.parse(input);
      AiCallApprovalSchema.parse(approval);
      return generateText({
        ...validatedInput,
        maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
        model,
      });
    },
    streamText: (
      input: AiCallInput,
      approval: AiCallApproval,
    ) => {
      const validatedInput = AiCallInputSchema.parse(input);
      AiCallApprovalSchema.parse(approval);
      return streamText({
        ...validatedInput,
        maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
        model,
      });
    },
    generateStructured: async <Schema extends z.ZodType>(
      input: AiCallInput,
      approval: AiCallApproval,
      schema: Schema,
    ): Promise<z.infer<Schema>> => {
      const validatedInput = AiCallInputSchema.parse(input);
      AiCallApprovalSchema.parse(approval);
      const result = await generateText({
        ...validatedInput,
        maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
        model,
        output: Output.object({ schema }),
      });

      if (result.output == null) {
        throw new Error("Model did not return structured output.");
      }

      return schema.parse(result.output);
    },
  });
}
