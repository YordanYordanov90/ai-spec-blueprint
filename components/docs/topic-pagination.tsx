import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { GuardrailTopic } from "@/src/content/guardrails";

export function TopicPagination({
  previous,
  next,
}: {
  previous?: GuardrailTopic;
  next?: GuardrailTopic;
}) {
  return (
    <nav aria-label="Topic pagination" className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {previous ? (
        <PaginationLink topic={previous} direction="previous" />
      ) : (
        <span />
      )}
      {next ? <PaginationLink topic={next} direction="next" /> : null}
    </nav>
  );
}

function PaginationLink({
  topic,
  direction,
}: {
  topic: GuardrailTopic;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";
  const Icon = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={`/docs/guardrails/${topic.slug}`}
      className={`group flex min-h-16 items-center gap-3 border border-border bg-surface p-4 transition-colors hover:border-accent/60 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isNext ? "sm:justify-end sm:text-right" : ""}`}
    >
      {!isNext ? <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" /> : null}
      <span>
        <span className="block font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
          {direction} topic
        </span>
        <span className="mt-1 block text-sm font-medium text-foreground group-hover:text-accent">
          {String(topic.number).padStart(2, "0")} / {topic.shortTitle}
        </span>
      </span>
      {isNext ? <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" /> : null}
    </Link>
  );
}
