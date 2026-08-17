import Link from "next/link";

import { getGuardrailTopic } from "@/src/content/guardrails";

export function RelatedTopics({ slugs }: { slugs: readonly string[] }) {
  return (
    <section id="related" className="scroll-mt-24 border-t border-border pt-8">
      <p className="blueprint-kicker text-muted-foreground">Related topics</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {slugs.map((slug) => {
          const topic = getGuardrailTopic(slug);

          return topic ? (
            <Link
              key={topic.slug}
              href={`/docs/guardrails/${topic.slug}`}
              className="group border border-border bg-surface p-4 transition-colors hover:border-accent/60 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="font-mono text-[9px] text-accent">
                {String(topic.number).padStart(2, "0")}
              </span>
              <span className="mt-3 block text-sm font-medium leading-5 text-foreground group-hover:text-accent">
                {topic.shortTitle}
              </span>
            </Link>
          ) : null;
        })}
      </div>
    </section>
  );
}
