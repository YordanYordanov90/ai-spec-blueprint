"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { ProjectBlueprint } from "@/src/lib/blueprint/schemas/project-blueprint";
import { blueprintHasPendingProposal } from "@/src/lib/blueprint/discovery/approve-blueprint";

function ReviewStatus({ status }: { status: string }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
      {status.replaceAll("-", " ")}
    </span>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-border bg-background/70 p-4">
      <h3 className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-6">{children}</div>
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
      <div className="border border-border bg-card/60 p-5">
        <p className="font-mono text-[11px] tracking-[0.16em] text-status uppercase">
          {pendingProposal ? "Proposed" : "Approved"}
        </p>
        <h2 className="mt-3 font-heading text-xl tracking-tight">
          {blueprint.product.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {pendingProposal
            ? "Inspect the structured proposal before it becomes approved project context."
            : "The human approved this proposal. Generated files can now be previewed."}
        </p>
        {pendingProposal ? (
          <Button
            type="button"
            size="lg"
            className="mt-5 h-11 w-fit rounded-md px-5"
            disabled={pending}
            onClick={onApprove}
          >
            {pending ? "Recording approval…" : "Approve blueprint"}
          </Button>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            <p className="font-mono text-[11px] tracking-[0.12em] text-status uppercase">
              Approved by human
            </p>
            {onPreviewFiles ? (
              <Button
                type="button"
                size="lg"
                className="h-11 w-fit rounded-md px-5"
                onClick={onPreviewFiles}
              >
                Preview generated files
              </Button>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <ReviewSection title="Product">
          <p>{blueprint.product.summary}</p>
          <p>{blueprint.product.problem}</p>
          <TextList items={blueprint.product.successCriteria} />
        </ReviewSection>

        <ReviewSection title="Users">
          {blueprint.users.map((user) => (
            <div key={user.name}>
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground">{user.description}</p>
              <TextList items={user.needs} />
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title="Goals">
          <TextList items={blueprint.goals} />
        </ReviewSection>

        <ReviewSection title="Non-goals">
          <TextList items={blueprint.nonGoals} />
        </ReviewSection>

        <ReviewSection title="Stack">
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

        <ReviewSection title="Architecture">
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

        <ReviewSection title="Domain">
          {blueprint.domain.map((concept) => (
            <div key={concept.name}>
              <p className="font-medium">{concept.name}</p>
              <p className="text-muted-foreground">{concept.purpose}</p>
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title="UI">
          <p>{blueprint.ui.personality}</p>
          <p className="text-muted-foreground">{blueprint.ui.visualDirection}</p>
        </ReviewSection>

        <ReviewSection title="Security">
          <TextList items={blueprint.security.constraints} />
        </ReviewSection>

        {blueprint.ai ? (
          <ReviewSection title="AI">
            <p>{blueprint.ai.purpose}</p>
            <TextList items={blueprint.ai.allowedResponsibilities} />
          </ReviewSection>
        ) : (
          <ReviewSection title="AI">
            <p>No AI usage was recorded for this project.</p>
          </ReviewSection>
        )}

        <ReviewSection title="Guardrails">
          {blueprint.guardrails.map((guardrail) => (
            <div key={guardrail.id}>
              <p className="font-medium">{guardrail.title}</p>
              <p className="text-muted-foreground">{guardrail.rule}</p>
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title="Features">
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

        <ReviewSection title="Unresolved decisions">
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
