import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { approveBlueprintProposal } from "@/src/lib/blueprint/discovery/approve-blueprint";
import { validProjectBlueprintExample } from "@/src/lib/blueprint/schemas/examples";
import { ProjectBlueprintSchema } from "@/src/lib/blueprint/schemas/project-blueprint";

import {
  normalizeBlueprintSourcePath,
  runAdopt,
  runFeature,
  runGenerate,
  runInit,
} from "./commands";
import { readBlueprintFile } from "./read-blueprint";

const root = mkdtempSync(join(tmpdir(), "blueprint-cli-"));
const generationRoot = mkdtempSync(join(tmpdir(), "blueprint-generate-"));

assert.equal(
  normalizeBlueprintSourcePath("/repo", "./blueprint.json"),
  "blueprint.json",
);
assert.equal(
  normalizeBlueprintSourcePath("/repo", "nested/blueprint.json"),
  "nested/blueprint.json",
);

try {
  const init = runInit(root);
  assert.equal(init.code, 0);
  assert.match(readFileSync(join(root, "context/README.md"), "utf8"), /approved ProjectBlueprint/);

  const secondInit = runInit(root);
  assert.notEqual(secondInit.code, 0);
  assert.match(secondInit.stderr, /Refusing to overwrite/);

  const approved = approveBlueprintProposal(
    ProjectBlueprintSchema.parse(validProjectBlueprintExample),
  );
  writeFileSync(
    join(generationRoot, "blueprint.json"),
    `${JSON.stringify(approved, null, 2)}\n`,
  );

  const generatedByDefault = runGenerate(
    generationRoot,
    "blueprint.json",
    false,
  );
  assert.equal(generatedByDefault.code, 0, generatedByDefault.stderr);

  writeFileSync(join(root, "blueprint.json"), `${JSON.stringify(approved, null, 2)}\n`);

  assert.deepEqual(readBlueprintFile(root, "./blueprint.json"), approved);
  assert.throws(
    () => readBlueprintFile(root, "../blueprint.json"),
    /inside project root/,
  );
  assert.throws(
    () => readBlueprintFile(root, join(root, "blueprint.json")),
    /inside project root/,
  );

  const generated = runGenerate(root, "blueprint.json", true);
  assert.equal(generated.code, 0, generated.stderr);
  assert.match(readFileSync(join(root, "AGENTS.md"), "utf8"), /AGENTS/);
  assert.match(
    readFileSync(join(root, "context/project-overview.md"), "utf8"),
    /Project Overview/,
  );

  const featured = runFeature(root, "blueprint.json", "F001");
  assert.equal(featured.code, 0, featured.stderr);
  assert.match(
    readFileSync(join(root, "features/current-feature.md"), "utf8"),
    /F001/,
  );

  const adopted = runAdopt(root, { approve: false, force: true });
  assert.equal(adopted.code, 2);
  assert.match(adopted.stderr, /users:/);

  writeFileSync(
    join(root, "adoption-answers.json"),
    JSON.stringify({
      answers: [
        { id: "product-problem", value: "Teams lose release context." },
        { id: "users", value: "Product engineers." },
        { id: "mvp-scope", value: "Keep the existing workspace." },
      ],
    }),
  );

  const proposal = runAdopt(root, {
    answers: "adoption-answers.json",
    approve: false,
    force: true,
  });
  assert.equal(proposal.code, 0, proposal.stderr);
  assert.match(
    readFileSync(join(root, "blueprint.proposal.json"), "utf8"),
    /Preserve existing repository structure/,
  );
} finally {
  rmSync(root, { recursive: true, force: true });
  rmSync(generationRoot, { recursive: true, force: true });
}

console.log("CLI command checks passed.");
