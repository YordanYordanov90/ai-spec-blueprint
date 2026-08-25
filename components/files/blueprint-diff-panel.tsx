import { GitCompareArrows } from "lucide-react";

import { compareBlueprints } from "@/src/lib/blueprint/lifecycle/compare-blueprints";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";

const statusStyles = {
  added: "text-success",
  changed: "text-warning",
  removed: "text-danger",
  unchanged: "text-muted-foreground",
} as const;

export function BlueprintDiffPanel({
  baseline,
  blueprint,
}: {
  baseline: ProjectBlueprint | null;
  blueprint: ProjectBlueprint;
}) {
  const diff = compareBlueprints(baseline, blueprint);
  const materialArtifacts = diff.artifacts.filter(
    (artifact) => artifact.status !== "unchanged",
  );

  return (
    <details className="mb-5 border border-border bg-code-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <span className="flex items-center gap-2 text-xs font-medium">
          <GitCompareArrows aria-hidden="true" className="size-4 text-accent" />
          {baseline ? "Changes from imported baseline" : "New context package"}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground uppercase">
          {materialArtifacts.length} file changes
        </span>
      </summary>
      <div className="grid gap-px border-t border-border bg-border lg:grid-cols-2">
        <div className="bg-surface p-4">
          <p className="blueprint-kicker text-muted-foreground">Blueprint sections</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {diff.changedSections.map((section) => (
              <li key={section} className="border border-warning/35 bg-warning/8 px-2 py-1 font-mono text-[9px] text-warning">
                {section}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface p-4">
          <p className="blueprint-kicker text-muted-foreground">Artifact plan</p>
          <ul className="mt-3 space-y-1.5">
            {materialArtifacts.map((artifact) => (
              <li key={artifact.path} className="flex items-center justify-between gap-3 font-mono text-[9px]">
                <span className="min-w-0 truncate">{artifact.path}</span>
                <span className={`uppercase ${statusStyles[artifact.status]}`}>{artifact.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}

