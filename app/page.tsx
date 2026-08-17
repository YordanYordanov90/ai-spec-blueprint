import {
  ArrowRight,
  Braces,
  Check,
  FileText,
  GitBranch,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { GuardrailCard } from "@/components/guardrails/guardrail-card";
import { ProductHeader } from "@/components/product/product-header";
import { Button } from "@/components/ui/button";
import type { Guardrail } from "@/src/lib/blueprint/schemas/decisions";

const workflowStages = [
  { id: "01", title: "Describe", detail: "A raw project idea" },
  { id: "02", title: "Discover", detail: "Focused Grill Me" },
  { id: "03", title: "Architect", detail: "Reviewed decisions" },
  { id: "04", title: "Guard", detail: "Enforceable rules" },
  { id: "05", title: "Generate", detail: "Durable context" },
  { id: "06", title: "Build", detail: "Agent implementation" },
] as const;

const contextFiles = [
  "AGENTS.md",
  "context/project-overview.md",
  "context/architecture.md",
  "context/schemas.md",
  "context/code-standards.md",
  "context/ui-context.md",
  "context/ai-workflow-rules.md",
  "context/progress-tracker.md",
] as const;

const guardrailExamples = [
  {
    id: "server-only-provider",
    title: "Server-only AI provider",
    rule: "Provider credentials and model calls remain behind the server boundary.",
    category: "security",
    source: "project-specific",
    severity: "required",
    rationale: "Prevents credential exposure and accidental client coupling.",
  },
  {
    id: "one-active-feature",
    title: "One active feature",
    rule: "Implementation is constrained to the feature named in current-feature.md.",
    category: "scope",
    source: "universal",
    severity: "required",
    rationale: "Keeps changes reviewable and prevents roadmap work from leaking into scope.",
  },
] satisfies readonly Guardrail[];

function ArchitectureMap() {
  return (
    <div className="relative overflow-hidden border border-border bg-code-surface p-5 sm:p-7">
      <div
        aria-hidden="true"
        className="blueprint-grid-mask pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_35%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_35%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]"
      />
      <div className="relative grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="blueprint-kicker text-accent">System relationship</p>
          <h3 className="mt-4 max-w-sm text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            The agent works inside the architecture, not above it.
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Approved context enters from one side. Scope and architecture
            guardrails enter from the other. The coding agent receives both.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 font-mono text-[10px] sm:gap-5">
          <div className="space-y-3">
            <div className="border border-border bg-surface-elevated p-3">
              <FileText aria-hidden="true" className="mb-3 size-4 text-accent" />
              <p className="font-semibold text-foreground">CONTEXT/</p>
              <p className="mt-1 text-muted-foreground">durable facts</p>
            </div>
            <div className="border border-border bg-surface-elevated p-3">
              <GitBranch aria-hidden="true" className="mb-3 size-4 text-accent" />
              <p className="font-semibold text-foreground">ARCHITECTURE</p>
              <p className="mt-1 text-muted-foreground">approved edges</p>
            </div>
          </div>

          <div aria-hidden="true" className="flex items-center text-accent">
            <span className="h-px w-3 bg-accent sm:w-6" />
            <ArrowRight className="-ml-1 size-4" />
          </div>

          <div className="relative border border-accent/55 bg-accent/8 p-4 shadow-[0_0_40px_color-mix(in_oklch,var(--accent)_8%,transparent)] sm:p-5">
            <span className="absolute -left-1.5 -top-1.5 size-3 border border-accent bg-background" />
            <span className="absolute -bottom-1.5 -right-1.5 size-3 border border-accent bg-background" />
            <Braces aria-hidden="true" className="mb-5 size-5 text-accent" />
            <p className="font-semibold tracking-[0.08em] text-foreground">
              CODING AGENT
            </p>
            <p className="mt-2 leading-5 text-muted-foreground">
              scoped implementation
            </p>
            <div className="mt-5 border-t border-accent/20 pt-3 text-[9px] text-accent">
              CONTEXT VERIFIED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative isolate min-h-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_74%_18%,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_34%)]"
      />

      <ProductHeader
        trailing={
          <span className="hidden items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase sm:flex">
            <span className="size-1.5 bg-success" />
            spec before implementation
          </span>
        }
      />

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-28">
          <div className="blueprint-enter">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              <p className="blueprint-kicker text-accent">
                Environment definition for coding agents
              </p>
            </div>
            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-balance sm:text-7xl lg:text-[5.2rem]">
              Chat history is not a project architecture.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Turn an early idea into reviewed decisions, enforceable guardrails,
              and durable repository context before the coding agent writes the
              first line.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 rounded-none px-6">
                <Link href="/new">
                  Start a project
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-none bg-background/40 px-6"
              >
                <a href="#workflow">Inspect the workflow</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] text-muted-foreground">
              {["Human approved", "Schema validated", "Deterministic output"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check aria-hidden="true" className="size-3 text-success" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <aside className="blueprint-panel blueprint-enter relative min-w-0 p-2 [animation-delay:120ms]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
              <span>project_blueprint.build</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 border border-muted-foreground" /> illustrative state
              </span>
            </div>
            <div className="grid gap-px bg-border/70 sm:grid-cols-[0.72fr_1.28fr]">
              <div className="bg-code-surface p-4">
                <p className="blueprint-kicker text-muted-foreground">Inputs</p>
                <div className="mt-5 space-y-3 font-mono text-[10px]">
                  {[
                    ["01", "idea.md", "recorded"],
                    ["02", "users", "complete"],
                    ["03", "architecture", "reviewing"],
                    ["04", "security", "unresolved"],
                  ].map(([id, name, state]) => (
                    <div key={id} className="flex items-center gap-3">
                      <span className="text-muted-foreground">{id}</span>
                      <span className="min-w-0 flex-1 truncate text-foreground">
                        {name}
                      </span>
                      <span className={state === "complete" ? "text-success" : "text-muted-foreground"}>
                        {state}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-7 border-l border-accent/50 pl-3 font-mono text-[9px] leading-5 text-accent">
                  decision → node
                  <br />
                  node → context
                </div>
              </div>

              <div className="relative bg-surface p-5 sm:p-6">
                <div className="absolute bottom-0 left-0 top-0 w-px bg-accent/70" />
                <p className="blueprint-kicker text-accent">Project blueprint</p>
                <div className="mt-7 space-y-5">
                  {[
                    ["Product", "Approved"],
                    ["Architecture", "Reviewing"],
                    ["Guardrails", "Partial"],
                  ].map(([name, status]) => (
                    <div key={name}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span>{name}</span>
                        <span className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                          {status}
                        </span>
                      </div>
                      <div className="h-px bg-border">
                        <span
                          className={`block size-1.5 -translate-y-[3px] ${
                            status === "Approved"
                              ? "bg-success"
                              : status === "Reviewing"
                                ? "bg-warning"
                                : "border border-muted-foreground bg-background"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 border-t border-border pt-5 font-mono text-[9px]">
                  <span className="text-muted-foreground">OUTPUT</span>
                  <span>8 context files</span>
                  <span className="text-muted-foreground">STATE</span>
                  <span className="text-warning">1 unresolved decision</span>
                  <span className="text-muted-foreground">NEXT</span>
                  <span>human review</span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section id="workflow" className="scroll-mt-20 border-y border-border bg-surface/75">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="blueprint-kicker text-accent">Construction sequence</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                  Idea in. Controlled implementation out.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Every stage resolves uncertainty before it becomes an expensive
                implementation decision.
              </p>
            </div>

            <ol className="mt-10 grid border border-border md:grid-cols-3 lg:grid-cols-6">
              {workflowStages.map((stage, index) => (
                <li
                  key={stage.id}
                  className="relative min-h-40 border-b border-border p-5 last:border-b-0 md:border-b md:border-r md:nth-[3n]:border-r-0 lg:border-b-0 lg:nth-[3n]:border-r lg:last:border-r-0"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] text-accent">{stage.id}</span>
                    {index < workflowStages.length - 1 ? (
                      <ArrowRight aria-hidden="true" className="size-3 text-muted-foreground" />
                    ) : (
                      <Check aria-hidden="true" className="size-3 text-success" />
                    )}
                  </div>
                  <h3 className="mt-10 text-sm font-semibold">{stage.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {stage.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="blueprint-kicker text-accent">Blueprint Core</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                One source of truth around every interface.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                The Web experience and future CLI use the same Blueprint Core:
                the same schemas, guardrails, validation, and deterministic
                generators.
              </p>
            </div>
            <ArchitectureMap />
          </div>
        </section>

        <section className="border-y border-border bg-surface/75">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr]">
              <div>
                <ShieldCheck aria-hidden="true" className="size-6 text-accent" />
                <p className="blueprint-kicker mt-6 text-accent">Guardrail language</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">
                  Rules that say what, why, and how.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                  Guardrails are not decorative documentation. They can be
                  reinforced by types, schemas, lint, tests, runtime boundaries,
                  and explicit human approval.
                </p>
              </div>
              <div className="grid gap-4">
                {guardrailExamples.map((guardrail, index) => (
                  <GuardrailCard
                    key={guardrail.id}
                    guardrail={guardrail}
                    example
                    enforcement={
                      index === 0
                        ? ["server boundary", "build", "review"]
                        : ["current-feature.md", "tests", "review"]
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="blueprint-kicker text-accent">Generated artifacts</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Context that survives the conversation.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              Approved structured data becomes a stable Markdown package through
              deterministic TypeScript renderers. No document-by-document model
              improvisation.
            </p>
            <Button asChild variant="outline" className="mt-7 h-11 rounded-none px-5">
              <Link href="/new">
                Build your blueprint
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="border border-border bg-code-surface p-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
              <span>Blueprint /</span>
              <span>{contextFiles.length} files</span>
            </div>
            <ul className="divide-y divide-border/70 font-mono text-[11px]">
              {contextFiles.map((file, index) => (
                <li key={file} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-5 text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <FileText aria-hidden="true" className="size-3.5 text-accent" />
                  <span className="min-w-0 flex-1 truncate">{file}</span>
                  <span className="hidden text-[9px] text-success sm:inline">generated</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-accent text-accent-foreground">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase opacity-70">
                Begin with definition
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Build the environment before the implementation.
              </h2>
            </div>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-none bg-background px-6 text-foreground hover:bg-background/90"
            >
              <Link href="/new">
                Start Grill Me
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>AI Spec Blueprint</span>
          <span>Human architect · durable context · controlled scope</span>
        </div>
      </footer>
    </div>
  );
}
