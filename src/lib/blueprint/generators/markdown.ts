export function markdownHeading(level: 1 | 2 | 3, text: string): string {
  return `${"#".repeat(level)} ${text.trim()}`;
}

export function markdownParagraph(text: string): string {
  return text.trim();
}

export function markdownBulletList(items: readonly string[]): string {
  return items
    .map((item) => `- ${item.trim().split(/\r?\n/).map((line) => line.trim()).join(" ")}`)
    .join("\n");
}

export function joinMarkdownBlocks(
  blocks: readonly (string | null | undefined)[],
): string {
  return blocks
    .map((block) => block?.trim())
    .filter((block): block is string => Boolean(block))
    .join("\n\n");
}

export function markdownDocument(
  blocks: readonly (string | null | undefined)[],
): string {
  return `${joinMarkdownBlocks(blocks)}\n`;
}
