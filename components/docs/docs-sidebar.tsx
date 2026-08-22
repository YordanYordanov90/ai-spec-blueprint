import Link from "next/link";

import {
  guardrailCategorySections,
  type GuardrailTopic,
} from "@/src/content/guardrails";

export function DocsSidebar({ currentSlug }: { currentSlug?: string }) {
  return (
    <nav aria-label="Guardrail topics" className="space-y-7">
      <div>
        <Link
          href="/docs/guardrails"
          className="blueprint-kicker text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-current={currentSlug === undefined ? "page" : undefined}
        >
          Guardrail library
        </Link>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          24 field notes for safer agent-assisted systems.
        </p>
      </div>
      {guardrailCategorySections.map((section) => (
        <div key={section.id}>
          <p className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
            {section.label}
          </p>
          <ol className="mt-2 space-y-0.5 border-l border-border">
            {section.topics.map((topic) => (
              <SidebarTopicLink
                key={topic.slug}
                topic={topic}
                active={topic.slug === currentSlug}
              />
            ))}
          </ol>
        </div>
      ))}
    </nav>
  );
}

function SidebarTopicLink({
  topic,
  active,
}: {
  topic: GuardrailTopic;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={`/docs/guardrails/${topic.slug}`}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-9 items-start gap-2 border-l-2 py-1.5 pl-3 text-[11px] leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          active
            ? "-ml-px border-accent bg-accent/8 text-foreground"
            : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
        }`}
      >
        <span className="shrink-0 font-mono text-[9px] text-accent">
          {String(topic.number).padStart(2, "0")}
        </span>
        <span>{topic.shortTitle}</span>
      </Link>
    </li>
  );
}
