import {
  approveBlueprintProposal,
} from "../../blueprint/discovery/approve-blueprint";
import {
  analyzeMissingInformation,
} from "../../blueprint/discovery/analyze-missing-information";
import {
  applyExtractedFacts,
  createInitialDiscoveryState,
} from "../../blueprint/discovery/apply-extracted-facts";
import { proposeProjectBlueprint } from "../../blueprint/discovery/propose-blueprint";
import { generateContextPackage } from "../../blueprint/generators/context-package";
import { DiscoveryStateSchema, type DiscoveryState } from "../../blueprint/schemas/discovery";
import type { ProjectBlueprint } from "../../blueprint/schemas/project-blueprint";
import {
  EvaluationMetricsSchema,
  EvaluationScenarioResultSchema,
  type EvaluationIssue,
  type EvaluationMetrics,
  type EvaluationScenario,
  type EvaluationScenarioResult,
  type BlueprintSection,
} from "./schemas";

const GENERIC_CONTENT_MARKERS = [
  "Primary user",
  "Primary concept",
  "Recorded domain concept",
  "Discovery-derived architecture",
  "A primary workspace with section-level navigation.",
  "Stack review panels on smaller screens.",
  "Keep recorded decisions inspectable",
];

function includesPattern(value: string, pattern: string): boolean {
  return value.toLocaleLowerCase().includes(pattern.toLocaleLowerCase());
}

function stateFromFacts(scenario: EvaluationScenario): DiscoveryState {
  const initial = createInitialDiscoveryState(scenario.initialIdea);
  const withAnswers = DiscoveryStateSchema.parse({
    ...initial,
    messages: [
      ...initial.messages,
      ...scenario.answers.map((content) => ({ role: "user" as const, content })),
    ],
  });

  return analyzeMissingInformation(
    applyExtractedFacts(
      withAnswers,
      scenario.facts,
    ),
  );
}

function sectionText(
  blueprint: ProjectBlueprint,
  section: BlueprintSection,
): string {
  switch (section) {
    case "product":
      return JSON.stringify(blueprint.product);
    case "users":
      return JSON.stringify(blueprint.users);
    case "goals":
      return JSON.stringify(blueprint.goals);
    case "non-goals":
      return JSON.stringify(blueprint.nonGoals);
    case "stack":
      return JSON.stringify(blueprint.stack);
    case "architecture":
      return JSON.stringify(blueprint.architecture);
    case "domain":
      return JSON.stringify(blueprint.domain);
    case "ui":
      return JSON.stringify(blueprint.ui);
    case "ai":
      return JSON.stringify(blueprint.ai ?? null);
    case "security":
      return JSON.stringify(blueprint.security);
    case "verification":
      return JSON.stringify(blueprint.verification);
    case "features":
      return JSON.stringify(blueprint.features);
  }
}

function issue(
  id: string,
  stage: EvaluationIssue["stage"],
  detail: string,
): EvaluationIssue {
  return { id, stage, detail };
}

function addStateIssues(
  scenario: EvaluationScenario,
  state: DiscoveryState,
  issues: EvaluationIssue[],
): void {
  const facts = state.facts.map((fact) => fact.statement).join("\n");

  scenario.expectations.requiredFactPatterns.forEach((pattern) => {
    if (!includesPattern(facts, pattern)) {
      issues.push(
        issue(
          "fact-recall",
          "fact-extraction",
          `Required fact pattern was not found: ${pattern}`,
        ),
      );
    }
  });

  const gapTopics = new Set(state.gaps.map((gap) => gap.topic));
  scenario.expectations.materialGapTopics.forEach((topic) => {
    if (!gapTopics.has(topic)) {
      issues.push(
        issue(
          "material-gap-recall",
          "discovery-analysis",
          `Expected a material gap for topic: ${topic}`,
        ),
      );
    }
  });

  scenario.expectations.forbiddenGapTopics.forEach((topic) => {
    if (gapTopics.has(topic)) {
      issues.push(
        issue(
          "question-relevance",
          "discovery-analysis",
          `An irrelevant gap was retained for topic: ${topic}`,
        ),
      );
    }
  });

  if (state.readyForBlueprintProposal !== scenario.expectations.expectedReady) {
    issues.push(
      issue(
        "readiness",
        "discovery-analysis",
        `Expected readiness=${scenario.expectations.expectedReady}, received ${state.readyForBlueprintProposal}`,
      ),
    );
  }

  if (
    scenario.expectations.contradictionMustBlock &&
    state.readyForBlueprintProposal
  ) {
    issues.push(
      issue(
        "contradiction-detection",
        "discovery-analysis",
        "Contradictory answers did not block readiness.",
      ),
    );
  }
}

