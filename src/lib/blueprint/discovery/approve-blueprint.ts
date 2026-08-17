import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";
import type {
  ArchitectureDecision,
  TechnologyDecision,
} from "../schemas/decisions";

function approveTechnologyDecision(
  decision: TechnologyDecision,
): TechnologyDecision {
  if (decision.review.status !== "proposed") {
    return decision;
  }

  return {
    ...decision,
    review: {
      status: "approved",
      proposedBy: decision.review.proposedBy,
      approvedBy: "human",
    },
  };
}

function approveArchitectureDecision(
  decision: ArchitectureDecision,
): ArchitectureDecision {
  if (decision.review.status !== "proposed") {
    return decision;
  }

  return {
    ...decision,
    status: "approved",
    review: {
      status: "approved",
      proposedBy: decision.review.proposedBy,
      approvedBy: "human",
    },
  };
}

export function approveBlueprintProposal(
  blueprint: ProjectBlueprint,
): ProjectBlueprint {
  const validated = ProjectBlueprintSchema.parse(blueprint);

  return ProjectBlueprintSchema.parse({
    ...validated,
    stack: validated.stack.map(approveTechnologyDecision),
    architecture: validated.architecture.map(approveArchitectureDecision),
  });
}

export function blueprintHasPendingProposal(
  blueprint: ProjectBlueprint,
): boolean {
  return (
    blueprint.stack.some((decision) => decision.review.status === "proposed") ||
    blueprint.architecture.some((decision) => decision.review.status === "proposed")
  );
}
