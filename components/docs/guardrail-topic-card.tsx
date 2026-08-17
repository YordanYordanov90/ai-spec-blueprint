import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { GuardrailTopic } from "@/src/content/guardrails";
import { ApplicabilityBadge } from "./applicability-badge";

export function GuardrailTopicCard({ topic }: { topic: GuardrailTopic }) {
  return (
    <Link
      href={`/docs/guardrails/${topic.slug}`}
      className="group grid min-h-28 gap-4 border-b border-border p-4 transition-colors hover:bg-surface-elevated focus-visible:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center sm:p-5"
    >
      <span className="font-mono text-xs text-accent">
        {String(topic.number).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold tracking-[-0.02em] text-foreground sm:text-base">
            {topic.title}
          </span>
          <ApplicabilityBadge applicability={topic.applicability} />
        </span>
        <span className="mt-2 block max-w-2xl text-xs leading-5 text-muted-foreground">
          {topic.summary}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 text-muted-foreground transition-colors group-hover:text-accent sm:justify-self-end"
      />
    </Link>
  );
}
