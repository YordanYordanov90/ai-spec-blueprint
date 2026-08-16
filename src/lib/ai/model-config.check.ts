import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  AiCallInputSchema,
  AiCallApprovalSchema,
  AiModelConfigSchema,
  createConfiguredLanguageModel,
  parseAiModelConfig,
} from "./model-config";

const validEnv = {
  OPENAI_API_KEY: "test-openai-key",
  OPENAI_MODEL: "configured-test-model",
};

const config = parseAiModelConfig({
  ...validEnv,
  UNUSED_ENV: "ignored",
});

const approvedCall = {
  approvedBy: "human",
  purpose: "Extract explicit project facts",
  dataScope: ["discovery-state"],
  includesSecrets: false,
} as const;
const approvedInput = {
  prompt: "Extract explicit project facts.",
  system: "Return only validated discovery facts.",
} as const;

assert.deepEqual(config, {
  provider: "openai",
  model: "configured-test-model",
  apiKey: "test-openai-key",
});

assert.deepEqual(
  parseAiModelConfig({
    OPENAI_API_KEY: "  test-openai-key  ",
    OPENAI_MODEL: "  configured-test-model  ",
  }),
  config,
);

assert.throws(() => parseAiModelConfig({}));
assert.throws(() =>
  parseAiModelConfig({
    OPENAI_API_KEY: "test-openai-key",
  }),
);
assert.throws(() =>
  parseAiModelConfig({
    OPENAI_MODEL: "configured-test-model",
  }),
);
assert.throws(() =>
  parseAiModelConfig({
    OPENAI_API_KEY: "test-openai-key",
    OPENAI_MODEL: "   ",
  }),
);
assert.throws(() =>
  parseAiModelConfig({
    OPENAI_API_KEY: "",
    OPENAI_MODEL: "configured-test-model",
  }),
);

assert.throws(() =>
  AiModelConfigSchema.parse({
    provider: "anthropic",
    model: "configured-test-model",
    apiKey: "test-openai-key",
  }),
);
assert.throws(() =>
  AiModelConfigSchema.parse({
    provider: "openai",
    model: "configured-test-model",
    apiKey: "test-openai-key",
    extra: true,
  }),
);

const model = createConfiguredLanguageModel(config);
assert.equal(model.modelId, "configured-test-model");
assert.equal(model.provider, "openai.responses");
assert.equal(typeof model.generateText, "function");
assert.equal(typeof model.streamText, "function");
assert.equal(typeof model.generateStructured, "function");
assert.equal("doGenerate" in model, false);
assert.equal("doStream" in model, false);
assert.equal("model" in model, false);

assert.deepEqual(AiCallApprovalSchema.parse(approvedCall), approvedCall);
assert.deepEqual(AiCallInputSchema.parse(approvedInput), approvedInput);
assert.throws(() =>
  model.generateText(
    approvedInput,
    {
      approvedBy: "human",
      purpose: "Extract explicit project facts",
      dataScope: ["discovery-state"],
      includesSecrets: true,
    } as never,
  ),
);
assert.throws(() =>
  model.streamText(
    {
      ...approvedInput,
      tools: {},
    } as never,
    {
      approvedBy: "human",
      purpose: "Extract explicit project facts",
      dataScope: ["discovery-state"],
      includesSecrets: false,
    } as never,
  ),
);

const modelConfigSource = readFileSync("src/lib/ai/model-config.ts", "utf8");
assert.doesNotMatch(modelConfigSource, /gpt-/i);
assert.doesNotMatch(modelConfigSource, /o1|o3|o4/);

const generatorFiles = readdirSync("src/lib/blueprint/generators");
for (const fileName of generatorFiles) {
  if (!fileName.endsWith(".ts")) {
    continue;
  }

  const source = readFileSync(
    join("src/lib/blueprint/generators", fileName),
    "utf8",
  );

  assert.doesNotMatch(source, /@ai-sdk\/openai/);
  assert.doesNotMatch(source, /from ["']ai["']/);
  assert.doesNotMatch(source, /lib\/ai/);
  assert.doesNotMatch(source, /OPENAI_MODEL/);
}

const schemaFiles = readdirSync("src/lib/blueprint/schemas");
for (const fileName of schemaFiles) {
  if (!fileName.endsWith(".ts")) {
    continue;
  }

  const source = readFileSync(
    join("src/lib/blueprint/schemas", fileName),
    "utf8",
  );

  assert.doesNotMatch(source, /@ai-sdk\/openai/);
  assert.doesNotMatch(source, /gpt-/i);
  assert.doesNotMatch(source, /OPENAI_MODEL/);
}

console.log("AI model configuration checks passed.");
