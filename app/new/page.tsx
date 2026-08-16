import Link from "next/link";

import { OnboardingWorkspace } from "@/components/onboarding/onboarding-workspace";

export default function NewProjectPage() {
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
          <Link
            href="/"
            className="font-mono text-[11px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Back to landing
          </Link>
        </div>
      </header>

      <OnboardingWorkspace />
    </div>
  );
}
