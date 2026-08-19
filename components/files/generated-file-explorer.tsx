"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Download, FileText, Folder, GitBranch } from "lucide-react";

import type { GeneratedArtifact } from "@/src/lib/blueprint/schemas/generated-artifact";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";

import { downloadContextExport } from "./download-context-export";
import { MarkdownPreview } from "./markdown-preview";

export function GeneratedFileExplorer({
  artifacts,
  blueprint,
  onBackToReview,
}: {
  artifacts: readonly GeneratedArtifact[];
  blueprint?: ProjectBlueprint;
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
  const [isDownloadPending, setIsDownloadPending] = useState(false);
  const selected =
    files.find((file) => file.relativePath === selectedPath) ?? files[0];

  function handleDownload() {
    if (!blueprint || isDownloadPending) {
      return;
    }

    setIsDownloadPending(true);

    try {
      downloadContextExport(blueprint);
      window.setTimeout(() => setIsDownloadPending(false), 1100);
    } catch (error) {
      setIsDownloadPending(false);
      throw error;
    }
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="mb-6 flex flex-col justify-between gap-5 border-b border-border pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-accent" />
            <p className="blueprint-kicker text-accent">Generated artifacts</p>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            Context package preview
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Deterministic renderers produced these files from the approved
            blueprint. Export downloads a ZIP of the package plus blueprint.json.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onBackToReview ? (
            <button
              type="button"
              onClick={onBackToReview}
              className="flex h-10 w-fit items-center gap-2 border border-border px-3 font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft aria-hidden="true" className="size-3" />
              Back to review
            </button>
          ) : null}
          {blueprint ? (
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloadPending}
              aria-busy={isDownloadPending}
              className="flex h-10 w-fit items-center gap-2 border border-accent bg-accent/10 px-3 font-mono text-[9px] tracking-[0.08em] text-accent uppercase transition-colors hover:bg-accent/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download aria-hidden="true" className="size-3" />
              {isDownloadPending ? "Preparing package..." : "Download package"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid min-w-0 border border-border bg-border lg:grid-cols-[minmax(15rem,0.62fr)_minmax(0,1.38fr)]">
        <aside className="min-w-0 bg-code-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="blueprint-kicker text-muted-foreground">Generated files</p>
            <span className="font-mono text-[9px] text-muted-foreground">
              {files.length}
            </span>
          </div>
          <div className="border-b border-border px-4 py-3">
            <p className="flex items-center gap-2 font-mono text-[10px] text-foreground">
              <GitBranch aria-hidden="true" className="size-3 text-accent" />
              Blueprint
            </p>
          </div>
          <nav aria-label="Generated files" className="max-h-72 overflow-auto py-2 lg:max-h-[42rem]">
            <div className="flex items-center gap-2 px-4 py-2 font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase">
              <Folder aria-hidden="true" className="size-3" />
              artifact tree
            </div>
            <ul>
            {files.map((file) => {
              const isSelected = file.relativePath === selected?.relativePath;
              const depth = file.relativePath.split("/").length - 1;

              return (
                <li key={file.relativePath}>
                  <button
                    type="button"
                    onClick={() => setSelectedPath(file.relativePath)}
                    aria-current={isSelected ? "page" : undefined}
                    className={`flex min-h-10 w-full items-center gap-2 border-l px-4 py-2 text-left font-mono text-[10px] leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                      isSelected
                        ? "border-accent bg-accent/8 text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                    }`}
                    style={{ paddingLeft: `${1 + depth * 0.75}rem` }}
                  >
                    <FileText
                      aria-hidden="true"
                      className={`size-3 shrink-0 ${isSelected ? "text-accent" : "text-muted-foreground"}`}
                    />
                    <span className="min-w-0 truncate">{file.relativePath}</span>
                  </button>
                </li>
              );
            })}
            </ul>
        </nav>
          <div className="border-t border-border px-4 py-3 font-mono text-[9px] leading-4 text-muted-foreground">
            Preview the package, then export a ZIP to place in a repository.
          </div>
      </aside>
      {selected ? (
        <MarkdownPreview path={selected.relativePath} content={selected.content} />
      ) : (
        <p className="text-sm text-muted-foreground">No generated files.</p>
      )}
      </div>
    </main>
  );
}
