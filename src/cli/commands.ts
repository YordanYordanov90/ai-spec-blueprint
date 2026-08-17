import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import {
  analyzeConventions,
  approveAdoptedBlueprint,
  assertWritablePlan,
  BLUEPRINT_DOCUMENT_PATH,
  blockingUnansweredQuestions,
  collectAdoptionQuestions,
  createContextExport,
  detectTechnology,
  generateAdoptedBlueprint,
  inspectProject,
  planArtifactWrite,
  planProjectInitialization,
  planVerification,
  prepareCurrentFeature,
  type AdoptionAnswer,
  type ProjectBlueprint,
} from "@/src/lib/blueprint";

import { createNodeProjectFilesystem } from "./node-filesystem";
import { readBlueprintFile, tryReadBlueprintFile } from "./read-blueprint";
import { writeArtifactPlan } from "./write-plan";

export type CommandResult = {
  code: number;
  stdout: string;
  stderr: string;
};

function ok(stdout: string): CommandResult {
  return { code: 0, stdout, stderr: "" };
}

function fail(stderr: string, code = 1): CommandResult {
  return { code, stdout: "", stderr };
}

function formatLines(title: string, lines: readonly string[]): string {
  return [title, ...lines.map((line) => `- ${line}`)].join("\n");
}

function readAnswersFile(path: string): AdoptionAnswer[] {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as {
    answers?: AdoptionAnswer[];
  };

  if (!Array.isArray(parsed.answers)) {
    throw new Error("Adoption answers must be { \"answers\": [{ \"id\", \"value\" }] }.");
  }

  return parsed.answers;
}

export function runInit(root: string): CommandResult {
  const filesystem = createNodeProjectFilesystem(root);
  const plan = planProjectInitialization(filesystem);

  try {
    assertWritablePlan(plan);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Init refused to overwrite.");
  }

  writeArtifactPlan(root, plan);
  return ok(
    formatLines(
      "Initialized durable context placeholders.",
      plan.actions.map((action) => action.relativePath),
    ),
  );
}

export function runGenerate(
  root: string,
  from: string,
  force: boolean,
): CommandResult {
  let blueprint: ProjectBlueprint;

  try {
    blueprint = readBlueprintFile(root, from);
  } catch (error) {
    return fail(
      error instanceof Error
        ? error.message
        : "Could not read an approved blueprint.",
    );
  }

  try {
    const exported = createContextExport(blueprint);
    const sourcePath = relative(resolve(root), resolve(root, from)).replaceAll(
      "\\",
      "/",
    );
    const artifacts =
      sourcePath === BLUEPRINT_DOCUMENT_PATH
        ? exported.files.filter(
            (artifact) => artifact.relativePath !== BLUEPRINT_DOCUMENT_PATH,
          )
        : exported.files;
    const plan = planArtifactWrite(
      createNodeProjectFilesystem(root),
      artifacts,
      { force },
    );
    assertWritablePlan(plan);
    writeArtifactPlan(root, plan);
    return ok(
      formatLines(
        `Generated ${artifacts.length} files from ${blueprint.product.name}.`,
        plan.actions.map((action) => `${action.status} ${action.relativePath}`),
      ),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Generate failed.");
  }
}

export function runFeature(
  root: string,
  from: string,
  featureId?: string,
): CommandResult {
  try {
    const prepared = prepareCurrentFeature(
      readBlueprintFile(root, from),
      featureId,
    );
    const filesystem = createNodeProjectFilesystem(root);
    const plan = planArtifactWrite(
      filesystem,
      [prepared.artifact, {
        relativePath: "blueprint.json",
        content: `${JSON.stringify(prepared.blueprint, null, 2)}\n`,
        documentType: "json",
      }],
      { force: true },
    );
    writeArtifactPlan(root, plan);
    return ok(
      `Prepared ${prepared.feature.id} — ${prepared.feature.title} as the current feature.`,
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Feature planning failed.");
  }
}

export function runVerify(root: string, from?: string): CommandResult {
  const filesystem = createNodeProjectFilesystem(root);
  const blueprint = tryReadBlueprintFile(root, from ?? "blueprint.json");
  const plan = planVerification(filesystem, blueprint);
  const lines: string[] = [];

  if (plan.missing.length > 0) {
    lines.push("Missing required checks:");
    for (const missing of plan.missing) {
      lines.push(`- ${missing.check}: ${missing.reason}`);
    }
  }

  let failed = plan.missing.length > 0;

  for (const step of plan.steps) {
    const result = spawnSync(step.command, [...step.args], {
      cwd: resolve(root),
      encoding: "utf8",
      stdio: "pipe",
    });
    const succeeded = result.status === 0;
    lines.push(
      `${succeeded ? "pass" : "fail"} ${step.label} (${step.command} ${step.args.join(" ")})`,
    );

    if (!succeeded) {
      failed = true;
      if (result.stderr) {
        lines.push(result.stderr.trim());
      }
    }
  }

  const output = lines.join("\n");
  return failed ? fail(output || "Verification failed.") : ok(output);
}

export function runDoctor(root: string, from?: string): CommandResult {
  const filesystem = createNodeProjectFilesystem(root);
  const blueprint = tryReadBlueprintFile(root, from ?? "blueprint.json");
  const report = inspectProject(filesystem, blueprint);
  const lines = report.findings.map(
    (finding) => `${finding.severity} ${finding.title}: ${finding.detail}`,
  );

  if (lines.length === 0) {
    return ok("No context problems were detected.");
  }

  const output = lines.join("\n");
  return report.healthy ? ok(output) : fail(output);
}

export function runAdopt(
  root: string,
  options: { answers?: string; approve: boolean; force: boolean },
): CommandResult {
  const filesystem = createNodeProjectFilesystem(root);
  const facts = detectTechnology(filesystem);
  const conventions = analyzeConventions(filesystem);
  const questions = collectAdoptionQuestions(filesystem, facts);
  const answers = options.answers ? readAnswersFile(resolve(root, options.answers)) : [];
  const remaining = blockingUnansweredQuestions(questions, answers);

  if (remaining.length > 0) {
    return fail(
      formatLines(
        "Adoption needs answers before a blueprint can be proposed.",
        remaining.map((question) => `${question.id}: ${question.question}`),
      ),
      2,
    );
  }

  try {
    const proposal = generateAdoptedBlueprint({
      filesystem,
      facts,
      conventions,
      questions,
      answers,
    });
    const blueprint = options.approve
      ? approveAdoptedBlueprint(proposal)
      : proposal;
    const document = `${JSON.stringify(blueprint, null, 2)}\n`;
    const target = options.approve ? "blueprint.json" : "blueprint.proposal.json";
    const plan = planArtifactWrite(
      filesystem,
      [
        {
          relativePath: target,
          content: document,
          documentType: "json",
        },
      ],
      { force: options.force },
    );
    assertWritablePlan(plan);
    writeArtifactPlan(root, plan);

    return ok(
      [
        options.approve
          ? `Approved adopted blueprint written to ${target}.`
          : `Adopted blueprint proposal written to ${target}.`,
        `Detected technologies: ${facts.length}`,
        `Observed conventions: ${conventions.length}`,
      ].join("\n"),
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Adoption failed.");
  }
}
