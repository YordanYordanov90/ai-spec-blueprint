import type {
  ArchitectureDecision,
  TechnologyDecision,
} from "../schemas/decisions";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";

export type ReviewDecisionTarget = "stack" | "architecture";
export type ReviewDecisionAction = "approve" | "reject";

function reviewTechnology(
  decision: TechnologyDecision,
  action: ReviewDecisionAction,
  reason: string,
): TechnologyDecision {
  if (decision.review.status !== "proposed") return decision;
  return action === "approve"
    ? {
        ...decision,
        review: {
          status: "approved",
          proposedBy: decision.review.proposedBy,
          approvedBy: "human",
        },
      }
    : {
        ...decision,
        status: "rejected",
        review: { status: "rejected", rejectedBy: "human", reason },
      };
}

function reviewArchitecture(
  decision: ArchitectureDecision,
  action: ReviewDecisionAction,
  reason: string,
): ArchitectureDecision {
  if (decision.review.status !== "proposed") return decision;
  return action === "approve"
    ? {
        ...decision,
        status: "approved",
        review: {
          status: "approved",
          proposedBy: decision.review.proposedBy,
          approvedBy: "human",
        },
      }
    : {
        ...decision,
        status: "rejected",
        review: { status: "rejected", rejectedBy: "human", reason },
      };
}

export function reviewBlueprintDecision(
  blueprint: ProjectBlueprint,
  target: ReviewDecisionTarget,
  index: number,
  action: ReviewDecisionAction,
  reason = "Rejected during blueprint review.",
): ProjectBlueprint {
  const validated = ProjectBlueprintSchema.parse(blueprint);

  if (target === "stack") {
    return ProjectBlueprintSchema.parse({
      ...validated,
      stack: validated.stack.map((decision, decisionIndex) =>
        decisionIndex === index
          ? reviewTechnology(decision, action, reason)
          : decision,
      ),
    });
  }

  return ProjectBlueprintSchema.parse({
    ...validated,
    architecture: validated.architecture.map((decision, decisionIndex) =>
      decisionIndex === index
        ? reviewArchitecture(decision, action, reason)
        : decision,
    ),
  });
}

