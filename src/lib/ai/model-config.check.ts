import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
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
