"use client";

import "./globals.css";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, TriangleAlert } from "lucide-react";

import { ProductMark } from "@/components/product/product-mark";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <html lang="en" className="dark h-full antialiased">
      <body className="flex min-h-full flex-col overflow-x-clip bg-background font-sans text-foreground">
        <div className="blueprint-grid-bg flex min-h-screen flex-col">
          <header className="border-b border-border/80 bg-background/75">
            <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
              <ProductMark />
              <Link
                href="/"
                className="flex min-h-11 items-center gap-1.5 border border-transparent px-1.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:border-border hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Home
              </Link>
            </div>
          </header>

          <main className="relative flex flex-1 items-center px-5 py-16 sm:px-8 sm:py-24">
            <section role="alert" className="relative mx-auto w-full max-w-7xl">
              <div className="max-w-2xl border-l border-danger/80 pl-5 sm:pl-8">
                <div className="flex items-center gap-3 text-danger">
                  <TriangleAlert aria-hidden="true" className="size-4" />
                  <p className="blueprint-kicker">500 · global system error</p>
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
                  The blueprint needs a fresh start.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  The application shell could not finish rendering. Retry the
                  page, or return to the landing page to continue safely.
                </p>
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
            <div className="mx-auto max-w-7xl px-5 py-6 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase sm:px-8">
              AI Spec Blueprint · system recovery
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
