import { ArrowRight, Braces, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function GuardrailLibraryHero() {
  const readingSignals = [
    { Icon: ShieldCheck, label: "CONCEPT", detail: "source idea" },
    { Icon: Check, label: "APPLICABILITY", detail: "use with judgment" },
    { Icon: Braces, label: "ADAPTATION", detail: "product boundary" },
    { Icon: ArrowRight, label: "ENFORCEMENT", detail: "feedback loop" },
  ];

  return (
    <section className="blueprint-enter border-b border-border pb-12 sm:pb-16">
      <div className="flex flex-wrap items-center gap-3">
        <span className="h-px w-8 bg-accent" />
        <p className="blueprint-kicker text-accent">Guardrail library / public field manual</p>
      </div>
      <div className="mt-7 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            24 documented modules / web surface
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.03] tracking-[-0.06em] text-balance sm:text-6xl">
            Architecture that stays legible under pressure.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Read the concepts behind safer coding-agent environments, then see
            where AI Spec Blueprint adapts them into explicit, reviewable project
            decisions. This is an educational library, not an automatic blueprint
            mutation surface.
          </p>
        </div>
        <div className="border border-border bg-code-surface p-5 sm:p-6">
          <p className="blueprint-kicker text-accent">Reading path</p>
          <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 font-mono text-[10px]">
            {[
              ["01", "CONCEPT", "what the pattern means"],
              ["02", "APPLICABILITY", "when it earns a place"],
              ["03", "ADAPTATION", "how this product uses it"],
              ["04", "ENFORCEMENT", "what can verify it"],
            ].map(([number, label, detail]) => (
              <div key={number} className="contents">
                <span className="text-accent">{number}</span>
                <span>
                  <span className="text-foreground">{label}</span>
                  <span className="mt-1 block text-muted-foreground">{detail}</span>
                </span>
              </div>
            ))}
          </div>
          <Link
            href="#catalog"
            className="mt-6 flex min-h-11 items-center justify-between border-t border-border pt-4 font-mono text-[10px] tracking-[0.12em] text-foreground uppercase transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start with the catalog
            <ArrowRight aria-hidden="true" className="size-4 text-accent" />
          </Link>
        </div>
      </div>
      <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-4">
        {readingSignals.map(({ Icon, label, detail }) => (
          <div key={label} className="bg-surface p-4">
            <Icon aria-hidden="true" className="size-4 text-accent" />
            <p className="mt-4 font-mono text-[9px] tracking-[0.12em] text-foreground">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
