import type { DiscoveryTopic, ExtractedFact } from "../schemas/discovery";

function isFirstUserStatement(statement: string): boolean {
  return /\b(?:first|primary|initial)\s+(?:target\s+)?user\b/i.test(statement);
}

export function factCoversTopic(
  fact: ExtractedFact,
  topic: DiscoveryTopic,
): boolean {
  if (fact.topic === topic) {
    return true;
  }

  return topic === "users" &&
    fact.topic === "user-roles" &&
    isFirstUserStatement(fact.statement);
}
