import { z } from "zod";

import {
  DiscoveryStateSchema,
  ExtractedFactSchema,
  type DiscoveryState,
  type ExtractedFact,
} from "../schemas/discovery";

export function createInitialDiscoveryState(
  initialIdea: string,
): DiscoveryState {
  return DiscoveryStateSchema.parse({
    initialIdea,
    messages: [{ role: "user", content: initialIdea }],
    facts: [],
    gaps: [],
    draftDecisions: [],
    completeness: [],
    readyForBlueprintProposal: false,
  });
}

function factIdSuffix(fact: ExtractedFact): string {
  let hash = 2166136261;

  for (const character of `${fact.topic}:${fact.statement}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function resolveFactId(
  fact: ExtractedFact,
  factsById: Map<string, ExtractedFact>,
): string {
  if (!factsById.has(fact.id)) {
    return fact.id;
  }

  const baseId = `fact-${fact.topic}-${factIdSuffix(fact)}`;
  let resolvedId = baseId;
  let collision = 2;

  while (factsById.has(resolvedId)) {
    resolvedId = `${baseId}-${collision}`;
    collision += 1;
  }

  return resolvedId;
}

export function applyExtractedFacts(
  state: DiscoveryState,
  incomingFacts: unknown,
): DiscoveryState {
  const facts = z.array(ExtractedFactSchema).parse(incomingFacts);

  const factsById = new Map(state.facts.map((fact) => [fact.id, fact]));
  const existingStatements = new Set(
    state.facts.map((fact) => fact.statement),
  );
  const mergedFacts = [...state.facts];

  for (const incomingFact of facts) {
    if (existingStatements.has(incomingFact.statement)) {
      continue;
    }

    const id = resolveFactId(incomingFact, factsById);
    const fact = id === incomingFact.id ? incomingFact : { ...incomingFact, id };

    mergedFacts.push(fact);
    factsById.set(fact.id, fact);
    existingStatements.add(fact.statement);
  }

  return DiscoveryStateSchema.parse({
    ...state,
    facts: mergedFacts,
  });
}
