import { Check, Minus } from "lucide-react";
import type { ReactNode } from "react";

import type { GuardrailTopic } from "@/src/content/guardrails";
import { ApplicabilityBadge } from "./applicability-badge";
import { RelatedTopics } from "./related-topics";
import { SourceAdaptationPanel } from "./source-adaptation-panel";
import { TopicPagination } from "./topic-pagination";

export function GuardrailTopicArticle({
  topic,
  previous,
  next,
}: {
  topic: GuardrailTopic;
  previous?: GuardrailTopic;
  next?: GuardrailTopic;
}) {
  return (
    <article className="max-w-3xl">
      <header className="border-b border-border pb-8 sm:pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-accent">
            {String(topic.number).padStart(2, "0")} / {topic.category}
          </span>
          <ApplicabilityBadge applicability={topic.applicability} />
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.06em] text-balance sm:text-5xl">
          {topic.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {topic.summary}
        </p>
      </header>

      <div className="relative mt-10 sm:mt-12">
        <div aria-hidden="true" className="absolute -left-6 top-0 hidden h-full w-px bg-border lg:block" />
        <div className="space-y-10 sm:space-y-12">
          <ArticleSection id="definition" number="01" title="Definition">
            <p>{topic.definition}</p>
          </ArticleSection>

          <ArticleSection id="prevents" number="02" title="What it prevents">
            <BulletList items={topic.prevents} icon="minus" />
          </ArticleSection>

          <div className="grid gap-8 border-y border-border py-8 sm:grid-cols-2 sm:gap-10 sm:py-10">
            <ArticleSection id="applies" number="03" title="Applies when">
              <BulletList items={topic.appliesWhen} />
            </ArticleSection>
            <ArticleSection id="avoid" number="04" title="Does not apply when">
              <BulletList items={topic.avoidWhen} icon="minus" />
            </ArticleSection>
          </div>

          <SourceAdaptationPanel topic={topic} />

          <ArticleSection id="example" number="06" title="Product-specific example">
            <div className="border border-border bg-code-surface p-5 sm:p-6">
              <p className="font-mono text-[9px] tracking-[0.13em] text-accent uppercase">
                {topic.example.label}
              </p>
              <p className="mt-4 text-sm leading-7 text-foreground/90">
                {topic.example.description}
              </p>
              {topic.example.code ? (
                <pre className="mt-5 overflow-x-auto border-t border-border pt-4 font-mono text-[11px] leading-6 text-foreground/80">
                  <code>{topic.example.code}</code>
                </pre>
              ) : null}
            </div>
          </ArticleSection>

          <RelatedTopics slugs={topic.relatedSlugs} />
          <TopicPagination previous={previous} next={next} />
        </div>
      </div>
    </article>
  );
}

function ArticleSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] text-accent">{number}</span>
        <h2 className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-7 text-muted-foreground sm:text-[15px] sm:leading-8">
        {children}
      </div>
    </section>
  );
}

function BulletList({
  items,
  icon = "check",
}: {
  items: readonly string[];
  icon?: "check" | "minus";
}) {
  const Icon = icon === "check" ? Check : Minus;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Icon aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
