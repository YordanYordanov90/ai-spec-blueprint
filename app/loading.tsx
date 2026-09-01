import { ProductHeader } from "@/components/product/product-header";

function LoadingBar({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-muted ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <div className="blueprint-grid-bg flex min-h-screen flex-col overflow-x-clip">
      <ProductHeader
        trailing={
          <span className="flex min-h-11 items-center px-1.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
            Preparing
          </span>
        }
      />

      <main
        role="status"
        aria-live="polite"
        aria-label="Preparing Blueprint workspace"
        className="relative flex-1 px-5 py-12 sm:px-8 sm:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_70%_30%,color-mix(in_oklch,var(--accent)_10%,transparent),transparent_38%)]"
        />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="max-w-3xl border-l border-accent/70 pl-5 sm:pl-8">
            <p className="blueprint-kicker text-accent">Workspace / loading</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
              Preparing your blueprint workspace.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Loading the next project state. Your recorded decisions remain
              separate from this transition.
            </p>
            <div className="mt-10 space-y-3">
              <LoadingBar className="h-2 w-32" />
              <LoadingBar className="h-3 w-full max-w-xl" />
              <LoadingBar className="h-3 w-4/5 max-w-lg" />
            </div>
          </section>

          <aside className="blueprint-panel p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <p className="blueprint-kicker text-muted-foreground">Definition state</p>
              <span className="font-mono text-[10px] text-muted-foreground">—/—</span>
            </div>
            <div className="mt-5 space-y-4">
              {["Discovery", "Blueprint", "Artifacts"].map((stage) => (
                <div key={stage} className="flex items-center gap-3">
                  <LoadingBar className="size-3 shrink-0 rounded-full" />
                  <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    {stage}
                  </span>
                  <LoadingBar className="ml-auto h-2 w-12" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 py-6 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase sm:px-8">
          AI Spec Blueprint · loading a durable context workspace
        </div>
      </footer>
    </div>
  );
}
