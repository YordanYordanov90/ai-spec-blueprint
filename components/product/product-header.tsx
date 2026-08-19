import type { ReactNode } from "react";
import Link from "next/link";

import { ProductMark } from "./product-mark";

export function ProductHeader({
  trailing,
  activeSection,
}: {
  trailing?: ReactNode;
  activeSection?: "docs";
}) {
  return (
    <header className="relative z-30 border-b border-border/80 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <ProductMark />
        <div className="flex items-center gap-2">
          <nav aria-label="Primary navigation" className="hidden items-center sm:flex">
            <Link
              href="/docs/guardrails"
              aria-current={activeSection === "docs" ? "page" : undefined}
              className={`flex min-h-9 items-center border px-3 font-mono text-[9px] tracking-[0.12em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeSection === "docs"
                  ? "border-accent/50 bg-accent/8 text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground"
              }`}
            >
              Docs
            </Link>
          </nav>
          <Link
            href="/docs/guardrails"
            aria-current={activeSection === "docs" ? "page" : undefined}
            className={`flex min-h-9 items-center border px-3 font-mono text-[9px] tracking-[0.12em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden ${
              activeSection === "docs"
                ? "border-accent/50 bg-accent/8 text-foreground"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-surface hover:text-foreground"
            }`}
          >
            Docs
          </Link>
          {trailing ? <div className="shrink-0">{trailing}</div> : null}
        </div>
      </div>
    </header>
  );
}
