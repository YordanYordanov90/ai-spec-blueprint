"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Braces, FileJson, FileText, MessageSquareText, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

import { CompletenessPanel } from "@/components/completeness/completeness-panel";
import { GeneratedFileExplorer } from "@/components/files/generated-file-explorer";
import { GrillMeInterface } from "@/components/grill-me/grill-me-interface";
import { BlueprintReview } from "@/components/review/blueprint-review";
import { BlueprintReadinessPanel } from "@/components/readiness/blueprint-readiness-panel";
import { proposeProjectBlueprintResult } from "@/src/lib/ai/ai-failure";
import {
  approveBlueprintProposal,
  blueprintHasPendingProposal,
} from "@/src/lib/blueprint/discovery/approve-blueprint";
import { generateApprovedContextPackage } from "@/src/lib/blueprint/generators/approved-package";
import { importBlueprintBytes } from "@/src/lib/blueprint/lifecycle/import-blueprint";
import { assessBlueprintReadiness } from "@/src/lib/blueprint/lifecycle/readiness";
import type {
  CompletenessEntry,
  DiscoveryState,
} from "@/src/lib/blueprint/schemas/discovery";
import type { GeneratedArtifact } from "@/src/lib/blueprint/schemas/generated-artifact";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";
import type { AiFailure } from "@/src/lib/ai/ai-failure";
import { AiFailureNotice } from "@/components/grill-me/ai-failure-notice";
import { ProjectBlueprintSchema } from "@/src/lib/blueprint/schemas/project-blueprint";
import { validProjectBlueprintExample } from "@/src/lib/blueprint/schemas/examples";
import {
  clearWorkspaceSnapshot,
  loadWorkspaceSnapshot,
  saveWorkspaceSnapshot,
  type WorkspaceSnapshot,
} from "./workspace-storage";

const workspaceStages = [
  { label: "Discovery", icon: MessageSquareText },
  { label: "Blueprint", icon: Braces },
  { label: "Guardrails", icon: ShieldCheck },
  { label: "Artifacts", icon: FileText },
] as const;

