import type { ReactNode } from "react";

import { ProductMark } from "./product-mark";

export function ProductHeader({ trailing }: { trailing?: ReactNode }) {
  return (
    <header className="relative z-30 border-b border-border/80 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <ProductMark />
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </header>
  );
}
