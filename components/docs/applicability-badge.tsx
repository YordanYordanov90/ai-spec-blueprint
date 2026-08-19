import type { GuardrailApplicability } from "@/src/content/guardrails/types";

const labels: Record<GuardrailApplicability, string> = {
  universal: "Universal",
  conditional: "Conditional",
  "context-dependent": "Context-dependent",
};

export function ApplicabilityBadge({
  applicability,
}: {
  applicability: GuardrailApplicability;
}) {
  return (
    <span className="inline-flex min-h-7 items-center border border-accent/45 bg-accent/8 px-2 font-mono text-[9px] tracking-[0.11em] text-accent uppercase">
      {labels[applicability]}
    </span>
  );
}
