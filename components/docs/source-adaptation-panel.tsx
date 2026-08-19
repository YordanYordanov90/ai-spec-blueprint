import { ArrowRight } from "lucide-react";

import type { GuardrailTopic } from "@/src/content/guardrails";

export function SourceAdaptationPanel({ topic }: { topic: GuardrailTopic }) {
  return (
    <section id="adaptation" className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-accent" />
        <p className="blueprint-kicker text-accent">Source concept → product adaptation</p>
      </div>
      <div className="relative mt-5 grid gap-px border border-border bg-border lg:grid-cols-[1fr_auto_1fr]">
        <div className="bg-code-surface p-5 sm:p-6">
          <p className="font-mono text-[9px] tracking-[0.13em] text-muted-foreground uppercase">
            Source concept
          </p>
          <p className="mt-4 text-sm leading-7 text-foreground/90">
            {topic.sourceConcept}
          </p>
        </div>
        <div className="flex items-center justify-center bg-background px-4 py-2 text-accent lg:px-2 lg:py-0">
          <ArrowRight aria-hidden="true" className="size-4 rotate-90 lg:rotate-0" />
        </div>
        <div className="border-l-2 border-accent bg-accent/7 p-5 sm:p-6">
          <p className="font-mono text-[9px] tracking-[0.13em] text-accent uppercase">
            AI Spec Blueprint adaptation
          </p>
          <p className="mt-4 text-sm leading-7 text-foreground/90">
            {topic.productAdaptation}
          </p>
        </div>
      </div>
      {topic.applicability === "conditional" ? (
        <p className="mt-4 border-l-2 border-warning/70 bg-warning/6 px-4 py-3 text-xs leading-5 text-warning-foreground">
          Conditional pattern: do not generate or apply this control by default.
          Establish the project need, owner, and verification path first.
        </p>
      ) : null}
    </section>
  );
}
