import type { DetectedTechnology } from "./detect-technology";
import type { ProjectFilesystem } from "../project-filesystem";
import type { DiscoveryTopic } from "../schemas/discovery";

export type AdoptionQuestion = {
  id: string;
  topic: DiscoveryTopic;
  question: string;
  whyItMatters: string;
  blocking: boolean;
};

export type AdoptionAnswer = {
  id: string;
  value: string;
};

function hasCategory(
  facts: readonly DetectedTechnology[],
  category: string,
): boolean {
  return facts.some((fact) => fact.category === category);
}

function readmeLooksProductive(filesystem: ProjectFilesystem): boolean {
  const readme =
    filesystem.readText("README.md") ?? filesystem.readText("readme.md");

  if (!readme) {
    return false;
  }

  const trimmed = readme.trim();
  return trimmed.length > 80 && !/bootstrap context/i.test(trimmed);
}

export function collectAdoptionQuestions(
  filesystem: ProjectFilesystem,
  facts: readonly DetectedTechnology[],
): readonly AdoptionQuestion[] {
  const questions: AdoptionQuestion[] = [];
  const hasPackageDescription = hasCategory(facts, "package-description");
  const hasReadme = readmeLooksProductive(filesystem);

  if (!hasPackageDescription && !hasReadme) {
    questions.push({
      id: "product-problem",
      topic: "product-problem",
      question: "What problem does this existing project solve?",
      whyItMatters:
        "Adoption must describe the current product, not invent a replacement product.",
      blocking: true,
    });
  }

  questions.push({
    id: "users",
    topic: "users",
    question: "Who uses this repository today, and what do they need to accomplish?",
    whyItMatters:
      "Detected dependencies do not identify the actual users of the existing product.",
    blocking: true,
  });

  questions.push({
    id: "mvp-scope",
    topic: "mvp-scope",
    question: "What should adoption capture now, and what remaining work is out of scope?",
    whyItMatters:
      "The generated blueprint should describe the current system instead of a future rewrite.",
    blocking: true,
  });

  if (!hasCategory(facts, "persistence")) {
    questions.push({
      id: "persistence",
      topic: "persistence",
      question: "Does this existing project already have durable storage?",
      whyItMatters:
        "Persistence must be recorded from the repository, not assumed from a greenfield template.",
      blocking: false,
    });
  }

  if (!hasCategory(facts, "authentication")) {
    questions.push({
      id: "authentication",
      topic: "authentication",
      question: "Does this existing project already require signed-in users?",
      whyItMatters:
        "Authentication should stay unresolved unless the codebase or a human confirms it.",
      blocking: false,
    });
  }

  return questions;
}

export function unansweredAdoptionQuestions(
  questions: readonly AdoptionQuestion[],
  answers: readonly AdoptionAnswer[],
): readonly AdoptionQuestion[] {
  const answered = new Set(answers.map((answer) => answer.id));
  return questions.filter((question) => !answered.has(question.id));
}

export function blockingUnansweredQuestions(
  questions: readonly AdoptionQuestion[],
  answers: readonly AdoptionAnswer[],
): readonly AdoptionQuestion[] {
  return unansweredAdoptionQuestions(questions, answers).filter(
    (question) => question.blocking,
  );
}
