import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { OnboardingWorkspace } from "@/components/onboarding/onboarding-workspace";
import { ProductHeader } from "@/components/product/product-header";

export default function NewProjectPage() {
  return (
    <div className="relative isolate min-h-full overflow-x-clip bg-background/70">
      <ProductHeader
        trailing={
          <Link
            href="/"
            className="flex min-h-11 items-center gap-1.5 border border-transparent px-1.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:border-border hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-[414px]:gap-2 min-[414px]:px-2"
          >
            <ArrowLeft aria-hidden="true" className="size-3" />
            <span className="min-[414px]:hidden">Back</span>
            <span className="hidden min-[414px]:inline">Back to landing</span>
          </Link>
        }
      />

      <OnboardingWorkspace />
    </div>
  );
}
