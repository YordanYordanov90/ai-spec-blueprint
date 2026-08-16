import Link from "next/link";

import { Button } from "@/components/ui/button";

const workflowStages = [
  {
    id: "01",
    title: "Describe the idea",
    detail: "Start with the problem, not a prompt transcript.",
  },
  {
    id: "02",
    title: "Grill Me",
    detail: "Answer only the questions that change scope or architecture.",
  },
  {
    id: "03",
    title: "Review the blueprint",
    detail: "Approve decisions before anything becomes durable context.",
  },
  {
    id: "04",
    title: "Generate files",
    detail: "Deterministic renderers write the known Markdown formats.",
  },
] as const;

const contextFiles = [
  "AGENTS.md",
  "context/project-overview.md",
  "context/architecture.md",
  "context/schemas.md",
  "context/code-standards.md",
  "context/progress-tracker.md",
] as const;

const surfaces = [
  {
    title: "Web",
    detail: "Discovery, review, and export for the first product interface.",
  },
  {
    title: "Blueprint Core",
    detail: "Shared schemas, guardrails, and generators. No React. No CLI I/O.",
  },
  {
    title: "CLI",
    detail: "Later repository workflows over the same core, not a second product.",
  },
] as const;

export default function Home() {
  return (
    <div className="relative isolate min-h-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.035)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.035)_1px,transparent_1px)] bg-size-[28px_28px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.08_95/0.08),transparent_60%)]"
      />

      <header className="relative z-10 border-b border-border/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            AI Spec Blueprint
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            spec before implementation
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-16 sm:py-24">
        <section className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="flex flex-col gap-8">
            <p className="font-mono text-xs tracking-[0.18em] text-status uppercase">
              Durable context for coding agents
            </p>
            <h1 className="max-w-3xl font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Chat history is not a project architecture.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              AI coding sessions lose decisions when requirements live only in
              conversation. This product turns an early idea into reviewable
              project context that agents can reuse across sessions.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-11 rounded-md px-5">
                <Link href="/new">Start a project</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 rounded-md px-5">
                <a href="#workflow">Review the workflow</a>
              </Button>
            </div>
          </div>

          <aside className="border border-border bg-card/70 p-5 shadow-[0_0_0_1px_oklch(1_0_0/0.03)] backdrop-blur-sm">
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              Exported context
            </p>
            <ul className="mt-4 space-y-2 font-mono text-sm">
              {contextFiles.map((file) => (
                <li key={file} className="flex items-center gap-3 text-foreground/90">
                  <span className="size-1.5 shrink-0 bg-status" />
                  {file}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
              Files stay in the repository. They are not recovered from a prior
              chat.
            </p>
          </aside>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="border border-border bg-card/50 p-5">
            <h2 className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
              The problem
            </h2>
            <p className="mt-3 text-sm leading-6 text-foreground/90">
              Agents re-explain architecture, implement future work early, and
              drift because nothing durable recorded the last decision.
            </p>
          </article>
          <article className="border border-border bg-card/50 p-5">
            <h2 className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
              The human remains the architect
            </h2>
            <p className="mt-3 text-sm leading-6 text-foreground/90">
              AI proposes and questions. High-impact product and architecture
              choices stay human-approved.
            </p>
          </article>
          <article className="border border-border bg-card/50 p-5">
            <h2 className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase">
              Deterministic where it must be
            </h2>
            <p className="mt-3 text-sm leading-6 text-foreground/90">
              Models return structured data. Known Markdown formats are rendered
              by TypeScript, not improvised document by document.
            </p>
          </article>
        </section>

        <section id="workflow" className="scroll-mt-24">
          <div className="mb-8 flex flex-col gap-3">
            <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">
              Workflow
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Grill Me is focused discovery, not a generic chat window. It asks
              only what still changes the blueprint.
            </p>
          </div>
          <ol className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {workflowStages.map((stage) => (
              <li key={stage.id} className="bg-background p-5">
                <p className="font-mono text-xs text-status">{stage.id}</p>
                <h3 className="mt-3 text-base font-medium">{stage.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {stage.detail}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <div className="mb-8 flex flex-col gap-3">
            <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">
              One core, two interfaces
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Web and CLI must not grow separate schemas, generators, or
              guardrails. Both consume Blueprint Core.
            </p>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {surfaces.map((surface) => (
              <article key={surface.title} className="bg-background p-6">
                <h3 className="font-mono text-sm tracking-[0.14em] uppercase">
                  {surface.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {surface.detail}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
