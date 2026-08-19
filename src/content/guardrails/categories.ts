import type { GuardrailCategoryId } from "./types";

export type GuardrailCategory = {
  id: GuardrailCategoryId;
  label: string;
  description: string;
};

export const guardrailCategories = [
  {
    id: "foundations",
    label: "Foundations",
    description: "Why guardrails exist and how people, agents, and context cooperate.",
  },
  {
    id: "architecture",
    label: "Architecture & source of truth",
    description: "Patterns that keep boundaries, contracts, and decisions legible.",
  },
  {
    id: "boundaries",
    label: "Server, security & operations",
    description: "Conditional protections for code, data, identity, and operational paths.",
  },
  {
    id: "workflow",
    label: "Agent workflow & context",
    description: "Repository habits that help an agent find and retain the right context.",
  },
  {
    id: "verification",
    label: "Verification & tightening",
    description: "Human review, feedback loops, and a checklist for choosing controls.",
  },
] satisfies readonly GuardrailCategory[];
