import {
  DiscoveryStateSchema,
  type DiscoveryState,
  type DiscoveryQuestion,
  type InformationGap,
} from "../schemas/discovery";

function selectHighestValueGap(
  gaps: readonly InformationGap[],
): InformationGap | undefined {
  return gaps.find((gap) => gap.blocking) ?? gaps[0];
}

function renderQuestion(gap: InformationGap): DiscoveryQuestion {
  return {
    id: `question-${gap.id}`,
    prompt: gap.question,
    topic: gap.topic,
    whyItMatters: gap.whyItMatters,
    relatedGapIds: [gap.id],
  };
}

export function generateFollowUpQuestion(
  state: DiscoveryState,
): DiscoveryState {
  const validatedState = DiscoveryStateSchema.parse(state);

  if (validatedState.readyForBlueprintProposal) {
    return DiscoveryStateSchema.parse({
      ...validatedState,
      currentQuestion: undefined,
    });
  }

  const selectedGap = selectHighestValueGap(validatedState.gaps);

  if (!selectedGap) {
    return DiscoveryStateSchema.parse({
      ...validatedState,
      currentQuestion: undefined,
    });
  }

  return DiscoveryStateSchema.parse({
    ...validatedState,
    currentQuestion: renderQuestion(selectedGap),
    readyForBlueprintProposal: false,
  });
}
