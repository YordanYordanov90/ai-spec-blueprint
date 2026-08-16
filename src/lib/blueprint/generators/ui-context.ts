import type {
  ProjectBlueprint,
  UiDirection,
} from "../schemas/project-blueprint";
import type { ContextGenerator } from "./contract";
import {
  markdownBulletList,
  markdownDocument,
  markdownHeading,
  markdownParagraph,
} from "./markdown";

function renderUnresolvedBranding(
  choices: UiDirection["unresolvedBrandingChoices"],
): string {
  if (choices.length === 0) {
    return markdownParagraph("There are no unresolved branding choices.");
  }

  return markdownBulletList(choices);
}

export function renderUiContextMarkdown(blueprint: ProjectBlueprint): string {
  const { ui } = blueprint;

  return markdownDocument([
    markdownHeading(1, "UI Context"),
    markdownHeading(2, "Product character"),
    markdownParagraph(ui.personality),
    markdownHeading(2, "Visual direction"),
    markdownParagraph(ui.visualDirection),
    markdownHeading(2, "Layout principles"),
    markdownBulletList(ui.layoutPrinciples),
    markdownHeading(2, "Navigation"),
    markdownParagraph(ui.navigationModel),
    markdownHeading(2, "Responsive behavior"),
    markdownParagraph(ui.responsiveBehavior),
    markdownHeading(2, "Accessibility"),
    markdownBulletList(ui.accessibilityRequirements),
    markdownHeading(2, "Component strategy"),
    markdownParagraph(ui.componentStrategy),
    markdownHeading(2, "Unresolved branding choices"),
    renderUnresolvedBranding(ui.unresolvedBrandingChoices),
  ]);
}

export const generateUiContext: ContextGenerator = (blueprint) => [
  {
    relativePath: "context/ui-context.md",
    content: renderUiContextMarkdown(blueprint),
    documentType: "markdown",
  },
];
