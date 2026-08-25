import { AlertTriangle, Check, CircleDotDashed } from "lucide-react";

import { assessBlueprintReadiness } from "@/src/lib/blueprint/lifecycle/readiness";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";

const statusStyle = {
  blocking: "border-danger/40 bg-danger/8 text-danger",
  review: "border-warning/40 bg-warning/8 text-warning",
  ready: "border-success/40 bg-success/8 text-success",
} as const;

export function BlueprintReadinessPanel({
  blueprint,
}: {
  blueprint: ProjectBlueprint;
}) {
  const report = assessBlueprintReadiness(blueprint);
  const Icon =
    report.status === "blocking"
      ? AlertTriangle
      : report.status === "review"
        ? CircleDotDashed
        : Check;

  return (
    <aside aria-labelledby="blueprint-readiness-heading" className="border border-border bg-surface/90">
      <div className="border-b border-border p-5">
        <p className="blueprint-kicker text-muted-foreground">Quality gate</p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 id="blueprint-readiness-heading" className="text-lg font-semibold tracking-[-0.03em]">
              Blueprint readiness
            </h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{report.summary}</p>
          </div>
          <span className={`grid size-8 shrink-0 place-items-center border ${statusStyle[report.status]}`}>
            <Icon aria-hidden="true" className="size-4" />
          </span>
        </div>
      </div>
      {report.findings.length > 0 ? (
        <ul className="divide-y divide-border/70">
          {report.findings.map((finding) => (
            <li key={finding.id} className="px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium">{finding.title}</p>
                <span className={`font-mono text-[8px] uppercase ${finding.severity === "blocking" ? "text-danger" : "text-warning"}`}>
                  {finding.severity}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{finding.detail}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-5 text-xs text-success">No readiness issues detected.</p>
      )}
    </aside>
  );
}

