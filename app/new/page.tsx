import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { OnboardingWorkspace } from "@/components/onboarding/onboarding-workspace";
import { ProductHeader } from "@/components/product/product-header";

export default function NewProjectPage() {
  return (
    <div className="relative isolate min-h-full overflow-hidden bg-background/70">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_72%_10%,color-mix(in_oklch,var(--accent)_9%,transparent),transparent_38%)]"
      />
      <ProductHeader
        trailing={
          <Link
            href="/"
            className="flex h-9 items-center gap-2 border border-transparent px-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:border-border hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft aria-hidden="true" className="size-3" />
            Back to landing
          </Link>
        }
      />

      <OnboardingWorkspace />
    </div>
  );
}
