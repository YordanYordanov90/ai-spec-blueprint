"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, TriangleAlert } from "lucide-react";

import { ProductHeader } from "@/components/product/product-header";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_70%_30%,color-mix(in_oklch,var(--danger)_15%,transparent),transparent_38%)]"
        />
        <section
          role="alert"
          className="relative mx-auto w-full max-w-7xl"
        >
          <div className="max-w-2xl border-l border-danger/80 pl-5 sm:pl-8">
            <div className="flex items-center gap-3 text-danger">
              <TriangleAlert aria-hidden="true" className="size-4" />
              <p className="blueprint-kicker">500 · system interruption</p>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
              The blueprint hit an unexpected edge.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Nothing was saved from this failed step. Try the operation again,
              or return home and begin from a clean workspace.
            </p>
            {error.digest ? (
              <p className="mt-4 font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                Trace {error.digest}
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className="h-11 rounded-none px-5"
                onClick={() => retry()}
              >
                <RotateCcw aria-hidden="true" />
                Try again
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 rounded-none px-5"
              >
                <Link href="/">
                  <ArrowLeft aria-hidden="true" />
                  Back home
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>AI Spec Blueprint</span>
          <span>Runtime boundary · human recovery path</span>
        </div>
      </footer>
    </div>
  );
}
