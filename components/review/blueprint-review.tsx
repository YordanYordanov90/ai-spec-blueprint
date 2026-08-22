"use client";

import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DecisionStatus } from "@/components/product/decision-status";
import { GuardrailCard } from "@/components/guardrails/guardrail-card";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";
import { blueprintHasPendingProposal } from "@/src/lib/blueprint/discovery/approve-blueprint";

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

export function BlueprintReview({
  blueprint,
  onApprove,
  onPreviewFiles,
  pending = false,
}: {
  blueprint: ProjectBlueprint;
  onApprove: () => void;
  onPreviewFiles?: () => void;
  pending?: boolean;
}) {
  const pendingProposal = blueprintHasPendingProposal(blueprint);

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
          <Button
            type="button"
            size="lg"
            className="mt-5 h-11 w-fit rounded-none px-5"
            disabled={pending}
            onClick={onApprove}
          >
            {pending ? "Recording approval…" : "Approve blueprint"}
          </Button>
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
          {blueprint.stack.map((decision) => (
            <div key={`${decision.category}-${decision.choice}`}>
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
            </div>
          ))}
        </ReviewSection>

        <ReviewSection
          title="Architecture"
          status={pendingProposal ? "proposed" : "approved"}
        >
          {blueprint.architecture.map((decision) => (
            <div key={decision.title}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{decision.title}</p>
                <ReviewStatus status={decision.review.status} />
              </div>
              <p>{decision.decision}</p>
              <p className="text-muted-foreground">{decision.rationale}</p>
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
    </div>
  );
}
