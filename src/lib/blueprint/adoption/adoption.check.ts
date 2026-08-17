import assert from "node:assert/strict";

import { createMemoryFilesystem } from "../project-filesystem";
import { analyzeConventions } from "./analyze-conventions";
import {
  blockingUnansweredQuestions,
  collectAdoptionQuestions,
} from "./adoption-questions";
import { detectTechnology } from "./detect-technology";
import {
  approveAdoptedBlueprint,
  generateAdoptedBlueprint,
} from "./generate-adopted-blueprint";

const filesystem = createMemoryFilesystem({
  "package.json": JSON.stringify({
    name: "notes-hub",
    dependencies: {
      next: "16.3.1",
      react: "19.0.0",
      zod: "4.0.0",
      tailwindcss: "4.0.0",
    },
    devDependencies: {
      typescript: "5.0.0",
    },
  }),
  "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "@/*": ["./*"] } } }),
  "next.config.ts": "export default {};\n",
  "app/page.tsx": "export default function Home() { return null; }\n",
  "src/lib/domain.ts": "export const name = \"domain\";\n",
  "components/ui/button.tsx": "\"use client\";\nexport function Button() { return null; }\n",
  "features/backlog.md": "### F001 - Existing feature — complete\n\n### F027 - Export\n",
});

const facts = detectTechnology(filesystem);
assert.ok(facts.some((fact) => fact.choice === "Next.js"));
assert.ok(facts.some((fact) => fact.choice === "Zod"));
assert.ok(!facts.some((fact) => fact.category === "persistence"));
assert.ok(!facts.some((fact) => fact.category === "authentication"));
assert.ok(facts.some((fact) => fact.choice === "App Router"));
assert.ok(!facts.some((fact) => fact.choice === "PostgreSQL"));

const conventions = analyzeConventions(filesystem);
assert.ok(conventions.some((item) => item.id === "app-router-files"));
assert.ok(conventions.some((item) => item.id === "explicit-client-components"));
assert.ok(conventions.some((item) => item.id === "path-alias"));

const questions = collectAdoptionQuestions(filesystem, facts);
assert.ok(questions.some((question) => question.id === "users"));
assert.ok(questions.some((question) => question.id === "mvp-scope"));
assert.ok(questions.some((question) => question.id === "persistence"));
assert.ok(questions.some((question) => question.id === "authentication"));
assert.ok(!questions.some((question) => question.question.toLowerCase().includes("next.js")));

const unanswered = blockingUnansweredQuestions(questions, []);
assert.ok(unanswered.length >= 2);
assert.throws(() =>
  generateAdoptedBlueprint({
    filesystem,
    facts,
    conventions,
    questions,
    answers: [],
  }),
);

const proposal = generateAdoptedBlueprint({
  filesystem,
  facts,
  conventions,
  questions,
  answers: [
    { id: "product-problem", value: "Teams lose release notes." },
    { id: "users", value: "Product engineers publishing notes." },
    { id: "mvp-scope", value: "Record the current workspace, not a rewrite." },
  ],
});

assert.equal(proposal.product.name, "notes-hub");
assert.match(proposal.product.problem, /Teams lose release notes/);
assert.ok(proposal.stack.some((decision) => decision.choice === "Next.js"));
assert.ok(
  proposal.architecture.some((decision) =>
    decision.title.includes("existing repository"),
  ),
);
assert.ok(proposal.features.some((feature) => feature.id === "F027"));
assert.ok(proposal.features.some((feature) => feature.id === "F001" && feature.status === "complete"));
assert.ok(proposal.stack.some((decision) => decision.review.status === "proposed"));

const approved = approveAdoptedBlueprint(proposal);
assert.ok(
  approved.stack
    .filter((decision) => decision.choice === "Next.js")
    .every((decision) => decision.status === "confirmed"),
);
assert.ok(
  approved.architecture.every((decision) => decision.status === "approved"),
);

console.log("Adoption checks passed.");
