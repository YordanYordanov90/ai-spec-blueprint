import { blueprintHasPendingProposal } from "../discovery/approve-blueprint";
import {
  ProjectBlueprintSchema,
  type ProjectBlueprint,
} from "../schemas/project-blueprint";

export type ReadinessSeverity = "blocking" | "review" | "ready";

export type ReadinessFinding = {
  id: string;
  severity: Exclude<ReadinessSeverity, "ready">;
  title: string;
  detail: string;
};

export type BlueprintReadiness = {
  status: ReadinessSeverity;
  findings: readonly ReadinessFinding[];
  summary: string;
};

export function assessBlueprintReadiness(
  blueprint: ProjectBlueprint,
): BlueprintReadiness {
  const validated = ProjectBlueprintSchema.parse(blueprint);
  const findings: ReadinessFinding[] = [];
  const blocking = validated.unresolvedDecisions.filter(
    (decision) => decision.blocking,
  );
  const nonBlocking = validated.unresolvedDecisions.filter(
    (decision) => !decision.blocking,
  );

  if (blocking.length > 0) {
    findings.push({
      id: "blocking-decisions",
      severity: "blocking",
      title: `${blocking.length} blocking decision${blocking.length === 1 ? "" : "s"}`,
      detail: "Resolve these decisions before generating durable project context.",
    });
  }

  if (blueprintHasPendingProposal(validated)) {
    findings.push({
      id: "pending-proposals",
      severity: "review",
      title: "Proposed decisions need review",
      detail: "Approve or reject every stack and architecture proposal.",
    });
  }

  if (nonBlocking.length > 0) {
    findings.push({
      id: "non-blocking-decisions",
      severity: "review",
      title: `${nonBlocking.length} deferred decision${nonBlocking.length === 1 ? "" : "s"}`,
      detail: "These may remain unresolved, but the exported context will record them.",
    });
  }

  const inProgress = validated.features.filter(
    (feature) => feature.status === "in-progress",
  );
  if (inProgress.length === 0) {
    findings.push({
      id: "no-active-feature",
      severity: "review",
      title: "No active feature",
      detail: "The CLI can prepare the first scoped feature after export.",
    });
  }

  const status: ReadinessSeverity = findings.some(
    (finding) => finding.severity === "blocking",
  )
    ? "blocking"
    : findings.some((finding) => finding.severity === "review")
      ? "review"
      : "ready";

  return {
    status,
    findings,
    summary:
      status === "blocking"
        ? "Resolve blocking decisions before export."
        : status === "review"
          ? "Export is possible after reviewing the remaining notices."
          : "The blueprint is ready for deterministic generation.",
  };
}

