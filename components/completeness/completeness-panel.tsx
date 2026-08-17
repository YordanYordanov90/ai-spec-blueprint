import type { CompletenessEntry } from "@/src/lib/blueprint/schemas/discovery";

import {
  completenessRows,
  type CompletenessDisplayStatus,
} from "./completeness-rows";

const statusMarks: Record<CompletenessDisplayStatus, string> = {
  complete: "✓",
  partial: "◐",
  missing: "!",
  unresolved: "?",
  "not-assessed": "○",
};

const statusStyles: Record<CompletenessDisplayStatus, string> = {
  complete: "border-success/35 bg-success/10 text-success",
  partial: "border-warning/35 bg-warning/10 text-warning",
  missing: "border-danger/35 bg-danger/10 text-danger",
  unresolved: "border-border bg-secondary text-muted-foreground",
  "not-assessed": "border-border bg-transparent text-muted-foreground",
};

export function CompletenessPanel({
  entries,
}: {
  entries: readonly CompletenessEntry[];
}) {
  const rows = completenessRows(entries);
  const assessed = rows.filter((row) => row.status !== "not-assessed");
  const completeCount = rows.filter((row) => row.status === "complete").length;

  return (
    <aside
      aria-labelledby="onboarding-blueprint-heading"
      className="border border-border bg-surface/90"
    >
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="blueprint-kicker text-muted-foreground">Project blueprint</p>
            <h2
              id="onboarding-blueprint-heading"
              className="mt-3 text-xl font-semibold tracking-[-0.035em]"
            >
              Definition state
            </h2>
          </div>
          <span className="border border-border bg-code-surface px-2 py-1 font-mono text-[9px] text-muted-foreground">
            {completeCount}/{rows.length}
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {assessed.length === 0
            ? "Areas stay unassessed until Grill Me records discovery facts."
            : `${completeCount} areas are complete. Every state is labeled explicitly.`}
        </p>
        <div aria-hidden="true" className="mt-5 grid grid-cols-11 gap-1">
          {rows.map((row) => (
            <span
              key={row.area}
              className={`h-1 ${
                row.status === "complete"
                  ? "bg-success"
                  : row.status === "partial"
                    ? "bg-warning"
                    : row.status === "missing"
                      ? "bg-danger"
                      : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
      <ul className="divide-y divide-border/70">
        {rows.map((row) => (
          <li
            key={row.area}
            className="group flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-surface-elevated"
          >
            <span className="text-xs text-foreground/90">{row.label}</span>
            <span
              className={`inline-flex min-w-24 items-center justify-between gap-2 border px-2 py-1 font-mono text-[8px] tracking-[0.08em] uppercase ${statusStyles[row.status]}`}
            >
              <span aria-hidden="true" className="text-[10px]">
                {statusMarks[row.status]}
              </span>
              <span>{row.statusLabel}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
