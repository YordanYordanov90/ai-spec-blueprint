import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { GuardrailLibraryHero } from "@/components/docs/guardrail-library-hero";
import { GuardrailTopicCard } from "@/components/docs/guardrail-topic-card";
import { DocsShell } from "@/components/docs/docs-shell";
import { guardrailCategorySections } from "@/src/content/guardrails";

const outline = [
  { id: "orientation", label: "How to use this library" },
  { id: "catalog", label: "Topic catalog" },
  { id: "foundations", label: "Foundations" },
  { id: "architecture", label: "Architecture" },
  { id: "boundaries", label: "Boundaries" },
  { id: "workflow", label: "Workflow" },
  { id: "verification", label: "Verification" },
  { id: "closing-note", label: "A deliberate boundary" },
] as const;

export default function GuardrailLibraryPage() {
  return (
    <DocsShell outline={outline}>
      <GuardrailLibraryHero />

      <section id="orientation" className="scroll-mt-24 border-b border-border py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="blueprint-kicker text-accent">01 / Orientation</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
              Read for judgment, not for a universal scaffold.
            </h2>
          </div>
          <div className="grid gap-5 text-sm leading-7 text-muted-foreground sm:grid-cols-2">
            <p>
              Every topic separates the source concept from the way AI Spec
              Blueprint adapts it. Applicability is explicit because a useful
              control in one product can be needless infrastructure in another.
            </p>
            <p>
              The library is public education. Reading a topic does not approve
              it, add it to a project blueprint, or change a generated context
              package.
            </p>
          </div>
        </div>
      </section>

      <section id="catalog" className="scroll-mt-24 pt-12 sm:pt-16">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="blueprint-kicker text-accent">02 / Topic catalog</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              The register
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Five reading paths, twenty-four numbered modules, one consistent
            relationship: concept → applicability → adaptation → enforcement.
          </p>
        </div>

        <div className="mt-8 space-y-12">
          {guardrailCategorySections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)]"
            >
              <div className="lg:pt-4">
                <p className="font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")} / {section.topics.length} topics
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em]">
                  {section.label}
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <div className="border border-border bg-surface/55">
                {section.topics.map((topic) => (
                  <GuardrailTopicCard key={topic.slug} topic={topic} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section id="closing-note" className="scroll-mt-24 mt-14 border-y border-accent/35 bg-accent/6 p-5 sm:mt-20 sm:p-7">
        <p className="blueprint-kicker text-accent">03 / Deliberate boundary</p>
        <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <p className="max-w-2xl text-sm leading-7 text-foreground/85">
            These topics explain how to think about guardrails. The product still
            requires a reviewed feature or blueprint decision before an idea can
            become project state or an implementation rule.
          </p>
          <Link
            href="/new"
            className="flex min-h-11 shrink-0 items-center gap-3 border border-accent/50 px-4 font-mono text-[10px] tracking-[0.12em] text-foreground uppercase transition-colors hover:bg-accent/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start a project
            <ArrowRight aria-hidden="true" className="size-4 text-accent" />
          </Link>
        </div>
      </section>
    </DocsShell>
  );
}
