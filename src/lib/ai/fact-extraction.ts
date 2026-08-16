import { z } from "zod";

import {
  applyExtractedFacts,
  createInitialDiscoveryState,
} from "../blueprint/discovery/apply-extracted-facts";
import {
  DiscoveryStateSchema,
  ExtractedFactSchema,
  type DiscoveryState,
} from "../blueprint/schemas/discovery";
import { runAiOperation, type AiResult } from "./ai-failure";
import {
  AiCallApprovalSchema,
  type AiCallApproval,
  type ApprovedLanguageModel,
} from "./model-config";

const NonEmptyTextSchema = z.string().trim().min(1);

export const ProjectFactExtractionInputSchema = z
  .object({
    initialIdea: NonEmptyTextSchema,
    additionalUserInput: NonEmptyTextSchema.optional(),
    existingState: DiscoveryStateSchema.optional(),
  })
  .strict();

export type ProjectFactExtractionInput = z.infer<
  typeof ProjectFactExtractionInputSchema
>;

export const ExtractedFactsOutputSchema = z
  .object({
    facts: z.array(ExtractedFactSchema),
  })
  .strict();

const FACT_EXTRACTION_SYSTEM = [
  "Extract project facts from the provided Grill Me input.",
  "Return only structured facts. Do not write Markdown documents or a ProjectBlueprint.",
  "Mark source as explicit when the user stated the fact.",
  "Mark source as detected only when the fact is reliably implied by the provided text.",
  "Do not invent persistence, authentication, billing, or architecture decisions.",
  "Do not convert preferences into approved requirements.",
  "Do not create gaps, questions, or draft decisions.",
].join(" ");

function buildFactExtractionPrompt(state: DiscoveryState): string {
  const existingFacts =
    state.facts.length === 0
      ? "None yet."
      : state.facts
          .map((fact) => `- [${fact.source}/${fact.topic}] ${fact.statement}`)
          .join("\n");

  const messages = state.messages
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  return [
    `Initial idea: ${state.initialIdea}`,
    "Messages:",
    messages,
    "Already extracted facts:",
    existingFacts,
    "Extract only new facts supported by this input.",
  ].join("\n\n");
}

function discoveryStateFromInput(
  input: ProjectFactExtractionInput,
): DiscoveryState {
  if (!input.existingState) {
    const state = createInitialDiscoveryState(input.initialIdea);

    if (!input.additionalUserInput) {
      return state;
    }

    return DiscoveryStateSchema.parse({
      ...state,
      messages: [
        ...state.messages,
        { role: "user", content: input.additionalUserInput },
      ],
    });
  }

  if (!input.additionalUserInput) {
    return input.existingState;
  }

  return DiscoveryStateSchema.parse({
    ...input.existingState,
    messages: [
      ...input.existingState.messages,
      { role: "user", content: input.additionalUserInput },
    ],
  });
}

export async function extractProjectFacts(options: {
  input: ProjectFactExtractionInput;
  model: Pick<ApprovedLanguageModel, "generateStructured">;
  approval: AiCallApproval;
}): Promise<DiscoveryState> {
  const input = ProjectFactExtractionInputSchema.parse(options.input);
  const approval = AiCallApprovalSchema.parse(options.approval);
  const state = discoveryStateFromInput(input);
  const output = await options.model.generateStructured(
    {
      system: FACT_EXTRACTION_SYSTEM,
      prompt: buildFactExtractionPrompt(state),
    },
    approval,
    ExtractedFactsOutputSchema,
  );

  return applyExtractedFacts(state, output.facts);
}

export function extractProjectFactsResult(options: {
  input: ProjectFactExtractionInput;
  model: Pick<ApprovedLanguageModel, "generateStructured">;
  approval: AiCallApproval;
}): Promise<AiResult<DiscoveryState>> {
  return runAiOperation(() => extractProjectFacts(options), "provider-failure");
}
