import assert from "node:assert/strict";

import { validProjectBlueprintExample } from "../schemas/examples";
import { ProjectBlueprintSchema } from "../schemas/project-blueprint";
import { createMemoryFilesystem } from "../project-filesystem";
import { inspectProject } from "../doctor/inspect-project";
import { prepareCurrentFeature } from "../planning/prepare-current-feature";
import { planVerification } from "../verification/plan-verification";
import {
  createInitializationArtifacts,
  planProjectInitialization,
} from "./initialize-project";

const empty = createMemoryFilesystem();
const initPlan = planProjectInitialization(empty);
assert.equal(initPlan.blocked.length, 0);
assert.ok(
  initPlan.actions.some((action) => action.relativePath === "context/README.md"),
);
assert.ok(
  createInitializationArtifacts().every((artifact) =>
    artifact.content.includes("\n"),
  ),
);

const alreadyPresent = createMemoryFilesystem({
  "features/current-feature.md": "# Current Feature\n",
});
const refused = planProjectInitialization(alreadyPresent);
assert.ok(refused.blocked.includes("features/current-feature.md"));

const blueprint = ProjectBlueprintSchema.parse({
  ...validProjectBlueprintExample,
  features: [
    {
      ...validProjectBlueprintExample.features[0],
      status: "planned",
    },
    {
      ...validProjectBlueprintExample.features[0],
      id: "F002",
      title: "Review a release note",
      status: "planned",
    },
  ],
});

const prepared = prepareCurrentFeature(blueprint, "F002");
assert.equal(prepared.feature.id, "F002");
assert.equal(prepared.feature.status, "in-progress");
assert.equal(
  prepared.blueprint.features.filter((feature) => feature.status === "in-progress")
    .length,
  1,
);
assert.equal(prepared.artifact.relativePath, "features/current-feature.md");
assert.match(prepared.artifact.content, /F002/);

const nextPrepared = prepareCurrentFeature(blueprint);
assert.equal(nextPrepared.feature.id, "F001");

assert.throws(() => prepareCurrentFeature(blueprint, "F999"));

const verification = planVerification(
  createMemoryFilesystem({
    "package.json": JSON.stringify({
      scripts: {
        lint: "eslint",
        typecheck: "tsc --noEmit",
        "check:export": "tsx check.ts",
      },
    }),
  }),
  blueprint,
);

assert.ok(verification.steps.some((step) => step.id === "typecheck"));
assert.ok(verification.steps.some((step) => step.id === "lint"));
assert.equal(verification.missing.length, 0);

const missingLint = planVerification(
  createMemoryFilesystem({
    "package.json": JSON.stringify({ scripts: { typecheck: "tsc --noEmit" } }),
  }),
  blueprint,
);
assert.ok(missingLint.missing.some((item) => item.check === "Lint"));

const doctor = inspectProject(
  createMemoryFilesystem({
    "blueprint.json": JSON.stringify(blueprint),
  }),
  blueprint,
);
assert.equal(doctor.healthy, false);
assert.ok(doctor.findings.some((finding) => finding.title.includes("AGENTS.md")));

const invalidDurableBlueprint = inspectProject(
  createMemoryFilesystem({
    "blueprint.json": JSON.stringify({ metadata: { schemaVersion: "1.0" } }),
  }),
);
assert.equal(invalidDurableBlueprint.healthy, false);
assert.ok(
  invalidDurableBlueprint.findings.some(
    (finding) => finding.id === "blueprint-schema-invalid",
  ),
);

const healthyish = inspectProject(
  createMemoryFilesystem({
    "AGENTS.md": "# AGENTS.md\n",
    "context/project-overview.md": "# Overview\n",
    "context/architecture.md": "# Architecture\n",
    "context/schemas.md": "# Schemas\n",
    "context/code-standards.md": "# Standards\n",
    "context/ui-context.md": "# UI\n",
    "context/ai-workflow-rules.md": "# AI\n",
    "context/progress-tracker.md": "# Progress\n",
    "features/current-feature.md": "# Current Feature\n",
    "package.json": JSON.stringify({
      dependencies: { next: "16.0.0", typescript: "5.0.0" },
    }),
  }),
  prepareCurrentFeature(blueprint).blueprint,
);
assert.equal(healthyish.healthy, true);

console.log("CLI workflow checks passed.");
