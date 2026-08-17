import type { ReactNode } from "react";

function renderInline(text: string): string {
  return text;
}

type ListMode = "unordered" | "ordered";

function MarkdownBlocks({ content }: { content: string }) {
  const lines = content.trim().split(/\r?\n/);
  const renderedBlocks: ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listMode: ListMode | null = null;
  let listItems: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return;
    }

    renderedBlocks.push(
      <p
        key={`paragraph-${renderedBlocks.length}`}
        className="max-w-3xl text-sm leading-7 text-foreground/85"
      >
        {renderInline(paragraphLines.join(" "))}
      </p>,
    );
    paragraphLines = [];
  }

  function flushList() {
    if (listMode === null || listItems.length === 0) {
      return;
    }

    const items = listItems.map((item, index) => (
      <li
        key={`${listMode}-item-${index}`}
        className={
          listMode === "ordered"
            ? "relative"
            : "relative before:absolute before:-left-[1.34rem] before:top-[0.7rem] before:size-1 before:bg-accent"
        }
      >
        {renderInline(item)}
      </li>
    ));

    if (listMode === "ordered") {
      renderedBlocks.push(
        <ol
          key={`ordered-list-${renderedBlocks.length}`}
          className="list-decimal space-y-2 border-l border-border pl-9 text-sm leading-6 text-foreground/90 marker:font-mono marker:text-[10px] marker:text-muted-foreground"
        >
          {items}
        </ol>,
      );
    } else {
      renderedBlocks.push(
        <ul
          key={`unordered-list-${renderedBlocks.length}`}
          className="space-y-2 border-l border-border pl-5 text-sm leading-6 text-foreground/90"
        >
          {items}
        </ul>,
      );
    }

    listMode = null;
    listItems = [];
  }

  function flushText() {
    flushParagraph();
    flushList();
  }

  lines.forEach((line) => {
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const unorderedItem = /^-\s+(.+)$/.exec(line);
    const orderedItem = /^\d+\.\s+(.+)$/.exec(line);

    if (heading) {
      flushText();
      const level = heading[1].length;
      const text = heading[2];
      const className =
        level === 1
          ? "scroll-mt-8 text-3xl font-semibold tracking-[-0.045em]"
          : level === 2
            ? "mt-4 border-t border-border pt-7 text-xl font-semibold tracking-[-0.035em]"
            : "mt-2 text-base font-semibold tracking-[-0.02em]";

      if (level === 1) {
        renderedBlocks.push(
          <h1 key={`heading-${renderedBlocks.length}`} className={className}>
            {renderInline(text)}
          </h1>,
        );
      } else if (level === 2) {
        renderedBlocks.push(
          <h2 key={`heading-${renderedBlocks.length}`} className={className}>
            {renderInline(text)}
          </h2>,
        );
      } else {
        renderedBlocks.push(
          <h3 key={`heading-${renderedBlocks.length}`} className={className}>
            {renderInline(text)}
          </h3>,
        );
      }
      return;
    }

    if (unorderedItem || orderedItem) {
      const nextMode: ListMode = unorderedItem ? "unordered" : "ordered";
      const itemText = (unorderedItem ?? orderedItem)?.[1] ?? "";

      flushParagraph();
      if (listMode !== nextMode) {
        flushList();
        listMode = nextMode;
      }
      listItems.push(itemText);
      return;
    }

    if (line.trim().length === 0) {
      flushText();
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushText();

  return <div className="flex flex-col gap-4">{renderedBlocks}</div>;
}

export function MarkdownPreview({
  path,
  content,
}: {
  path: string;
  content: string;
}) {
  return (
    <article className="min-h-[38rem] min-w-0 bg-surface-elevated">
      <div className="flex min-w-0 items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div className="min-w-0">
          <p className="blueprint-kicker text-muted-foreground">Preview</p>
          <p className="mt-1 truncate font-mono text-[10px] text-accent">{path}</p>
        </div>
        <span className="shrink-0 border border-border bg-code-surface px-2 py-1 font-mono text-[8px] tracking-[0.08em] text-muted-foreground uppercase">
          Markdown · read only
        </span>
      </div>
      <div className="grid min-w-0 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
        <div
          aria-hidden="true"
          className="hidden border-r border-border bg-code-surface py-8 text-center font-mono text-[9px] leading-7 text-muted-foreground/50 sm:block"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className="block">
              {String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
        <div className="min-w-0 p-5 sm:p-8 lg:p-10">
          <MarkdownBlocks content={content} />
        </div>
      </div>
    </article>
  );
}
