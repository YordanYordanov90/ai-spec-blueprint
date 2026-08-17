import { z } from "zod";

import { analyzeMissingInformation } from "./analyze-missing-information";
import { generateFollowUpQuestion } from "./generate-follow-up-question";
import {
  DiscoveryStateSchema,
  type DiscoveryState,
} from "../schemas/discovery";

const NonEmptyAnswerSchema = z.string().trim().min(1);

export function continueDiscoveryAfterFacts(
  state: DiscoveryState,
): DiscoveryState {
  return generateFollowUpQuestion(analyzeMissingInformation(state));
}

export function prepareDiscoveryAnswer(
  state: DiscoveryState,
  answer: string,
): DiscoveryState {
  const validatedState = DiscoveryStateSchema.parse(state);
  const validatedAnswer = NonEmptyAnswerSchema.parse(answer);

  if (validatedState.readyForBlueprintProposal) {
    throw new Error("Discovery is already ready for a blueprint proposal.");
  }

  const messages = [...validatedState.messages];

  if (validatedState.currentQuestion) {
    messages.push({
      role: "assistant",
      content: validatedState.currentQuestion.prompt,
    });
  }

  messages.push({
    role: "user",
    content: validatedAnswer,
  });

  return DiscoveryStateSchema.parse({
    ...validatedState,
    messages,
    currentQuestion: undefined,
  });
}
