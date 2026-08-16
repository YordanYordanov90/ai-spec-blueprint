import type { z } from "zod";

import { DiscoveryStateSchema } from "./discovery";

export const validDiscoveryStateExample = {
  initialIdea: "A small workspace for drafting release notes.",
  messages: [
    {
      role: "user",
      content: "I want a focused tool for drafting release notes.",
    },
  ],
  facts: [
    {
      id: "fact-product-focus",
      statement: "The product is a focused workspace for drafting release notes.",
      source: "explicit",
      topic: "product-problem",
    },
  ],
  gaps: [
    {
      id: "gap-persistence",
      topic: "persistence",
      question: "Do drafts need to survive a browser refresh?",
      whyItMatters: "Recovery affects state management and any later persistence boundary.",
      blocking: false,
    },
    {
      id: "gap-auth",
      topic: "authentication",
      question: "Does V1 require signed-in users?",
      whyItMatters: "Authentication would change the V1 architecture.",
      blocking: true,
    },
  ],
  currentQuestion: {
    id: "question-auth",
    prompt: "Does the first version need signed-in users, or can it stay unauthenticated?",
    topic: "authentication",
    whyItMatters: "Authentication would change the V1 architecture.",
    relatedGapIds: ["gap-auth"],
  },
  draftDecisions: [
    {
      id: "draft-no-database",
      topic: "persistence",
      proposal: "Do not introduce a database in V1 unless persistence is later approved.",
      status: "proposed",
      proposedBy: "ai",
    },
  ],
  completeness: [
    { area: "product", status: "partial" },
    { area: "security", status: "missing" },
    { area: "stack", status: "unresolved" },
  ],
  readyForBlueprintProposal: false,
} as const satisfies z.input<typeof DiscoveryStateSchema>;

export const readyDiscoveryStateExample = {
  initialIdea: "A small workspace for drafting release notes.",
  messages: [
    {
      role: "user",
      content: "Keep V1 unauthenticated and in-memory.",
    },
  ],
  facts: [
    {
      id: "fact-no-auth",
      statement: "V1 does not require authentication.",
      source: "explicit",
      topic: "authentication",
    },
  ],
  gaps: [
    {
      id: "gap-accent-color",
      topic: "ui",
      question: "What is the final accent color?",
      whyItMatters: "Branding can stay unresolved without blocking the blueprint.",
      blocking: false,
    },
  ],
  draftDecisions: [],
  completeness: [
    { area: "product", status: "complete" },
    { area: "security", status: "complete" },
    { area: "ui", status: "unresolved" },
  ],
  readyForBlueprintProposal: true,
} as const satisfies z.input<typeof DiscoveryStateSchema>;

export const invalidDuplicateFactDiscoveryExample = {
  ...validDiscoveryStateExample,
  facts: [
    validDiscoveryStateExample.facts[0],
    validDiscoveryStateExample.facts[0],
  ],
};

export const invalidReadyWithBlockingGapExample = {
  ...validDiscoveryStateExample,
  readyForBlueprintProposal: true,
  currentQuestion: undefined,
};

export const invalidUnknownRelatedGapExample = {
  ...validDiscoveryStateExample,
  currentQuestion: {
    ...validDiscoveryStateExample.currentQuestion,
    relatedGapIds: ["gap-does-not-exist"],
  },
};
