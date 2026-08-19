import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync("app/new/page.tsx", "utf8");
const grillMe = readFileSync("components/grill-me/grill-me-interface.tsx", "utf8");
const ideaForm = readFileSync(
  "components/onboarding/project-idea-form.tsx",
  "utf8",
);
const actions = readFileSync("app/new/actions.ts", "utf8");

assert.match(page, /OnboardingWorkspace/);
assert.doesNotMatch(page, /["']use client["']/);
assert.doesNotMatch(page, /generateContextPackage/);
assert.doesNotMatch(page, /proposeProjectBlueprint/);

assert.match(ideaForm, /Initial project idea/);
assert.match(ideaForm, /Start Grill Me/);
assert.match(ideaForm, /name="initialIdea"/);

assert.match(grillMe, /Focused question/);
assert.match(grillMe, /Why this matters/);
assert.match(grillMe, /Extracted facts/);
assert.match(grillMe, /Submit answer/);
assert.match(grillMe, /readyForBlueprintProposal/);
assert.match(grillMe, /AiFailureNotice/);
assert.match(grillMe, /classifyAiError/);
assert.match(grillMe, /finally/);
assert.doesNotMatch(grillMe, /Send message/);
assert.doesNotMatch(grillMe, /chat transcript/);
assert.doesNotMatch(grillMe, /generateContextPackage/);
assert.doesNotMatch(grillMe, /completeness\.map/);

assert.match(actions, /["']use server["']/);
assert.match(actions, /runGrillMeStart/);
assert.match(actions, /runGrillMeAnswer/);
assert.match(actions, /loadAiModelConfig/);
assert.match(actions, /consumeAiRateLimit/);
assert.match(actions, /enforceAiRateLimit/);
assert.doesNotMatch(actions, /generateContextPackage/);

console.log("Grill Me interface checks passed.");
