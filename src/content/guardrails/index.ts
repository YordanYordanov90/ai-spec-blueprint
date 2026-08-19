import { guardrailCategories } from "./categories";
import { architectureTopics } from "./architecture";
import { boundaryTopics } from "./boundaries";
import { foundationTopics } from "./foundations";
import { verificationTopics } from "./verification";
import { workflowTopics } from "./workflow";
import type { GuardrailCategoryId, GuardrailTopic } from "./types";

export * from "./categories";
export * from "./types";

export const guardrailTopics = [
  ...foundationTopics,
  ...architectureTopics,
  ...boundaryTopics,
  ...workflowTopics,
  ...verificationTopics,
].sort((left, right) => left.number - right.number) satisfies readonly GuardrailTopic[];

export const guardrailTopicsBySlug = new Map(
  guardrailTopics.map((topic) => [topic.slug, topic]),
);

export const guardrailCategorySections = guardrailCategories.map((category) => ({
  ...category,
  topics: guardrailTopics.filter((topic) => topic.category === category.id),
}));

export function getGuardrailTopic(slug: string) {
  return guardrailTopicsBySlug.get(slug);
}

export function getGuardrailCategory(categoryId: GuardrailCategoryId) {
  return guardrailCategories.find((category) => category.id === categoryId);
}

export function getAdjacentGuardrailTopics(topic: GuardrailTopic) {
  const index = guardrailTopics.findIndex((candidate) => candidate.slug === topic.slug);

  return {
    previous: index > 0 ? guardrailTopics[index - 1] : undefined,
    next: index < guardrailTopics.length - 1 ? guardrailTopics[index + 1] : undefined,
  };
}
