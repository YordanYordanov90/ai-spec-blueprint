import type { ReactNode } from "react";

import { ProductHeader } from "@/components/product/product-header";
import { DocsMobileNavigation } from "./docs-mobile-navigation";
import { DocsOutline, type DocsOutlineItem } from "./docs-outline";
import { DocsSidebar } from "./docs-sidebar";

export function DocsShell({
  currentSlug,
  outline,
  children,
}: {
  currentSlug?: string;
  outline: readonly DocsOutlineItem[];
  children: ReactNode;
}) {
  return (
    <div className="relative isolate min-h-full overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-accent focus:bg-background focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:text-foreground focus:outline-none"
      >
        Skip to main content
      </a>
      <ProductHeader activeSection="docs" />
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8">
        <DocsMobileNavigation currentSlug={currentSlug} />
        <div className="grid gap-8 py-8 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_12rem] xl:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <DocsSidebar currentSlug={currentSlug} />
            </div>
          </aside>
          <main id="main-content" className="min-w-0 pb-16 pt-2 sm:pt-5">
            {children}
          </main>
          <aside className="hidden xl:block">
            <DocsOutline items={outline} />
          </aside>
        </div>
      </div>
    </div>
  );
}
