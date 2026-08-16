import {
  CompletenessAreaSchema,
  type CompletenessArea,
  type CompletenessEntry,
  type CompletenessStatus,
} from "@/src/lib/blueprint/schemas/discovery";

export type CompletenessDisplayStatus = CompletenessStatus | "not-assessed";

export type CompletenessRow = {
  area: CompletenessArea;
  label: string;
  status: CompletenessDisplayStatus;
  statusLabel: string;
};

const AREA_LABELS: Record<CompletenessArea, string> = {
  product: "Product",
  users: "Users",
  goals: "Goals",
  stack: "Stack",
  architecture: "Architecture",
  domain: "Domain",
  ui: "UI",
  security: "Security",
  ai: "AI",
  verification: "Verification",
  features: "Features",
};

const STATUS_LABELS: Record<CompletenessDisplayStatus, string> = {
  complete: "Complete",
  partial: "Partial",
  missing: "Missing",
  unresolved: "Unresolved",
  "not-assessed": "Not assessed",
};

export function completenessRows(
  entries: readonly CompletenessEntry[],
): CompletenessRow[] {
  const statusByArea = new Map(
    entries.map((entry) => [entry.area, entry.status]),
  );

  return CompletenessAreaSchema.options.map((area) => {
    const status = statusByArea.get(area) ?? "not-assessed";

    return {
      area,
      label: AREA_LABELS[area],
      status,
      statusLabel: STATUS_LABELS[status],
    };
  });
}
