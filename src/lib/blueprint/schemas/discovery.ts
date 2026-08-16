import { z } from "zod";

import { DecisionProposalSourceSchema } from "./decisions";

const NonEmptyTextSchema = z.string().trim().min(1);

export const DiscoveryMessageRoleSchema = z.enum([
  "user",
  "assistant",
  "system",
]);

export const DiscoveryMessageSchema = z
  .object({
    role: DiscoveryMessageRoleSchema,
    content: NonEmptyTextSchema,
  })
  .strict();

export const FactSourceSchema = z.enum(["explicit", "detected"]);

export const DiscoveryTopicSchema = z.enum([
  "product-problem",
  "users",
  "mvp-scope",
  "non-goals",
  "user-roles",
  "core-flows",
  "domain",
  "persistence",
  "authentication",
  "integrations",
  "security",
  "ai",
  "human-approval",
  "deployment",
  "ui",
  "testing",
  "operations",
  "other",
]);

export const ExtractedFactSchema = z
  .object({
    id: NonEmptyTextSchema,
    statement: NonEmptyTextSchema,
    source: FactSourceSchema,
    topic: DiscoveryTopicSchema,
  })
  .strict();

export const InformationGapSchema = z
  .object({
    id: NonEmptyTextSchema,
    topic: DiscoveryTopicSchema,
    question: NonEmptyTextSchema,
    whyItMatters: NonEmptyTextSchema,
    blocking: z.boolean(),
  })
  .strict();

export const DiscoveryQuestionSchema = z
  .object({
    id: NonEmptyTextSchema,
    prompt: NonEmptyTextSchema,
    topic: DiscoveryTopicSchema,
    whyItMatters: NonEmptyTextSchema,
    relatedGapIds: z.array(NonEmptyTextSchema),
  })
  .strict();

export const DraftDecisionStatusSchema = z.enum(["draft", "proposed"]);

export const DraftDecisionSchema = z
  .object({
    id: NonEmptyTextSchema,
    topic: DiscoveryTopicSchema,
    proposal: NonEmptyTextSchema,
    status: DraftDecisionStatusSchema,
    proposedBy: DecisionProposalSourceSchema,
  })
  .strict();

export const CompletenessStatusSchema = z.enum([
  "missing",
  "partial",
  "complete",
  "unresolved",
]);

export const CompletenessAreaSchema = z.enum([
  "product",
  "users",
  "goals",
  "stack",
  "architecture",
  "domain",
  "ui",
  "security",
  "ai",
  "verification",
  "features",
]);

const MINIMUM_READY_FACTS = 1;

export const CompletenessEntrySchema = z
  .object({
    area: CompletenessAreaSchema,
    status: CompletenessStatusSchema,
  })
  .strict();

function addDuplicateIdIssues(
  ids: readonly string[],
  context: z.RefinementCtx,
  path: ReadonlyArray<string | number>,
): void {
  const seenIds = new Set<string>();

  ids.forEach((id, index) => {
    if (seenIds.has(id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate id: ${id}`,
        path: [...path, index, "id"],
      });
    }

    seenIds.add(id);
  });
}

export const DiscoveryStateSchema = z
  .object({
    initialIdea: NonEmptyTextSchema,
    messages: z.array(DiscoveryMessageSchema),
    facts: z.array(ExtractedFactSchema),
    gaps: z.array(InformationGapSchema),
    currentQuestion: DiscoveryQuestionSchema.optional(),
    draftDecisions: z.array(DraftDecisionSchema),
    completeness: z.array(CompletenessEntrySchema),
    readyForBlueprintProposal: z.boolean(),
  })
  .strict()
  .superRefine((state, context) => {
    addDuplicateIdIssues(
      state.facts.map((fact) => fact.id),
      context,
      ["facts"],
    );
    addDuplicateIdIssues(
      state.gaps.map((gap) => gap.id),
      context,
      ["gaps"],
    );
    addDuplicateIdIssues(
      state.draftDecisions.map((decision) => decision.id),
      context,
      ["draftDecisions"],
    );

    const seenAreas = new Set<string>();
    state.completeness.forEach((entry, index) => {
      if (seenAreas.has(entry.area)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate completeness area: ${entry.area}`,
          path: ["completeness", index, "area"],
        });
      }

      seenAreas.add(entry.area);
    });

    const gapIds = new Set(state.gaps.map((gap) => gap.id));
    state.currentQuestion?.relatedGapIds.forEach((gapId, index) => {
      if (!gapIds.has(gapId)) {
        context.addIssue({
          code: "custom",
          message: `Unknown related gap id: ${gapId}`,
          path: ["currentQuestion", "relatedGapIds", index],
        });
      }
    });

    const blockingGaps = state.gaps.filter((gap) => gap.blocking);
    if (state.readyForBlueprintProposal && blockingGaps.length > 0) {
      context.addIssue({
        code: "custom",
        message: "Discovery cannot be ready for a blueprint proposal while blocking gaps remain.",
        path: ["readyForBlueprintProposal"],
      });
    }

    if (state.readyForBlueprintProposal && state.currentQuestion) {
      context.addIssue({
        code: "custom",
        message: "Discovery cannot be ready for a blueprint proposal while a question is still current.",
        path: ["currentQuestion"],
      });
    }

    if (state.readyForBlueprintProposal) {
      const hasUserMessage = state.messages.some(
        (message) => message.role === "user",
      );
      const incompleteAreas = state.completeness.filter(
        (entry) => entry.status === "missing" || entry.status === "partial",
      );

      if (incompleteAreas.length > 0) {
        context.addIssue({
          code: "custom",
          message:
            "Discovery cannot be ready while completeness areas are missing or partial.",
          path: ["completeness"],
        });
      }

      if (state.draftDecisions.length > 0) {
        context.addIssue({
          code: "custom",
          message:
            "Discovery cannot be ready while draft decisions remain unresolved.",
          path: ["draftDecisions"],
        });
      }

      if (!hasUserMessage) {
        context.addIssue({
          code: "custom",
          message:
            "Discovery cannot be ready without at least one user-provided message.",
          path: ["messages"],
        });
      }

      if (state.facts.length < MINIMUM_READY_FACTS) {
        context.addIssue({
          code: "custom",
          message:
            "Discovery cannot be ready without at least one extracted fact.",
          path: ["facts"],
        });
      }
    }
  });

export type CompletenessArea = z.infer<typeof CompletenessAreaSchema>;
export type CompletenessEntry = z.infer<typeof CompletenessEntrySchema>;
export type CompletenessStatus = z.infer<typeof CompletenessStatusSchema>;
export type DiscoveryMessage = z.infer<typeof DiscoveryMessageSchema>;
export type DiscoveryQuestion = z.infer<typeof DiscoveryQuestionSchema>;
export type DiscoveryState = z.infer<typeof DiscoveryStateSchema>;
export type DiscoveryTopic = z.infer<typeof DiscoveryTopicSchema>;
export type DraftDecision = z.infer<typeof DraftDecisionSchema>;
export type ExtractedFact = z.infer<typeof ExtractedFactSchema>;
export type InformationGap = z.infer<typeof InformationGapSchema>;