function addBlueprintIssues(
  scenario: EvaluationScenario,
  blueprint: ProjectBlueprint,
  issues: EvaluationIssue[],
): void {
  const rawIdeaTitle = scenario.initialIdea.split(/[\n.]/)[0]?.trim();

  if (
    rawIdeaTitle &&
    (blueprint.product.name === rawIdeaTitle ||
      (blueprint.product.name.length >= 40 &&
        rawIdeaTitle.startsWith(blueprint.product.name)))
  ) {
    issues.push(
      issue(
        "product-naming",
        "blueprint-proposal",
        "The product name is the raw idea instead of a concise reviewed title.",
      ),
    );
  }

  scenario.expectations.requiredSections.forEach(({ section, patterns }) => {
    const text = sectionText(blueprint, section);
    patterns.forEach((pattern) => {
      if (!includesPattern(text, pattern)) {
        issues.push(
          issue(
            "section-content",
            "blueprint-proposal",
            `Section ${section} is missing required content: ${pattern}`,
          ),
        );
      }
    });
  });

  scenario.expectations.requiredStackDecisions.forEach((expected) => {
    const decision = blueprint.stack.find(
      (candidate) =>
        includesPattern(candidate.category, expected.categoryPattern) &&
        includesPattern(candidate.choice, expected.choicePattern),
    );

    if (!decision) {
      issues.push(
        issue(
          "stack-decision-coverage",
          "blueprint-proposal",
          `Missing stack decision for ${expected.categoryPattern}: ${expected.choicePattern}`,
        ),
      );
      return;
    }

    if (expected.status && decision.status !== expected.status) {
      issues.push(
        issue(
          "stack-decision-state",
          "blueprint-proposal",
          `Stack decision ${expected.choicePattern} should be ${expected.status}, received ${decision.status}`,
        ),
      );
    }

    if (expected.statusMustNotBe === decision.status) {
      issues.push(
        issue(
          "stack-decision-state",
          "blueprint-proposal",
          `Stack decision ${expected.choicePattern} was incorrectly confirmed.`,
        ),
      );
    }
  });

  if (scenario.expectations.requireAiSection && !blueprint.ai) {
    issues.push(
      issue(
        "ai-section-coverage",
        "blueprint-proposal",
        "AI is central in the source facts but the proposal has no AI section.",
      ),
    );
  }

  const serialized = JSON.stringify(blueprint);
  scenario.expectations.prohibitedBlueprintPatterns.forEach((pattern) => {
    if (includesPattern(serialized, pattern)) {
      issues.push(
        issue(
          "unsupported-fact",
          "blueprint-proposal",
          `Prohibited blueprint pattern was emitted: ${pattern}`,
        ),
      );
    }
  });

  GENERIC_CONTENT_MARKERS.forEach((marker) => {
    if (includesPattern(serialized, marker)) {
      issues.push(
        issue(
          "project-specificity",
          "blueprint-proposal",
          `Generic fallback content remains in the proposal: ${marker}`,
        ),
      );
    }
  });

  const approved = approveBlueprintProposal(blueprint);
  approved.architecture.forEach((decision) => {
    const decisionText = `${decision.decision} ${decision.rationale} ${decision.constraints.join(" ")}`;

    if (
      includesPattern(decisionText, "not human-approved") ||
      includesPattern(decisionText, "human review is required before")
    ) {
      issues.push(
        issue(
          "approval-state-text",
          "blueprint-proposal",
          `Approved architecture still contains proposal-only review language: ${decision.title}`,
        ),
      );
    }
  });
}

function checkDeterministicArtifacts(
  blueprint: ProjectBlueprint,
  issues: EvaluationIssue[],
): void {
  const approved = approveBlueprintProposal(blueprint);
  const first = generateContextPackage(approved);
  const second = generateContextPackage(approved);

  if (JSON.stringify(first) !== JSON.stringify(second)) {
    issues.push(
      issue(
        "artifact-determinism",
        "artifact-generation",
        "Equivalent approved blueprints produced different artifacts.",
      ),
    );
  }
}

export function evaluateScenario(options: {
  scenario: EvaluationScenario;
  state: DiscoveryState;
  metrics?: Partial<EvaluationMetrics>;
  extraIssues?: readonly EvaluationIssue[];
}): EvaluationScenarioResult {
  const scenario = options.scenario;
  const state = DiscoveryStateSchema.parse(options.state);
  const issues: EvaluationIssue[] = [...(options.extraIssues ?? [])];

  addStateIssues(scenario, state, issues);

  let proposal: ProjectBlueprint | undefined;
  if (state.readyForBlueprintProposal) {
    try {
      // Keep this baseline runner on the current deterministic proposal path.
      // Later features will add separate synthesis and critique operations.
      proposal = proposeProjectBlueprint(state);
      addBlueprintIssues(scenario, proposal, issues);
      checkDeterministicArtifacts(proposal, issues);
    } catch (error) {
      issues.push(
        issue(
          "proposal-generation",
          "blueprint-proposal",
          error instanceof Error ? error.message : "Blueprint proposal failed.",
        ),
      );
    }
  }

  if (!state.readyForBlueprintProposal && scenario.expectations.expectedReady) {
    issues.push(
      issue(
        "proposal-generation",
        "blueprint-proposal",
        "Expected a proposal but discovery was not ready.",
      ),
    );
  }

  const metrics = EvaluationMetricsSchema.parse({
    latencyMs: 0,
    inputTokens: null,
    outputTokens: null,
    totalTokens: null,
    schemaFailures: 0,
    retries: 0,
    ...options.metrics,
  });

  return EvaluationScenarioResultSchema.parse({
    scenarioId: scenario.id,
    passed: issues.length === 0,
    issues,
    metrics,
    proposalGenerated: proposal !== undefined,
  });
}

export function evaluateOfflineScenario(
  scenario: EvaluationScenario,
): EvaluationScenarioResult {
  return evaluateScenario({
    scenario,
    state: stateFromFacts(scenario),
  });
}

export function buildOfflineState(scenario: EvaluationScenario): DiscoveryState {
  return stateFromFacts(scenario);
}
