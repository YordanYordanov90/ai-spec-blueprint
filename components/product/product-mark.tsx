import Link from "next/link";

export function ProductMark() {
  return (
    <Link
      href="/"
      aria-label="AI Spec Blueprint home"
      className="group flex min-h-11 min-w-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden="true"
        className="relative grid size-8 grid-cols-2 gap-1 border border-border bg-surface-elevated p-1.5 transition-colors group-hover:border-accent/60"
      >
        <span className="bg-accent" />
        <span className="border border-border" />
        <span className="border border-border" />
        <span className="bg-foreground/75" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-[12px] font-semibold tracking-[-0.02em] min-[414px]:text-[13px]">
          AI Spec Blueprint
        </span>
        <span className="hidden font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase min-[414px]:inline">
          system definition layer
        </span>
      </span>
    </Link>
  );
}
