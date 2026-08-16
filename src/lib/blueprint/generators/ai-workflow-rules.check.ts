import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { generateAiWorkflowRules } from "./ai-workflow-rules";
import { runContextGenerator } from "./contract";

const blueprintWithoutAi = ProjectBlueprintSchema.parse(
  validProjectBlueprintExample,
);

const firstRunWithoutAi = runContextGenerator(
  blueprintWithoutAi,
  generateAiWorkflowRules,
);
const secondRunWithoutAi = runContextGenerator(
  blueprintWithoutAi,
  generateAiWorkflowRules,
);

assert.equal(firstRunWithoutAi.length, 1);
assert.deepEqual(firstRunWithoutAi, secondRunWithoutAi);

const [artifactWithoutAi] = firstRunWithoutAi;
assert.equal(artifactWithoutAi?.relativePath, "context/ai-workflow-rules.md");
assert.equal(artifactWithoutAi?.documentType, "markdown");
assert.match(
  artifactWithoutAi?.content ?? "",
  /^# AI Workflow Rules\n\nAI is not part of the approved scope for this project\.\n/,
);
assert.doesNotMatch(artifactWithoutAi?.content ?? "", /Grill Me/);
assert.doesNotMatch(artifactWithoutAi?.content ?? "", /gpt-/i);

const blueprintWithAi = ProjectBlueprintSchema.parse({
  ...validProjectBlueprintExample,
  ai: {
    purpose: "Draft release note summaries from approved change lists.",
    allowedResponsibilities: [
      "Summarize approved changes",
      "Flag missing review state",
    ],
    prohibitedResponsibilities: ["Publish without approval"],
    providerModelConstraints: ["Do not hardcode a model name"],
    outputValidation: "Validate structured draft fields before display.",
    fallbackErrorExpectations:
      "Surface validation failures instead of publishing a partial draft.",
    humanApprovalBoundaries: ["A human must approve publication"],
  },
  guardrails: [
    ...validProjectBlueprintExample.guardrails,
    {
      id: "ai-no-publish",
      title: "AI cannot publish",
      rule: "AI may draft but may not publish release notes.",
      category: "AI",
      source: "project-specific",
      severity: "required",
      rationale: "Publication requires human review.",
    },
  ],
});

const firstRunWithAi = runContextGenerator(
  blueprintWithAi,
  generateAiWorkflowRules,
);
const secondRunWithAi = runContextGenerator(
  blueprintWithAi,
  generateAiWorkflowRules,
);

assert.deepEqual(firstRunWithAi, secondRunWithAi);

const contentWithAi = firstRunWithAi[0]?.content ?? "";

assert.match(contentWithAi, /^# AI Workflow Rules\n/);
assert.match(
  contentWithAi,
  /## Purpose\n\nDraft release note summaries from approved change lists\.\n/,
);
assert.match(contentWithAi, /- Summarize approved changes\n/);
assert.match(contentWithAi, /- Publish without approval\n/);
assert.match(contentWithAi, /- Do not hardcode a model name\n/);
assert.match(
  contentWithAi,
  /## Output validation\n\nValidate structured draft fields before display\.\n/,
);
assert.match(contentWithAi, /- A human must approve publication\n/);
assert.match(contentWithAi, /### AI cannot publish\n/);
assert.doesNotMatch(contentWithAi, /not part of the approved scope/);
assert.doesNotMatch(contentWithAi, /gpt-/i);
assert.ok(contentWithAi.endsWith("\n"));

console.log("AI workflow rules generator checks passed.");
