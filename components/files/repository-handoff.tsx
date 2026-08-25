"use client";

import { Check, Clipboard, TerminalSquare } from "lucide-react";
import { useState } from "react";

const commands = [
  "unzip <project>-context.zip -d /path/to/repository",
  "git clone https://github.com/YordanYordanov90/ai-spec-blueprint.git /tmp/ai-spec-blueprint",
  "npm --prefix /tmp/ai-spec-blueprint install",
  "npm --prefix /tmp/ai-spec-blueprint run blueprint -- doctor --root /path/to/repository",
  "npm --prefix /tmp/ai-spec-blueprint run blueprint -- feature --next --root /path/to/repository",
] as const;

export function RepositoryHandoff({ downloaded }: { downloaded: boolean }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function copyCommands() {
    const commandText = commands.join("\n");
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(commandText);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopied(true);
      setCopyError(null);
      didCopy = true;
    } catch {
      let fallbackCopied = false;
      try {
        const textarea = document.createElement("textarea");
        textarea.value = commandText;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        try {
          fallbackCopied =
            typeof document.execCommand === "function" &&
            document.execCommand("copy");
        } finally {
          textarea.remove();
        }
      } catch {
        fallbackCopied = false;
      }

      setCopied(fallbackCopied);
      setCopyError(
        fallbackCopied
          ? null
          : "Copy is unavailable here. Select the commands below manually.",
      );
      didCopy = fallbackCopied;
    }

    if (didCopy) {
      window.setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <section className={`mt-5 border p-5 sm:p-6 ${downloaded ? "border-success/40 bg-success/6" : "border-border bg-surface"}`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="blueprint-kicker text-accent">Repository handoff</p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em]">
            {downloaded ? "Package downloaded. Put it to work." : "After download"}
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">
            Extract the reviewed package into the target repository, install the CLI from the public source repository, inspect context health, then prepare exactly one active feature.
          </p>
        </div>
        <button type="button" onClick={() => void copyCommands()} className="flex h-10 items-center gap-2 border border-border px-3 font-mono text-[9px] uppercase hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {copied ? <Check aria-hidden="true" className="size-3 text-success" /> : <Clipboard aria-hidden="true" className="size-3" />}
          {copied ? "Copied" : "Copy commands"}
        </button>
      </div>
      {copyError ? <p className="mt-3 text-xs leading-5 text-danger" role="status">{copyError}</p> : null}
      <ol className="mt-5 grid gap-px bg-border lg:grid-cols-2">
        {commands.map((command, index) => (
          <li key={command} className="min-w-0 bg-code-surface p-4">
            <span className="flex items-center gap-2 font-mono text-[9px] text-accent">
              <TerminalSquare aria-hidden="true" className="size-3" /> 0{index + 1}
            </span>
            <code className="mt-3 block overflow-x-auto text-[10px] leading-5 text-muted-foreground">{command}</code>
          </li>
        ))}
      </ol>
    </section>
  );
}
