import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { runContextGenerator } from "./contract";
import { generateProgressTracker } from "./progress-tracker";

const blueprint = ProjectBlueprintSchema.parse(validProjectBlueprintExample);

const firstRun = runContextGenerator(blueprint, generateProgressTracker);
const secondRun = runContextGenerator(blueprint, generateProgressTracker);

assert.equal(firstRun.length, 1);
assert.deepEqual(firstRun, secondRun);

const [artifact] = firstRun;
assert.equal(artifact?.relativePath, "context/progress-tracker.md");
assert.equal(artifact?.documentType, "markdown");

const content = artifact?.content ?? "";

assert.match(content, /^# Progress Tracker\n/);
assert.match(content, /- Name: Release Notes Hub\n/);
assert.match(content, /- Schema version: 1\.0\n/);
assert.match(content, /- Recorded features: 1\n/);
assert.match(content, /- Complete: 0\n/);
assert.match(content, /- In progress: 0\n/);
assert.match(content, /- Planned: 1\n/);
assert.match(content, /## Current feature\n\nNo feature is currently in progress\.\n/);
assert.match(content, /### foundation\n/);
assert.match(content, /### F001 — Create a release note\n/);
assert.match(content, /- Status: planned\n/);
assert.match(content, /- Phase: foundation\n/);
assert.match(
  content,
  /### Should drafts be recoverable after a browser refresh\?\n/,
);
assert.match(content, /- Blocking: no\n/);
assert.doesNotMatch(content, /Status: complete/);
assert.doesNotMatch(content, /All recorded features are complete/);
assert.doesNotMatch(content, /Grill Me/);
assert.ok(content.endsWith("\n"));

const mixedBlueprint = ProjectBlueprintSchema.parse({
  ...validProjectBlueprintExample,
  features: [
    {
      id: "F001",
      title: "Create a release note",
      objective: "Allow a product engineer to draft a release note.",
      phase: "foundation",
      status: "complete",
      dependencies: [],
      scopeSummary: "Create and validate the initial release note form.",
    },
    {
      id: "F002",
      title: "Review a release note",
      objective: "Allow a reviewer to approve a draft.",
      phase: "generation",
      status: "in-progress",
      dependencies: ["F001"],
      scopeSummary: "Add review state without publishing automatically.",
    },
    {
      id: "F003",
      title: "Publish a release note",
      objective: "Publish an approved draft.",
      phase: "generation",
      status: "planned",
      dependencies: ["F002"],
      scopeSummary: "Publish only after human approval.",
    },
    {
      id: "F004",
      title: "Add team history",
      objective: "Persist historical release notes for a team.",
      phase: "discovery",
      status: "blocked",
      dependencies: [],
      scopeSummary: "Blocked until persistence is approved.",
    },
    {
      id: "F005",
      title: "Add billing",
      objective: "Charge teams for stored history.",
      phase: "discovery",
      status: "deferred",
      dependencies: [],
      scopeSummary: "Out of V1 unless later approved.",
    },
  ],
  unresolvedDecisions: [],
});

const mixedContent =
  runContextGenerator(mixedBlueprint, generateProgressTracker)[0]?.content ??
  "";
const mixedSecondContent =
  runContextGenerator(mixedBlueprint, generateProgressTracker)[0]?.content ??
  "";

assert.equal(mixedContent, mixedSecondContent);
assert.match(mixedContent, /- Recorded features: 5\n/);
assert.match(mixedContent, /- Complete: 1\n/);
assert.match(mixedContent, /- In progress: 1\n/);
assert.match(mixedContent, /- Planned: 1\n/);
assert.match(mixedContent, /- Blocked: 1\n/);
assert.match(mixedContent, /- Deferred: 1\n/);
assert.match(
  mixedContent,
  /## Current feature\n\n- F002 — Review a release note — in-progress\n/,
);
assert.match(mixedContent, /### F002 — Review a release note\n/);
assert.match(mixedContent, /### F003 — Publish a release note\n/);
assert.match(mixedContent, /### F004 — Add team history\n/);
assert.match(mixedContent, /### F005 — Add billing\n/);
assert.match(mixedContent, /Dependencies:\n\n- F001\n/);
assert.match(
  mixedContent,
  /## Unresolved decisions\n\nThere are no unresolved decisions\.\n/,
);

const featuresSection = mixedContent.slice(mixedContent.indexOf("## Features\n"));
const foundationIndex = featuresSection.indexOf("### foundation\n");
const generationIndex = featuresSection.indexOf("### generation\n");
const discoveryIndex = featuresSection.indexOf("### discovery\n");
const f001Index = featuresSection.indexOf("### F001 — Create a release note\n");
const f002Index = featuresSection.indexOf("### F002 — Review a release note\n");
const f003Index = featuresSection.indexOf("### F003 — Publish a release note\n");

assert.ok(foundationIndex !== -1);
assert.ok(generationIndex > foundationIndex);
assert.ok(discoveryIndex > generationIndex);
assert.ok(f001Index > foundationIndex);
assert.ok(f002Index > generationIndex);
assert.ok(f003Index > f002Index);
assert.match(mixedContent, /- Status: complete\n/);
assert.match(mixedContent, /- Status: in-progress\n/);
assert.match(mixedContent, /- Status: blocked\n/);
assert.match(mixedContent, /- Status: deferred\n/);
assert.doesNotMatch(mixedContent, /All recorded features are complete/);
assert.doesNotMatch(mixedContent, /No feature is currently in progress/);
assert.doesNotMatch(mixedContent, /Should drafts be recoverable/);

console.log("Progress tracker generator checks passed.");
