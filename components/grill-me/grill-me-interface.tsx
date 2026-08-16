"use client";

import { useId, useState, type FormEvent } from "react";

import { ProjectIdeaForm } from "@/components/onboarding/project-idea-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  answerGrillMeQuestion,
  startGrillMeDiscovery,
} from "@/app/new/actions";
import type { AiFailure } from "@/src/lib/ai/ai-failure";
import type { DiscoveryState } from "@/src/lib/blueprint/schemas/discovery";

import { AiFailureNotice } from "./ai-failure-notice";

export function GrillMeInterface({
  onStateChange,
  onProposeBlueprint,
}: {
  onStateChange?: (state: DiscoveryState | null) => void;
  onProposeBlueprint?: (state: DiscoveryState) => void;
}) {
  const answerId = useId();
  const [state, setDiscoveryState] = useState<DiscoveryState | null>(null);
  const [answer, setAnswer] = useState("");
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<AiFailure | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  function setState(next: DiscoveryState | null) {
    setDiscoveryState(next);
    onStateChange?.(next);
  }

  async function startDiscovery(idea: string) {
    setPending(true);
    setFailure(null);
    setStartError(null);

    const result = await startGrillMeDiscovery(idea);

    setPending(false);

    if (!result.ok) {
      setFailure(result.error);
      setStartError(result.error.message);
      return;
    }

    setState(result.value);
    setAnswer("");
  }

  async function submitAnswer(nextAnswer: string) {
    if (!state) {
      return;
    }

    setPending(true);
    setFailure(null);

    const result = await answerGrillMeQuestion(state, nextAnswer);

    setPending(false);

    if (!result.ok) {
      setFailure(result.error);
      return;
    }

    setState(result.value);
    setAnswer("");
  }

  async function handleAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextAnswer = answer.trim();

    if (nextAnswer.length === 0) {
      setFailure({
        kind: "user-input-failure",
        message: "Enter an answer before continuing.",
        details: [],
      });
      return;
    }

    await submitAnswer(nextAnswer);
  }

  if (!state) {
    return (
      <div className="flex flex-col gap-5">
        <ProjectIdeaForm
          onCapture={startDiscovery}
          pending={pending}
          error={startError}
        />
        {failure ? <AiFailureNotice failure={failure} /> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          Recorded idea
        </p>
        <p className="mt-3 text-sm leading-6 text-foreground/90 whitespace-pre-wrap">
          {state.initialIdea}
        </p>
      </section>

      <section aria-labelledby="extracted-facts-heading">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="extracted-facts-heading" className="font-heading text-lg tracking-tight">
            Extracted facts
          </h2>
          <p className="font-mono text-[11px] text-muted-foreground">
            {state.facts.length} recorded
          </p>
        </div>
        {state.facts.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            No facts have been extracted yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {state.facts.map((fact) => (
              <li
                key={fact.id}
                className="border border-border bg-background/70 px-3 py-3"
              >
                <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                  {fact.source} · {fact.topic}
                </p>
                <p className="mt-2 text-sm leading-6">{fact.statement}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {failure ? (
        <AiFailureNotice
          failure={failure}
          onRetry={
            state.currentQuestion && answer.trim().length > 0
              ? () => {
                  void submitAnswer(answer);
                }
              : undefined
          }
        />
      ) : null}

      {state.readyForBlueprintProposal ? (
        <section className="border border-border bg-card/60 p-5">
          <p className="font-mono text-[11px] tracking-[0.16em] text-status uppercase">
            Ready
          </p>
          <h2 className="mt-3 font-heading text-xl tracking-tight">
            Discovery has enough information for a blueprint proposal.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Review the structured proposal before any context files are
            generated.
          </p>
          {onProposeBlueprint ? (
            <Button
              type="button"
              size="lg"
              className="mt-5 h-11 w-fit rounded-md px-5"
              onClick={() => onProposeBlueprint(state)}
            >
              Review blueprint proposal
            </Button>
          ) : null}
        </section>
      ) : state.currentQuestion ? (
        <section className="border border-border bg-card/60 p-5">
          <p className="font-mono text-[11px] tracking-[0.16em] text-status uppercase">
            Focused question
          </p>
          <h2 className="mt-3 font-heading text-xl tracking-tight">
            {state.currentQuestion.prompt}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            <span className="font-medium text-foreground">Why this matters. </span>
            {state.currentQuestion.whyItMatters}
          </p>
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleAnswer}>
            <div className="flex flex-col gap-2">
              <Label htmlFor={answerId}>Your answer</Label>
              <Textarea
                id={answerId}
                name="grillMeAnswer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={pending}
                rows={5}
                className="min-h-28 rounded-md bg-background/80"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-11 w-fit rounded-md px-5"
              disabled={pending}
            >
              {pending ? "Recording answer…" : "Submit answer"}
            </Button>
          </form>
        </section>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">
          No further focused question is available yet.
        </p>
      )}
    </div>
  );
}
