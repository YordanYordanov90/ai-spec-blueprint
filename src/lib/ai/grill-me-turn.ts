import { z } from "zod";

import {
  continueDiscoveryAfterFacts,
  prepareDiscoveryAnswer,
} from "../blueprint/discovery/continue-discovery";
import {
  DiscoveryStateSchema,
  type DiscoveryState,
} from "../blueprint/schemas/discovery";
import {
  createAiFailure,
  runAiOperation,
  type AiResult,
} from "./ai-failure";
import {
  extractProjectFacts,
  ProjectFactExtractionInputSchema,
} from "./fact-extraction";
import {
  AiCallApprovalSchema,
  type AiCallApproval,
  type ApprovedLanguageModel,
} from "./model-config";

const NonEmptyTextSchema = z.string().trim().min(1);

const START_APPROVAL = AiCallApprovalSchema.parse({
  approvedBy: "human",
  purpose: "Extract project facts from the initial idea",
  dataScope: ["initial-idea"],
  includesSecrets: false,
});

const ANSWER_APPROVAL = AiCallApprovalSchema.parse({
  approvedBy: "human",
  purpose: "Extract project facts from a Grill Me answer",
  dataScope: ["discovery-state"],
  includesSecrets: false,
});

export async function advanceGrillMeTurn(options: {
  input: z.input<typeof ProjectFactExtractionInputSchema>;
  model: Pick<ApprovedLanguageModel, "generateStructured">;
  approval: AiCallApproval;
}): Promise<DiscoveryState> {
  const extracted = await extractProjectFacts(options);
  return continueDiscoveryAfterFacts(extracted);
}

export function advanceGrillMeTurnResult(options: {
  input: z.input<typeof ProjectFactExtractionInputSchema>;
  model: Pick<ApprovedLanguageModel, "generateStructured">;
  approval: AiCallApproval;
}): Promise<AiResult<DiscoveryState>> {
  return runAiOperation(() => advanceGrillMeTurn(options), "provider-failure");
}

export async function runGrillMeStart(options: {
  initialIdea: unknown;
  model: Pick<ApprovedLanguageModel, "generateStructured">;
}): Promise<AiResult<DiscoveryState>> {
  const idea = NonEmptyTextSchema.safeParse(options.initialIdea);

  if (!idea.success) {
    return {
      ok: false,
      error: createAiFailure(
        "user-input-failure",
        "Enter a project idea before continuing.",
      ),
    };
  }

  return advanceGrillMeTurnResult({
    input: { initialIdea: idea.data },
    model: options.model,
    approval: START_APPROVAL,
  });
}

export async function runGrillMeAnswer(options: {
  state: unknown;
  answer: unknown;
  model: Pick<ApprovedLanguageModel, "generateStructured">;
}): Promise<AiResult<DiscoveryState>> {
  const answer = NonEmptyTextSchema.safeParse(options.answer);

  if (!answer.success) {
    return {
      ok: false,
      error: createAiFailure(
        "user-input-failure",
        "Enter an answer before continuing.",
      ),
    };
  }

  const parsedState = DiscoveryStateSchema.safeParse(options.state);

  if (!parsedState.success) {
    return {
      ok: false,
      error: createAiFailure(
        "user-input-failure",
        "Discovery state is invalid.",
        parsedState.error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
          return `${path}: ${issue.message}`;
        }),
      ),
    };
  }

  if (parsedState.data.readyForBlueprintProposal) {
    return {
      ok: false,
      error: createAiFailure(
        "application-validation-failure",
        "Discovery is already ready for a blueprint proposal.",
      ),
    };
  }

  let prepared: DiscoveryState;

  try {
    prepared = prepareDiscoveryAnswer(parsedState.data, answer.data);
  } catch (error) {
    return {
      ok: false,
      error: createAiFailure(
        "user-input-failure",
        error instanceof Error
          ? error.message
          : "The Grill Me answer could not be recorded.",
      ),
    };
  }

  return advanceGrillMeTurnResult({
    input: {
      initialIdea: prepared.initialIdea,
      existingState: prepared,
    },
    model: options.model,
    approval: ANSWER_APPROVAL,
  });
}
