import { createConfiguredLanguageModel, loadAiModelConfig } from "../model-config";
import { runProviderEvaluation } from "./provider";

if (process.env.AI_EVAL_RUN_PROVIDER !== "1") {
  console.error(
    "Provider-backed evaluation is opt-in. Set AI_EVAL_RUN_PROVIDER=1 to run it.",
  );
  process.exitCode = 1;
} else {
  const model = createConfiguredLanguageModel(loadAiModelConfig());

  void runProviderEvaluation({
    model,
    approval: {
      approvedBy: "human",
      purpose: "Run the versioned AI quality evaluation corpus",
      dataScope: ["initial-idea", "discovery-state"],
      includesSecrets: false,
    },
    reasoningConfiguration: process.env.AI_EVAL_REASONING_EFFORT ?? "default",
  })
    .then((run) => {
      console.log(JSON.stringify(run, null, 2));
    })
    .catch((error: unknown) => {
      console.error(
        error instanceof Error
          ? `Provider-backed evaluation failed: ${error.message}`
          : "Provider-backed evaluation failed.",
      );
      process.exitCode = 1;
    });
}
