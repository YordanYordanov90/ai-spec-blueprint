"use client";

import { useState } from "react";

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

  return (
    <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start lg:py-14">
      <section
        aria-labelledby="onboarding-discovery-heading"
        className="border border-border bg-background/80 p-6 shadow-[0_0_0_1px_oklch(1_0_0/0.03)] backdrop-blur-sm"
      >
        <p className="font-mono text-xs tracking-[0.18em] text-status uppercase">
          New project
        </p>
        <h1
          id="onboarding-discovery-heading"
          className="mt-3 font-heading text-3xl tracking-tight"
        >
          Start from the problem, not a chat transcript.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Grill Me asks one high-value question at a time. Completeness updates
          from recorded discovery facts, not a separate Web-only score.
        </p>
        <div className="mt-8">
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
        </div>
      </section>
      <CompletenessPanel entries={completeness} />
    </div>
  );
}
