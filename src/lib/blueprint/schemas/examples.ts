import type { z } from "zod";

import { ProjectBlueprintSchema } from "./project-blueprint";

export const validProjectBlueprintExample = {
  metadata: { schemaVersion: "1.0" },
  product: {
    name: "Release Notes Hub",
    summary: "A focused workspace for drafting and publishing release notes.",
    problem: "Small teams lose release context across tickets, chats, and documents.",
    successCriteria: [
      "A release note draft can be created from a small set of inputs.",
      "A reviewer can approve a draft before publication.",
    ],
  },
  users: [
    {
      name: "Product engineer",
      description: "A developer preparing a release for customers.",
      needs: ["Capture meaningful changes quickly", "Know what still needs review"],
    },
  ],
  goals: ["Create reviewable release notes", "Keep publication history understandable"],
  nonGoals: ["Replace the issue tracker", "Automatically publish without approval"],
  stack: [
    {
      category: "web framework",
      choice: "Next.js",
      status: "confirmed",
      rationale: "The product needs a web-first interface.",
      constraints: ["Use the App Router", "Prefer Server Components by default"],
      review: {
        status: "approved",
        proposedBy: "human",
        approvedBy: "human",
      },
    },
    {
      category: "persistence",
      choice: "PostgreSQL with Drizzle",
      status: "preferred-if-needed",
      rationale: "A database may be useful if durable team history becomes a requirement.",
      constraints: ["Do not introduce persistence before it is approved"],
      review: {
        status: "proposed",
        proposedBy: "human",
      },
    },
  ],
  architecture: [
    {
      title: "Shared domain contract",
      decision: "Keep the blueprint domain independent from the web interface.",
      rationale: "The future CLI must consume the same schemas and rules.",
      constraints: ["No React or Next.js imports in Blueprint Core"],
      status: "approved",
      relatedAreas: ["schemas", "future CLI"],
      requiresAdr: true,
      review: {
        status: "approved",
        proposedBy: "human",
        approvedBy: "human",
      },
    },
  ],
  domain: [
    {
      name: "Release note",
      purpose: "The reviewable description of a product release.",
      attributes: ["title", "summary", "status"],
      relationships: ["contains change entries", "has reviewers"],
      invariants: ["A published release note has an approval record"],
      persistenceExpectation: "unknown",
      sensitivity: "internal",
    },
  ],
  ui: {
    personality: "Precise and calm",
    visualDirection: "A dark-forward developer tool with readable information blocks.",
    layoutPrinciples: ["Keep review state visible", "Favor readable density over decoration"],
    navigationModel: "A primary workspace with section-level navigation.",
    responsiveBehavior: "Stack review panels on smaller screens.",
    accessibilityRequirements: ["Keyboard-accessible controls", "Visible focus states"],
    componentStrategy: "Use small composable components with a shared token system.",
    unresolvedBrandingChoices: ["Final accent color"],
  },
  security: {
    constraints: ["Do not expose unpublished release notes publicly"],
  },
  verification: {
    strategy: "Verify domain invariants and critical review flows before release.",
    requiredChecks: ["TypeScript", "Lint", "Focused schema tests"],
    riskAreas: ["Approval state", "Publication visibility"],
  },
  guardrails: [
    {
      id: "scope-one-feature",
      title: "One active feature",
      rule: "Implement only the approved active feature.",
      category: "scope",
      source: "universal",
      severity: "required",
      rationale: "A narrow scope prevents unrelated architectural drift.",
    },
  ],
  features: [
    {
      id: "F001",
      title: "Create a release note",
      objective: "Allow a product engineer to draft a release note.",
      phase: "foundation",
      status: "planned",
      dependencies: [],
      scopeSummary: "Create and validate the initial release note form.",
    },
  ],
  unresolvedDecisions: [
    {
      question: "Should drafts be recoverable after a browser refresh?",
      whyItMatters: "Recovery affects state management and the eventual persistence boundary.",
      optionsConsidered: ["No recovery in V1", "Local browser recovery"],
      blocking: false,
      recommendedResolutionPoint: "Before implementing onboarding state recovery.",
    },
  ],
} as const satisfies z.input<typeof ProjectBlueprintSchema>;

export const invalidProjectBlueprintExample = {
  ...validProjectBlueprintExample,
  metadata: { schemaVersion: "version-one" },
  stack: [
    {
      ...validProjectBlueprintExample.stack[0],
      status: "install-now" as const,
    },
  ],
};

export const invalidDecisionExample = {
  ...validProjectBlueprintExample.stack[0],
  review: {
    status: "approved" as const,
    proposedBy: "ai" as const,
    approvedBy: "ai" as const,
  },
};

export const invalidGuardrailExample = {
  ...validProjectBlueprintExample.guardrails[0],
  severity: "must" as const,
};

export const invalidArchitectureDecisionExample = {
  ...validProjectBlueprintExample.architecture[0],
  review: {
    status: "rejected" as const,
    rejectedBy: "human" as const,
    reason: "The decision is not approved for this project.",
  },
};
