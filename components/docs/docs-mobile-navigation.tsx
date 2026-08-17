import Link from "next/link";

import { guardrailCategorySections } from "@/src/content/guardrails";

export function DocsMobileNavigation({ currentSlug }: { currentSlug?: string }) {
  return (
    <details className="border-y border-border bg-surface/80 lg:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase marker:hidden [&::-webkit-details-marker]:hidden">
        <span>{currentSlug ? "Browse guardrail topics" : "Browse the library"}</span>
        <span aria-hidden="true" className="text-accent">+</span>
      </summary>
      <div className="grid gap-5 border-t border-border px-5 py-5 sm:grid-cols-2">
        {guardrailCategorySections.map((section) => (
          <div key={section.id}>
            <p className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
              {section.label}
            </p>
            <ul className="mt-2 space-y-1">
              {section.topics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/docs/guardrails/${topic.slug}`}
                    aria-current={topic.slug === currentSlug ? "page" : undefined}
                    className={`flex min-h-9 items-center gap-2 px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      topic.slug === currentSlug
                        ? "bg-accent/10 text-foreground"
                        : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                    }`}
                  >
                    <span className="font-mono text-[9px] text-accent">
                      {String(topic.number).padStart(2, "0")}
                    </span>
                    {topic.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
