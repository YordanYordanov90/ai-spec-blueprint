import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ProductHeader } from "@/components/product/product-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="blueprint-grid-bg flex min-h-screen flex-col overflow-x-clip">
      <ProductHeader
        trailing={
          <Link
            href="/new"
            className="flex min-h-11 items-center gap-1.5 border border-transparent px-1.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:border-border hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-[414px]:gap-2 min-[414px]:px-2"
          >
            <span className="min-[414px]:hidden">Start</span>
            <span className="hidden min-[414px]:inline">Start a project</span>
            <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        }
      />

      <main className="relative flex flex-1 items-center px-5 py-16 sm:px-8 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_70%_30%,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_38%)]"
        />
        <section className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-2xl border-l border-accent/70 pl-5 sm:pl-8">
            <p className="blueprint-kicker text-accent">404 · route not found</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
              This path is outside the blueprint.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              The page you requested does not exist. Return to the landing page
              or start defining a new project.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 rounded-none px-5">
                <Link href="/">
                  <ArrowLeft aria-hidden="true" />
                  Back home
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 rounded-none px-5"
              >
                <Link href="/new">
                  Start a project
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
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
