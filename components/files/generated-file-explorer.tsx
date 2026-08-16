"use client";

import { useMemo, useState } from "react";

import type { GeneratedArtifact } from "@/src/lib/blueprint/schemas/generated-artifact";

import { MarkdownPreview } from "./markdown-preview";

export function GeneratedFileExplorer({
  artifacts,
  onBackToReview,
}: {
  artifacts: readonly GeneratedArtifact[];
  onBackToReview?: () => void;
}) {
  const files = useMemo(
    () => [...artifacts].sort((left, right) =>
      left.relativePath.localeCompare(right.relativePath),
    ),
    [artifacts],
  );
  const [selectedPath, setSelectedPath] = useState(
    files[0]?.relativePath ?? "",
  );
  const selected =
    files.find((file) => file.relativePath === selectedPath) ?? files[0];

  return (
    <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.3fr)] lg:items-start lg:py-14">
      <aside className="border border-border bg-card/60 p-5">
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          Generated files
        </p>
        <h2 className="mt-3 font-heading text-xl tracking-tight">Explorer</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Deterministic renderers produced these files. They stay in this
          preview until a later packaging feature.
        </p>
        <nav aria-label="Generated files" className="mt-5">
          <ul className="space-y-1">
            {files.map((file) => {
              const isSelected = file.relativePath === selected?.relativePath;

              return (
                <li key={file.relativePath}>
                  <button
                    type="button"
                    onClick={() => setSelectedPath(file.relativePath)}
                    aria-current={isSelected ? "page" : undefined}
                    className={`block w-full px-3 py-2 text-left font-mono text-xs leading-5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                      isSelected
                        ? "border border-border bg-background text-foreground"
                        : "border border-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground"
                    }`}
                  >
                    {file.relativePath}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        {onBackToReview ? (
          <button
            type="button"
            onClick={onBackToReview}
            className="mt-5 text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Back to review
          </button>
        ) : null}
      </aside>
      {selected ? (
        <MarkdownPreview path={selected.relativePath} content={selected.content} />
      ) : (
        <p className="text-sm text-muted-foreground">No generated files.</p>
      )}
    </div>
  );
}
