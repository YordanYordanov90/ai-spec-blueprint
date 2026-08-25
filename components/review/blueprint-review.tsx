"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Code2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DecisionStatus } from "@/components/product/decision-status";
import { GuardrailCard } from "@/components/guardrails/guardrail-card";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";
import { ProjectBlueprintSchema } from "@/src/lib/blueprint/schemas/project-blueprint";
import { blueprintHasPendingProposal } from "@/src/lib/blueprint/discovery/approve-blueprint";
import {
  reviewBlueprintDecision,
  type ReviewDecisionAction,
  type ReviewDecisionTarget,
} from "@/src/lib/blueprint/lifecycle/review-blueprint";

function ReviewStatus({ status }: { status: string }) {
  const normalized = status.replaceAll("-", " ");

  if (
    status === "approved" ||
    status === "proposed" ||
    status === "unresolved" ||
    status === "rejected"
  ) {
    return <DecisionStatus status={status} />;
  }

  return (
    <span className="inline-flex h-6 shrink-0 items-center border border-border bg-code-surface px-2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
      {normalized}
    </span>
  );
}

function ReviewSection({
  title,
  children,
  status,
}: {
  title: string;
  children: ReactNode;
  status?: "fact" | "proposed" | "approved" | "unresolved";
}) {
  return (
    <section className="border-t border-border pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        <h3 className="blueprint-kicker text-muted-foreground">{title}</h3>
        {status ? <DecisionStatus status={status} /> : null}
      </div>
      <div className="flex flex-col gap-4 pt-4 text-sm leading-6">
        {children}
      </div>
    </section>
  );
}

