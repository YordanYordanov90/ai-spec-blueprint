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

function assertUniqueIncomingFactIds(facts: readonly ExtractedFact[]): void {
  const seenIds = new Set<string>();

  for (const fact of facts) {
    if (seenIds.has(fact.id)) {
      throw new Error(`Duplicate extracted fact id: ${fact.id}`);
    }

    seenIds.add(fact.id);
  }
}

export function applyExtractedFacts(
  state: DiscoveryState,
  incomingFacts: unknown,
): DiscoveryState {
  const facts = z.array(ExtractedFactSchema).parse(incomingFacts);

  assertUniqueIncomingFactIds(facts);

  const factsById = new Map(state.facts.map((fact) => [fact.id, fact]));
  const existingStatements = new Set(
    state.facts.map((fact) => fact.statement),
  );
  const mergedFacts = [...state.facts];

  for (const fact of facts) {
    const existing = factsById.get(fact.id);

    if (existing && existing.statement !== fact.statement) {
      throw new Error(`Duplicate extracted fact id: ${fact.id}`);
    }

    if (existing || existingStatements.has(fact.statement)) {
      continue;
    }

    mergedFacts.push(fact);
    factsById.set(fact.id, fact);
    existingStatements.add(fact.statement);
  }

  return DiscoveryStateSchema.parse({
    ...state,
    facts: mergedFacts,
  });
}
