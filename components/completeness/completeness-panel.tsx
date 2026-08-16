import type { CompletenessEntry } from "@/src/lib/blueprint/schemas/discovery";

import {
  completenessRows,
  type CompletenessDisplayStatus,
} from "./completeness-rows";

const statusMarks: Record<CompletenessDisplayStatus, string> = {
  complete: "done",
  partial: "partial",
  missing: "missing",
  unresolved: "open",
  "not-assessed": "idle",
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
      className="border border-border bg-card/60 p-6"
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        Blueprint state
      </p>
      <h2
        id="onboarding-blueprint-heading"
        className="mt-3 font-heading text-xl tracking-tight"
      >
        Completeness
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {assessed.length === 0
          ? "Areas stay unassessed until Grill Me records discovery facts."
          : `${completeCount} of ${rows.length} areas complete. Status is labeled in text, not by color alone.`}
      </p>
      <ul className="mt-5 space-y-2">
        {rows.map((row) => (
          <li
            key={row.area}
            className="flex items-center justify-between gap-3 border border-border/80 bg-background/70 px-3 py-2"
          >
            <span className="text-sm">{row.label}</span>
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              <span aria-hidden="true">{statusMarks[row.status]}</span>
              <span>{row.statusLabel}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
