import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const landing = readFileSync("app/page.tsx", "utf8");
const onboarding = readFileSync("app/new/page.tsx", "utf8");
const workspace = readFileSync(
  "components/onboarding/onboarding-workspace.tsx",
  "utf8",
);
const ideaForm = readFileSync(
  "components/onboarding/project-idea-form.tsx",
  "utf8",
);

assert.match(landing, /href="\/new"/);
assert.match(landing, /Start a project/);
assert.match(onboarding, /href="\/"/);
assert.match(onboarding, /Back to landing/);
assert.match(workspace, /Start from the problem, not a chat transcript/);
assert.match(workspace, /CompletenessPanel/);
assert.match(onboarding, /OnboardingWorkspace/);
assert.doesNotMatch(onboarding, /["']use client["']/);
assert.doesNotMatch(onboarding, /ProjectBlueprint/);
assert.doesNotMatch(onboarding, /generateContextPackage/);
assert.doesNotMatch(onboarding, /DiscoveryState/);

assert.match(ideaForm, /["']use client["']/);
assert.match(ideaForm, /Initial project idea/);
assert.match(ideaForm, /Start Grill Me/);
assert.match(ideaForm, /name="initialIdea"/);
assert.match(ideaForm, /<Textarea/);
assert.doesNotMatch(ideaForm, /Send message/);
assert.doesNotMatch(ideaForm, /currentQuestion/);
assert.doesNotMatch(ideaForm, /extractProjectFacts/);
assert.doesNotMatch(ideaForm, /generateFollowUpQuestion/);

console.log("Onboarding shell checks passed.");
