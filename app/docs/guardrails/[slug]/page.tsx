import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsShell } from "@/components/docs/docs-shell";
import { GuardrailTopicArticle } from "@/components/docs/guardrail-topic-article";
import {
  getAdjacentGuardrailTopics,
  getGuardrailCategory,
  getGuardrailTopic,
  guardrailTopics,
} from "@/src/content/guardrails";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

const outline = [
  { id: "definition", label: "Definition" },
  { id: "prevents", label: "What it prevents" },
  { id: "applies", label: "Applies when" },
  { id: "avoid", label: "Does not apply when" },
  { id: "adaptation", label: "Source / adaptation" },
  { id: "example", label: "Product example" },
  { id: "related", label: "Related topics" },
] as const;

export function generateStaticParams() {
  return guardrailTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getGuardrailTopic(slug);

  if (!topic) {
    return { title: "Topic not found" };
  }

  return {
    title: `${String(topic.number).padStart(2, "0")} / ${topic.title}`,
    description: topic.summary,
  };
}

export default async function GuardrailTopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getGuardrailTopic(slug);

  if (!topic) {
    notFound();
  }

  const category = getGuardrailCategory(topic.category);
  const { previous, next } = getAdjacentGuardrailTopics(topic);

  return (
    <DocsShell currentSlug={topic.slug} outline={outline}>
      <div className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-muted-foreground uppercase">
        <span>Docs</span>
        <span aria-hidden="true">/</span>
        <span>Guardrails</span>
        <span aria-hidden="true">/</span>
        <span className="text-accent">{category?.label ?? topic.category}</span>
      </div>
      <GuardrailTopicArticle topic={topic} previous={previous} next={next} />
    </DocsShell>
  );
}
