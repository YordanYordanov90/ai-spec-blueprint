function normalizeMarkdownText(text: string): string {
  return text
    .split(/\r?\n/)
    .map((line) =>
      line
        .trim()
        .replace(/^#{1,6}\s+/, "")
        .replace(/^[-*+]\s+/, "")
        .replace(/^\d+\.\s+/, "")
        .replace(/^>\s?/, "")
        .replace(/^(`{3,}|~{3,})\s*$/, ""),
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Render untrusted free text while preserving paragraph boundaries. Markdown
 * block markers are removed so the text cannot create new headings or
 * instruction blocks in an authoritative generated document.
 */
export function markdownPlainText(text: string): string {
  return normalizeMarkdownText(text);
}

export function markdownHeading(level: 1 | 2 | 3, text: string): string {
  return `${"#".repeat(level)} ${markdownPlainText(text)
    .replace(/\s+/g, " ")
    .trim()}`;
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
