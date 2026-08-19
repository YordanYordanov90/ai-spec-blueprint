export const guardrailApplicabilities = [
  "universal",
  "conditional",
  "context-dependent",
] as const;

export type GuardrailApplicability = (typeof guardrailApplicabilities)[number];

export const guardrailCategoryIds = [
  "foundations",
  "architecture",
  "boundaries",
  "workflow",
  "verification",
] as const;

export type GuardrailCategoryId = (typeof guardrailCategoryIds)[number];

export type GuardrailExample = {
  label: string;
  description: string;
  code?: string;
};

export type GuardrailTopic = {
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  category: GuardrailCategoryId;
  applicability: GuardrailApplicability;
  summary: string;
  definition: string;
  prevents: readonly string[];
  appliesWhen: readonly string[];
  avoidWhen: readonly string[];
  sourceConcept: string;
  productAdaptation: string;
  example: GuardrailExample;
  relatedSlugs: readonly string[];
};