function TextList({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function DecisionActions({
  target,
  index,
  onReview,
}: {
  target: ReviewDecisionTarget;
  index: number;
  onReview: (target: ReviewDecisionTarget, index: number, action: ReviewDecisionAction) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={() => onReview(target, index, "approve")} className="flex min-h-9 items-center gap-2 border border-success/35 bg-success/8 px-3 font-mono text-[8px] text-success uppercase hover:bg-success/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Check aria-hidden="true" className="size-3" /> Approve decision
      </button>
      <button type="button" onClick={() => onReview(target, index, "reject")} className="flex min-h-9 items-center gap-2 border border-danger/35 bg-danger/8 px-3 font-mono text-[8px] text-danger uppercase hover:bg-danger/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <X aria-hidden="true" className="size-3" /> Reject
      </button>
    </div>
  );
}

function StructuredBlueprintEditor({
  blueprint,
  onChange,
}: {
  blueprint: ProjectBlueprint;
  onChange: (blueprint: ProjectBlueprint) => void;
}) {
  const [document, setDocument] = useState(() => JSON.stringify(blueprint, null, 2));
  const [error, setError] = useState<string | null>(null);

  function applyChanges() {
    try {
      const parsed = ProjectBlueprintSchema.parse(JSON.parse(document));
      onChange(parsed);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The edited blueprint is invalid.");
    }
  }

  return (
    <details className="border border-border bg-code-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <span className="flex items-center gap-2 text-xs font-medium">
          <Code2 aria-hidden="true" className="size-4 text-accent" />
          Edit structured blueprint
        </span>
        <span className="font-mono text-[8px] text-muted-foreground uppercase">Advanced · schema validated</span>
      </summary>
      <div className="border-t border-border p-4">
        <p className="mb-3 text-xs leading-5 text-muted-foreground">
          Edit any section without asking the model again. Changes are accepted only when the complete ProjectBlueprint remains valid.
        </p>
        <textarea aria-label="ProjectBlueprint JSON" value={document} onChange={(event) => setDocument(event.target.value)} spellCheck={false} className="min-h-96 w-full resize-y border border-border bg-background p-4 font-mono text-[11px] leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        {error ? <p className="mt-3 text-xs leading-5 text-danger" role="alert">{error}</p> : null}
        <Button type="button" className="mt-3 h-10 rounded-none" onClick={applyChanges}>Apply validated changes</Button>
      </div>
    </details>
  );
}

export function BlueprintReview({
  blueprint,
  onApprove,
  onPreviewFiles,
  onChange,
  onReturnToDiscovery,
  pending = false,
}: {
  blueprint: ProjectBlueprint;
  onApprove: () => void;
  onPreviewFiles?: () => void;
  onChange?: (blueprint: ProjectBlueprint) => void;
  onReturnToDiscovery?: () => void;
  pending?: boolean;
}) {
  const pendingProposal = blueprintHasPendingProposal(blueprint);

  function handleDecisionReview(
    target: ReviewDecisionTarget,
    index: number,
    action: ReviewDecisionAction,
  ) {
    onChange?.(reviewBlueprintDecision(blueprint, target, index, action));
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`relative overflow-hidden border p-5 sm:p-6 ${
          pendingProposal
            ? "border-warning/40 bg-warning/6"
            : "border-success/40 bg-success/6"
        }`}
      >
        <div
          aria-hidden="true"
          className={`absolute bottom-0 left-0 top-0 w-px ${pendingProposal ? "bg-warning" : "bg-success"}`}
        />
        <DecisionStatus
          status={pendingProposal ? "proposed" : "approved"}
          label={pendingProposal ? "Proposed" : "Approved"}
        />
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
          {blueprint.product.name}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {pendingProposal
            ? "Inspect the structured proposal before it becomes approved project context."
            : "The human approved this proposal. Generated files can now be previewed."}
        </p>
        {pendingProposal ? (
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" size="lg" className="h-11 w-fit rounded-none px-5" disabled={pending} onClick={onApprove}>
              {pending ? "Recording approval…" : "Approve blueprint · remaining proposals"}
            </Button>
            {onReturnToDiscovery ? (
              <Button type="button" variant="outline" size="lg" className="h-11 w-fit rounded-none px-5" onClick={onReturnToDiscovery}>
                <ArrowLeft aria-hidden="true" /> Return to discovery
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <p className="flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] text-success uppercase">
              <Check aria-hidden="true" className="size-3" />
              Approved by human
            </p>
            {onPreviewFiles ? (
              <Button
                type="button"
                size="lg"
                className="h-11 w-fit rounded-none px-5"
                onClick={onPreviewFiles}
              >
                Preview generated files
                <ArrowRight aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        )}
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <ReviewSection title="Product" status="fact">
          <p>{blueprint.product.summary}</p>
          <p>{blueprint.product.problem}</p>
          <TextList items={blueprint.product.successCriteria} />
        </ReviewSection>

        <ReviewSection title="Users" status="fact">
          {blueprint.users.map((user) => (
            <div key={user.name}>
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground">{user.description}</p>
              <TextList items={user.needs} />
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title="Goals" status="fact">
          <TextList items={blueprint.goals} />
        </ReviewSection>

        <ReviewSection title="Non-goals" status="fact">
          <TextList items={blueprint.nonGoals} />
        </ReviewSection>

        <ReviewSection
          title="Stack"
          status={pendingProposal ? "proposed" : "approved"}
        >
          {blueprint.stack.map((decision, index) => (
            <div key={`${decision.category}-${decision.choice}`} className="border-b border-border/70 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">
                  {decision.category}: {decision.choice}
                </p>
                <ReviewStatus status={decision.review.status} />
              </div>
              <p className="text-muted-foreground">{decision.rationale}</p>
              <p className="font-mono text-[11px] uppercase">
                Decision {decision.status.replaceAll("-", " ")}
              </p>
              {decision.review.status === "proposed" && onChange ? (
                <DecisionActions target="stack" index={index} onReview={handleDecisionReview} />
              ) : null}
            </div>
          ))}
        </ReviewSection>

        <ReviewSection
          title="Architecture"
          status={pendingProposal ? "proposed" : "approved"}
        >
          {blueprint.architecture.map((decision, index) => (
            <div key={decision.title} className="border-b border-border/70 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{decision.title}</p>
                <ReviewStatus status={decision.review.status} />
              </div>
              <p>{decision.decision}</p>
              <p className="text-muted-foreground">{decision.rationale}</p>
              {decision.review.status === "proposed" && onChange ? (
                <DecisionActions target="architecture" index={index} onReview={handleDecisionReview} />
              ) : null}
            </div>
          ))}
        </ReviewSection>

        <ReviewSection
          title="Domain"
          status={pendingProposal ? "proposed" : "approved"}
        >
          {blueprint.domain.map((concept) => (
            <div key={concept.name}>
              <p className="font-medium">{concept.name}</p>
              <p className="text-muted-foreground">{concept.purpose}</p>
            </div>
          ))}
        </ReviewSection>

        <ReviewSection
          title="UI"
          status={pendingProposal ? "proposed" : "approved"}
        >
          <p>{blueprint.ui.personality}</p>
          <p className="text-muted-foreground">{blueprint.ui.visualDirection}</p>
        </ReviewSection>

        <ReviewSection
          title="Security"
          status={pendingProposal ? "proposed" : "approved"}
        >
          <TextList items={blueprint.security.constraints} />
        </ReviewSection>

        {blueprint.ai ? (
          <ReviewSection
            title="AI"
            status={pendingProposal ? "proposed" : "approved"}
          >
            <p>{blueprint.ai.purpose}</p>
            <TextList items={blueprint.ai.allowedResponsibilities} />
          </ReviewSection>
        ) : (
          <ReviewSection title="AI" status="fact">
            <p>No AI usage was recorded for this project.</p>
          </ReviewSection>
        )}

        <div className="xl:col-span-2">
          <section aria-labelledby="blueprint-guardrails-heading">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3
                id="blueprint-guardrails-heading"
                className="blueprint-kicker text-muted-foreground"
              >
                Guardrails
              </h3>
              <DecisionStatus status={pendingProposal ? "proposed" : "approved"} />
            </div>
            <div className="grid gap-3 xl:grid-cols-2">
              {blueprint.guardrails.map((guardrail) => (
                <GuardrailCard key={guardrail.id} guardrail={guardrail} />
              ))}
            </div>
          </section>
        </div>

        <ReviewSection
          title="Features"
          status={pendingProposal ? "proposed" : "approved"}
        >
          {blueprint.features.map((feature) => (
            <div key={feature.id}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">
                  {feature.id} {feature.title}
                </p>
                <ReviewStatus status={feature.status} />
              </div>
              <p className="text-muted-foreground">{feature.scopeSummary}</p>
            </div>
          ))}
        </ReviewSection>

        <ReviewSection
          title="Unresolved decisions"
          status={
            blueprint.unresolvedDecisions.length === 0 ? "approved" : "unresolved"
          }
        >
          {blueprint.unresolvedDecisions.length === 0 ? (
            <p>No unresolved decisions were recorded.</p>
          ) : (
            blueprint.unresolvedDecisions.map((decision) => (
              <div key={decision.question}>
                <p className="font-medium">{decision.question}</p>
                <p className="text-muted-foreground">{decision.whyItMatters}</p>
                <ReviewStatus
                  status={decision.blocking ? "blocking" : "non-blocking"}
                />
              </div>
            ))
          )}
        </ReviewSection>
      </div>
      {onChange ? (
        <StructuredBlueprintEditor
          key={JSON.stringify(blueprint)}
          blueprint={blueprint}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
}
