import { z } from "zod";

const NonEmptyTextSchema = z.string().trim().min(1);
const TextListSchema = z.array(NonEmptyTextSchema).min(1);

export const DecisionProposalSourceSchema = z.enum([
  "human",
  "ai",
  "system",
]);

/**
 * Review state is separate from a decision's domain-specific position.
 * For example, a technology can be "preferred-if-needed" while its review
 * state records whether that recommendation is still a proposal or approved.
 */
export const DecisionReviewSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("proposed"),
    proposedBy: DecisionProposalSourceSchema,
  }),
  z.object({
    status: z.literal("approved"),
    proposedBy: DecisionProposalSourceSchema,
    approvedBy: z.literal("human"),
  }),
  z.object({
    status: z.literal("unresolved"),
    reason: NonEmptyTextSchema,
  }),
  z.object({
    status: z.literal("rejected"),
    rejectedBy: z.literal("human"),
    reason: NonEmptyTextSchema,
  }),
]);

export const TechnologyDecisionStatusSchema = z.enum([
  "confirmed",
  "preferred-if-needed",
  "unresolved",
  "rejected",
]);

export const TechnologyDecisionSchema = z
  .object({
    category: NonEmptyTextSchema,
    choice: NonEmptyTextSchema,
    status: TechnologyDecisionStatusSchema,
    rationale: NonEmptyTextSchema,
    constraints: z.array(NonEmptyTextSchema),
    review: DecisionReviewSchema,
  })
  .strict()
  .superRefine((decision, context) => {
    const reviewStatus = decision.review.status;
    const isCompatible =
      (decision.status === "confirmed" && reviewStatus === "approved") ||
      (decision.status === "preferred-if-needed" &&
        (reviewStatus === "proposed" || reviewStatus === "approved")) ||
      (decision.status === "unresolved" && reviewStatus === "unresolved") ||
      (decision.status === "rejected" && reviewStatus === "rejected");

    if (!isCompatible) {
      context.addIssue({
        code: "custom",
        message: "Technology status and review status must agree.",
        path: ["review", "status"],
      });
    }
  });

export const ArchitectureDecisionStatusSchema = z.enum([
  "approved",
  "proposed",
  "unresolved",
  "rejected",
]);

export const ArchitectureDecisionSchema = z
  .object({
    title: NonEmptyTextSchema,
    decision: NonEmptyTextSchema,
    rationale: NonEmptyTextSchema,
    constraints: z.array(NonEmptyTextSchema),
    status: ArchitectureDecisionStatusSchema,
    relatedAreas: TextListSchema,
    requiresAdr: z.boolean(),
    review: DecisionReviewSchema,
  })
  .strict()
  .superRefine((decision, context) => {
    if (decision.status !== decision.review.status) {
      context.addIssue({
        code: "custom",
        message: "Architecture status and review status must agree.",
        path: ["review", "status"],
      });
    }
  });

export const GuardrailCategorySchema = z.enum([
  "architecture",
  "scope",
  "security",
  "data",
  "AI",
  "UI",
  "testing",
  "workflow",
  "dependency",
  "Git",
]);

export const GuardrailSourceSchema = z.enum([
  "universal",
  "stack-profile",
  "project-specific",
  "human-authored",
]);

export const GuardrailSeveritySchema = z.enum([
  "required",
  "strong-preference",
  "advisory",
]);

export const GuardrailSchema = z
  .object({
    id: NonEmptyTextSchema,
    title: NonEmptyTextSchema,
    rule: NonEmptyTextSchema,
    category: GuardrailCategorySchema,
    source: GuardrailSourceSchema,
    severity: GuardrailSeveritySchema,
    rationale: NonEmptyTextSchema,
  })
  .strict();

export const GuardrailsSchema = z
  .array(GuardrailSchema)
  .min(1)
  .superRefine((guardrails, context) => {
    const seenIds = new Set<string>();

    guardrails.forEach((guardrail, index) => {
      if (seenIds.has(guardrail.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate guardrail id: ${guardrail.id}`,
          path: [index, "id"],
        });
      }

      seenIds.add(guardrail.id);
    });
  });

export const UnresolvedDecisionSchema = z
  .object({
    question: NonEmptyTextSchema,
    whyItMatters: NonEmptyTextSchema,
    optionsConsidered: z.array(NonEmptyTextSchema),
    blocking: z.boolean(),
    recommendedResolutionPoint: NonEmptyTextSchema,
  })
  .strict();

export type ArchitectureDecision = z.infer<
  typeof ArchitectureDecisionSchema
>;
export type DecisionReview = z.infer<typeof DecisionReviewSchema>;
export type Guardrail = z.infer<typeof GuardrailSchema>;
export type TechnologyDecision = z.infer<typeof TechnologyDecisionSchema>;
export type UnresolvedDecision = z.infer<typeof UnresolvedDecisionSchema>;
