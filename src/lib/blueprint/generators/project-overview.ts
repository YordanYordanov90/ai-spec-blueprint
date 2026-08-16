import type { ProjectBlueprint, TargetUser } from "../schemas/project-blueprint";
import type { ContextGenerator } from "./contract";
import {
  joinMarkdownBlocks,
  markdownBulletList,
  markdownDocument,
  markdownHeading,
  markdownParagraph,
} from "./markdown";

function renderUser(user: TargetUser): string {
  return joinMarkdownBlocks([
    markdownHeading(3, user.name),
    markdownParagraph(user.description),
    "Needs:",
    markdownBulletList(user.needs),
  ]);
}

export function renderProjectOverviewMarkdown(
  blueprint: ProjectBlueprint,
): string {
  return markdownDocument([
    markdownHeading(1, "Project Overview"),
    markdownHeading(2, "Product name"),
    markdownParagraph(blueprint.product.name),
    markdownHeading(2, "Summary"),
    markdownParagraph(blueprint.product.summary),
    markdownHeading(2, "Problem"),
    markdownParagraph(blueprint.product.problem),
    markdownHeading(2, "Users"),
    ...blueprint.users.map(renderUser),
    markdownHeading(2, "Goals"),
    markdownBulletList(blueprint.goals),
    markdownHeading(2, "Non-goals"),
    markdownBulletList(blueprint.nonGoals),
    markdownHeading(2, "Success criteria"),
    markdownBulletList(blueprint.product.successCriteria),
  ]);
}

export const generateProjectOverview: ContextGenerator = (blueprint) => [
  {
    relativePath: "context/project-overview.md",
    content: renderProjectOverviewMarkdown(blueprint),
    documentType: "markdown",
  },
];
