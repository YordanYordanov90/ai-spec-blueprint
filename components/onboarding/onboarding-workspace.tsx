"use client";

import { useState } from "react";
import { Braces, FileText, MessageSquareText, ShieldCheck } from "lucide-react";

import { CompletenessPanel } from "@/components/completeness/completeness-panel";
import { GeneratedFileExplorer } from "@/components/files/generated-file-explorer";
import { GrillMeInterface } from "@/components/grill-me/grill-me-interface";
import { BlueprintReview } from "@/components/review/blueprint-review";
import { proposeProjectBlueprintResult } from "@/src/lib/ai/ai-failure";
import {
  approveBlueprintProposal,
  blueprintHasPendingProposal,
} from "@/src/lib/blueprint/discovery/approve-blueprint";
import { generateApprovedContextPackage } from "@/src/lib/blueprint/generators/approved-package";
import type {
  CompletenessEntry,
  DiscoveryState,
} from "@/src/lib/blueprint/schemas/discovery";
import type { GeneratedArtifact } from "@/src/lib/blueprint/schemas/generated-artifact";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";
import type { AiFailure } from "@/src/lib/ai/ai-failure";
import { AiFailureNotice } from "@/components/grill-me/ai-failure-notice";

const workspaceStages = [
  { label: "Discovery", icon: MessageSquareText },
  { label: "Blueprint", icon: Braces },
  { label: "Guardrails", icon: ShieldCheck },
  { label: "Artifacts", icon: FileText },
] as const;

export function OnboardingWorkspace() {
  const [completeness, setCompleteness] = useState<CompletenessEntry[]>([]);
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);
  const [artifacts, setArtifacts] = useState<readonly GeneratedArtifact[] | null>(
    null,
  );
  const [proposalFailure, setProposalFailure] = useState<AiFailure | null>(null);

  function handleStateChange(state: DiscoveryState | null) {
    setCompleteness(state?.completeness ?? []);
    if (!state?.readyForBlueprintProposal) {
      setBlueprint(null);
      setArtifacts(null);
    }
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
    setArtifacts(null);
  }

  function handleApproveBlueprint() {
    if (!blueprint) {
      return;
    }

    setBlueprint(approveBlueprintProposal(blueprint));
    setArtifacts(null);
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
              <span className={`size-1.5 ${blueprint ? "bg-warning" : "bg-success"}`} />
              {blueprint ? "review required" : "session local"}
            </span>
          </div>

          {blueprint ? (
            <BlueprintReview
              blueprint={blueprint}
              onApprove={handleApproveBlueprint}
              onPreviewFiles={handlePreviewFiles}
            />
          ) : (
            <GrillMeInterface
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
          <CompletenessPanel entries={completeness} />
          <aside className="border border-border bg-code-surface p-5">
            <p className="blueprint-kicker text-muted-foreground">Source of truth</p>
            <div className="mt-4 flex gap-3">
              <FileText aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
              <p className="text-xs leading-5 text-muted-foreground">
                Approved project knowledge becomes repository Markdown. This
                browser session is working state, not durable storage.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
