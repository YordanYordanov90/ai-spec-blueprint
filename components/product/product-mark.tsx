import Link from "next/link";

export function ProductMark() {
  return (
    <Link
      href="/"
      aria-label="AI Spec Blueprint home"
      className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
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
      <span className="flex flex-col">
        <span className="text-[13px] font-semibold tracking-[-0.02em]">
          AI Spec Blueprint
        </span>
        <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
          system definition layer
        </span>
      </span>
    </Link>
  );
}