export function OnboardingWorkspace() {
  const [discovery, setDiscovery] = useState<DiscoveryState | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessEntry[]>([]);
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);
  const [baseline, setBaseline] = useState<ProjectBlueprint | null>(null);
  const [artifacts, setArtifacts] = useState<readonly GeneratedArtifact[] | null>(
    null,
  );
  const [proposalFailure, setProposalFailure] = useState<AiFailure | null>(null);
  const [recoverable, setRecoverable] = useState<WorkspaceSnapshot | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const snapshot = loadWorkspaceSnapshot(window.localStorage);
      setRecoverable(snapshot);
      setSavedAt(snapshot?.savedAt ?? null);
      setStorageReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!storageReady || (!discovery && !blueprint)) return;

    const timeout = window.setTimeout(() => {
      const nextSavedAt = new Date().toISOString();
      const saved = saveWorkspaceSnapshot(window.localStorage, {
        version: 1,
        savedAt: nextSavedAt,
        discovery,
        blueprint,
        baseline,
      });
      if (saved) {
        setSavedAt(nextSavedAt);
        setRecoverable(null);
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [baseline, blueprint, discovery, storageReady]);

  function handleStateChange(state: DiscoveryState | null) {
    setDiscovery(state);
    setCompleteness(state?.completeness ?? []);
    if (!state?.readyForBlueprintProposal) {
      setBlueprint(null);
      setArtifacts(null);
    }
  }

  function resumeWorkspace() {
    if (!recoverable) return;
    setDiscovery(recoverable.discovery);
    setCompleteness(recoverable.discovery?.completeness ?? []);
    setBlueprint(recoverable.blueprint);
    setBaseline(recoverable.baseline);
    setArtifacts(null);
    setSavedAt(recoverable.savedAt);
    setRecoverable(null);
    setSessionKey((key) => key + 1);
  }

  function startOver() {
    clearWorkspaceSnapshot(window.localStorage);
    setDiscovery(null);
    setCompleteness([]);
    setBlueprint(null);
    setBaseline(null);
    setArtifacts(null);
    setRecoverable(null);
    setSavedAt(null);
    setProposalFailure(null);
    setSessionKey((key) => key + 1);
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const imported = importBlueprintBytes(
        new Uint8Array(await file.arrayBuffer()),
        file.name,
      );
      setDiscovery(null);
      setCompleteness([]);
      setBlueprint(imported);
      setBaseline(imported);
      setArtifacts(null);
      setProposalFailure(null);
      setRecoverable(null);
      setSessionKey((key) => key + 1);
    } catch (error) {
      setProposalFailure({
        kind: "application-validation-failure",
        message: error instanceof Error ? error.message : "The blueprint could not be imported.",
        details: [],
      });
    }
  }

  function loadGuidedExample() {
    const example = approveBlueprintProposal(
      ProjectBlueprintSchema.parse(validProjectBlueprintExample),
    );
    setDiscovery(null);
    setCompleteness([]);
    setBlueprint(example);
    setBaseline(null);
    setArtifacts(null);
    setProposalFailure(null);
    setRecoverable(null);
    setSessionKey((key) => key + 1);
  }

  function handleProposeBlueprint(state: DiscoveryState) {
    const result = proposeProjectBlueprintResult(state);
    if (!result.ok) {
      setProposalFailure(result.error);
      setBlueprint(null);
      return;
    }

    setProposalFailure(null);
    setBlueprint(result.value);
    setBaseline(null);
    setArtifacts(null);
  }

  function handleApproveBlueprint() {
    if (!blueprint) {
      return;
    }

    setBlueprint(approveBlueprintProposal(blueprint));
    setArtifacts(null);
  }

  function handleBlueprintChange(next: ProjectBlueprint) {
    setBlueprint(next);
    setArtifacts(null);
    setProposalFailure(null);
  }

  function handlePreviewFiles() {
    if (!blueprint || blueprintHasPendingProposal(blueprint)) {
      setProposalFailure({
        kind: "application-validation-failure",
        message: "Cannot generate context files from an unapproved blueprint proposal.",
        details: [],
      });
      return;
    }

    if (assessBlueprintReadiness(blueprint).status === "blocking") {
      setProposalFailure({
        kind: "application-validation-failure",
        message: "Resolve blocking decisions before generating durable context files.",
        details: [],
      });
      return;
    }

    try {
      setArtifacts(generateApprovedContextPackage(blueprint));
      setProposalFailure(null);
    } catch (error) {
      setProposalFailure({
        kind: "application-validation-failure",
        message:
          error instanceof Error
            ? error.message
            : "Context files could not be generated.",
        details: [],
      });
    }
  }

  if (artifacts) {
    return (
      <GeneratedFileExplorer
        artifacts={artifacts}
        blueprint={blueprint ?? undefined}
        baseline={baseline}
        onBackToReview={() => setArtifacts(null)}
      />
    );
  }

  const activeStageIndex = blueprint
    ? blueprintHasPendingProposal(blueprint)
      ? 1
      : 2
    : 0;

  return (
    <main className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="mb-6 flex flex-col justify-between gap-5 border-b border-border pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-accent" />
            <p className="blueprint-kicker text-accent">Workspace 01 · New project</p>
          </div>
          <h1
            id="onboarding-discovery-heading"
            className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
          >
            Start from the problem, not a chat transcript.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Grill Me resolves the decisions with downstream impact. The project
            blueprint updates from recorded facts—not an invented score.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <div className="flex flex-wrap gap-2">
            <label className="flex min-h-10 cursor-pointer items-center gap-2 border border-border bg-background px-3 font-mono text-[9px] text-muted-foreground uppercase hover:bg-surface hover:text-foreground focus-within:ring-2 focus-within:ring-ring">
              <FileJson aria-hidden="true" className="size-3" /> Import blueprint
              <input type="file" accept=".json,.zip,application/json,application/zip" onChange={(event) => void handleImport(event)} className="sr-only" />
            </label>
            <button type="button" onClick={loadGuidedExample} className="flex min-h-10 items-center gap-2 border border-border bg-background px-3 font-mono text-[9px] text-muted-foreground uppercase hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Sparkles aria-hidden="true" className="size-3 text-accent" /> Guided example
            </button>
            {(discovery || blueprint || recoverable) ? (
              <button type="button" onClick={startOver} className="flex min-h-10 items-center gap-2 border border-border bg-background px-3 font-mono text-[9px] text-muted-foreground uppercase hover:border-danger/40 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <RotateCcw aria-hidden="true" className="size-3" /> Start over
              </button>
            ) : null}
          </div>
        <ol aria-label="Project definition stages" className="flex flex-wrap gap-1">
          {workspaceStages.map((stage, index) => {
            const isActive = index === activeStageIndex;
            const Icon = stage.icon;

            return (
              <li
                key={stage.label}
                aria-current={isActive ? "step" : undefined}
                className={`flex items-center gap-2 border border-border bg-background px-3 py-2 font-mono text-[9px] tracking-[0.08em] uppercase ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`}
              >
                <Icon aria-hidden="true" className="size-3" />
                {stage.label}
              </li>
            );
          })}
        </ol>
        </div>
      </div>

      {recoverable ? (
        <section className="mb-5 flex flex-col justify-between gap-4 border border-accent/40 bg-accent/7 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="blueprint-kicker text-accent">Local draft found</p>
            <p className="mt-2 text-sm">Resume work saved on {new Date(recoverable.savedAt).toLocaleString()}.</p>
            <p className="mt-1 text-xs text-muted-foreground">Stored only in this browser. No account or cloud database is involved.</p>
          </div>
          <button type="button" onClick={resumeWorkspace} className="h-10 border border-accent bg-accent/10 px-4 font-mono text-[9px] text-accent uppercase hover:bg-accent/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Resume project</button>
        </section>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.65fr)] lg:items-start">
        <section
          aria-labelledby="onboarding-discovery-heading"
          className="blueprint-panel min-w-0 p-5 sm:p-7"
        >
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="blueprint-kicker text-muted-foreground">
                {blueprint ? "Blueprint review" : "Grill Me / Discovery"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {blueprint
                  ? "Inspect proposals before they become durable context."
                  : "One focused decision at a time."}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-2 font-mono text-[9px] text-muted-foreground uppercase">
              <span className={`size-1.5 ${blueprint && blueprintHasPendingProposal(blueprint) ? "bg-warning" : "bg-success"}`} />
              {blueprint
                ? blueprintHasPendingProposal(blueprint)
                  ? "review required"
                  : "human approved"
                : "session local"}
              {savedAt ? ` · saved ${new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : null}
            </span>
          </div>

          {blueprint ? (
            <BlueprintReview
              blueprint={blueprint}
              onApprove={handleApproveBlueprint}
              onPreviewFiles={handlePreviewFiles}
              onChange={handleBlueprintChange}
              onReturnToDiscovery={discovery ? () => setBlueprint(null) : undefined}
            />
          ) : (
            <GrillMeInterface
              key={sessionKey}
              initialState={discovery}
              onStateChange={handleStateChange}
              onProposeBlueprint={handleProposeBlueprint}
            />
          )}
          {proposalFailure ? (
            <div className="mt-5">
              <AiFailureNotice failure={proposalFailure} />
            </div>
          ) : null}
        </section>

        <div className="space-y-5 lg:sticky lg:top-6">
          {blueprint ? (
            <BlueprintReadinessPanel blueprint={blueprint} />
          ) : (
            <CompletenessPanel entries={completeness} />
          )}
          <aside className="border-t border-border pt-4">
            <p className="blueprint-kicker text-muted-foreground">Source of truth</p>
            <div className="mt-4 flex gap-3">
              <FileText aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
              <p className="text-xs leading-5 text-muted-foreground">
                Working state is recovered from this browser. Approved project
                knowledge becomes repository Markdown and remains the durable source of truth.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
