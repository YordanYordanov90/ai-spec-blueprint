function renderInline(text: string): string {
  return text;
}

function MarkdownBlocks({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        const heading = /^(#{1,3})\s+(.+)$/.exec(lines[0] ?? "");

        if (heading && lines.length === 1) {
          const level = heading[1].length;
          const text = heading[2];
          const className =
            level === 1
              ? "font-heading text-2xl tracking-tight"
              : level === 2
                ? "font-heading text-xl tracking-tight"
                : "font-heading text-lg tracking-tight";

          if (level === 1) {
            return (
              <h1 key={`${index}-${text}`} className={className}>
                {renderInline(text)}
              </h1>
            );
          }

          if (level === 2) {
            return (
              <h2 key={`${index}-${text}`} className={className}>
                {renderInline(text)}
              </h2>
            );
          }

          return (
            <h3 key={`${index}-${text}`} className={className}>
              {renderInline(text)}
            </h3>
          );
        }

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={`${index}-list`} className="list-disc space-y-1 pl-5 text-sm leading-6">
              {lines.map((line) => (
                <li key={line}>{renderInline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${index}-p`} className="text-sm leading-7 text-foreground/90">
            {renderInline(lines.join(" "))}
          </p>
        );
      })}
    </div>
  );
}

export function MarkdownPreview({
  path,
  content,
}: {
  path: string;
  content: string;
}) {
  return (
    <article className="min-h-full border border-border bg-background/80 p-6">
      <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        Preview
      </p>
      <p className="mt-2 font-mono text-xs text-status">{path}</p>
      <div className="mt-6">
        <MarkdownBlocks content={content} />
      </div>
    </article>
  );
}
