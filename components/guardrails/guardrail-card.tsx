import { Check, ShieldCheck } from "lucide-react";

import type { Guardrail } from "@/src/lib/blueprint/schemas/decisions";

export function GuardrailCard({
  guardrail,
  enforcement = [],
  example = false,
}: {
  guardrail: Guardrail;
  enforcement?: readonly string[];
  example?: boolean;
}) {
  return (
    <article className="group relative overflow-hidden border border-border bg-surface-elevated/80">
      <div className="absolute inset-y-0 left-0 w-px bg-accent/70" />
      <div className="flex items-start justify-between gap-5 border-b border-border/80 p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="blueprint-kicker text-accent">
              {guardrail.category}
            </span>
            {example ? (
              <span className="border border-border px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] text-muted-foreground uppercase">
                Example
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-foreground">
            {guardrail.title}
          </h3>
        </div>
        <ShieldCheck
          aria-hidden="true"
          className="size-5 shrink-0 text-accent transition-transform group-hover:scale-110"
        />
      </div>
      <div className="grid gap-px bg-border/60 sm:grid-cols-[1.4fr_0.6fr]">
        <div className="bg-surface p-5">
          <p className="text-sm leading-6 text-foreground/90">{guardrail.rule}</p>
          <p className="mt-4 border-l border-border pl-3 text-xs leading-5 text-muted-foreground">
            <span className="font-medium text-foreground">Why: </span>
            {guardrail.rationale}
          </p>
        </div>
        <dl className="bg-code-surface p-5 font-mono text-[10px] leading-5">
          <div>
            <dt className="tracking-[0.12em] text-muted-foreground uppercase">
              Source
            </dt>
            <dd className="mt-1 break-words text-foreground">
              {guardrail.source.replaceAll("-", " ")}
            </dd>
          </div>
          <div className="mt-4">
            <dt className="tracking-[0.12em] text-muted-foreground uppercase">
              Severity
            </dt>
            <dd className="mt-1 text-foreground">
              {guardrail.severity.replaceAll("-", " ")}
            </dd>
          </div>
        </dl>
      </div>
      {enforcement.length > 0 ? (
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border/80 px-5 py-3">
          <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
            Enforced by
          </span>
          {enforcement.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 font-mono text-[9px] text-foreground/80"
            >
              <Check aria-hidden="true" className="size-3 text-success" />
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
