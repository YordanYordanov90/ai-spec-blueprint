"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Check, History, MessageSquareText, Quote, RotateCcw } from "lucide-react";

import { ProjectIdeaForm } from "@/components/onboarding/project-idea-form";
import { DecisionStatus } from "@/components/product/decision-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  answerGrillMeQuestion,
  startGrillMeDiscovery,
} from "@/app/new/actions";
import { classifyAiError, type AiFailure } from "@/src/lib/ai/ai-failure";
import type { DiscoveryState } from "@/src/lib/blueprint/schemas/discovery";

import { AiFailureNotice } from "./ai-failure-notice";

export function GrillMeInterface({
  initialState = null,
  onStateChange,
  onProposeBlueprint,
}: {
  initialState?: DiscoveryState | null;
  onStateChange?: (state: DiscoveryState | null) => void;
  onProposeBlueprint?: (state: DiscoveryState) => void;
}) {
  const answerId = useId();
  const [state, setDiscoveryState] = useState<DiscoveryState | null>(initialState);
  const [history, setHistory] = useState<DiscoveryState[]>([]);
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

    try {
      const result = await startGrillMeDiscovery(idea);

      if (!result.ok) {
        setFailure(result.error);
        setStartError(result.error.message);
        return;
      }

      setState(result.value);
      setHistory([]);
      setAnswer("");
    } catch (error) {
      const failure = classifyAiError(error);
      setFailure(failure);
      setStartError(failure.message);
    } finally {
      setPending(false);
    }
  }

  async function submitAnswer(nextAnswer: string) {
    if (!state) {
      return;
    }

    setPending(true);
    setFailure(null);

    try {
      const result = await answerGrillMeQuestion(state, nextAnswer);

      if (!result.ok) {
        setFailure(result.error);
        return;
      }

      setHistory((entries) => [...entries, state]);
      setState(result.value);
      setAnswer("");
    } catch (error) {
      setFailure(classifyAiError(error));
    } finally {
      setPending(false);
    }
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

  function undoLastAnswer() {
    const previous = history.at(-1);
    if (!previous || pending) return;
    setHistory((entries) => entries.slice(0, -1));
    setState(previous);
    setAnswer("");
    setFailure(null);
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
    <div className="flex flex-col gap-7">
      <section className="border border-border bg-code-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="blueprint-kicker text-muted-foreground">Recorded idea</p>
          <DecisionStatus status="fact" />
        </div>
        <div className="flex gap-4 p-4 sm:p-5">
          <Quote aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
          <p className="text-sm leading-6 text-foreground/90 whitespace-pre-wrap">
            {state.initialIdea}
          </p>
        </div>
      </section>

      <section aria-labelledby="extracted-facts-heading">
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="extracted-facts-heading"
            className="text-lg font-semibold tracking-[-0.03em]"
          >
            Extracted facts
          </h2>
          <p className="font-mono text-[9px] tracking-[0.08em] text-muted-foreground uppercase">
            {state.facts.length} recorded facts
          </p>
        </div>
        {state.facts.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            No facts have been extracted yet.
          </p>
        ) : (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {state.facts.map((fact) => (
              <li
                key={fact.id}
                className="border border-border bg-surface-elevated px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase">
                    {fact.topic}
                  </p>
                  <span className="flex items-center gap-1 font-mono text-[8px] text-success uppercase">
                    <Check aria-hidden="true" className="size-3" />
                    {fact.source}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6">{fact.statement}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {state.messages.some((message) => message.role === "user") ? (
        <details className="border border-border bg-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
            <span className="flex items-center gap-2 text-xs font-medium">
              <History aria-hidden="true" className="size-3 text-accent" />
              Answer history
            </span>
            <span className="font-mono text-[9px] text-muted-foreground uppercase">
              {state.messages.filter((message) => message.role === "user").length} entries
            </span>
          </summary>
          <ol className="max-h-64 divide-y divide-border overflow-auto border-t border-border">
            {state.messages
              .filter((message) => message.role === "user")
              .map((message, index) => (
                <li key={`${index}-${message.content.slice(0, 16)}`} className="grid grid-cols-[2rem_1fr] gap-3 px-4 py-3 text-xs leading-5">
                  <span className="font-mono text-[9px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span>{message.content}</span>
                </li>
              ))}
          </ol>
          {history.length > 0 ? (
            <div className="border-t border-border p-3">
              <button type="button" onClick={undoLastAnswer} disabled={pending} className="flex min-h-10 items-center gap-2 border border-border px-3 font-mono text-[9px] uppercase hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <RotateCcw aria-hidden="true" className="size-3" />
                Undo last answer
              </button>
            </div>
          ) : null}
        </details>
      ) : null}

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
        <section className="border border-success/35 bg-success/8 p-5 sm:p-6">
          <DecisionStatus status="approved" label="Discovery complete" />
          <h2 className="mt-4 text-xl font-semibold tracking-[-0.035em]">
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
              className="mt-5 h-11 w-fit rounded-none px-5"
              onClick={() => onProposeBlueprint(state)}
            >
              Review blueprint proposal
              <ArrowRight aria-hidden="true" />
            </Button>
          ) : null}
        </section>
      ) : state.currentQuestion ? (
        <section className="relative overflow-hidden border border-accent/35 bg-surface-elevated">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-accent" />
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <p className="blueprint-kicker text-accent">Focused question</p>
            <span className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground uppercase">
              <MessageSquareText aria-hidden="true" className="size-3" />
              {state.currentQuestion.topic.replaceAll("-", " ")} · {state.gaps.filter((gap) => gap.blocking).length} blocking
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <h2 className="max-w-2xl text-xl font-semibold leading-8 tracking-[-0.035em] sm:text-2xl">
              {state.currentQuestion.prompt}
            </h2>
            <div className="mt-5 border-l border-warning/50 bg-warning/6 px-4 py-3">
              <p className="blueprint-kicker text-warning">Why this matters</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {state.currentQuestion.whyItMatters}
              </p>
            </div>
          <form className="mt-6 flex flex-col gap-4" onSubmit={handleAnswer}>
            <div className="flex flex-col gap-2">
              <Label htmlFor={answerId} className="text-xs">
                Your answer
              </Label>
              <Textarea
                id={answerId}
                name="grillMeAnswer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={pending}
                rows={5}
                className="min-h-32 rounded-none border-border bg-code-surface px-4 py-3 font-mono text-xs leading-6"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                size="lg"
                className="h-11 w-fit rounded-none px-5"
                disabled={pending}
              >
                {pending ? "Recording answer…" : "Submit answer"}
                {!pending ? <ArrowRight aria-hidden="true" /> : null}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 w-fit rounded-none px-5"
                disabled={pending}
                onClick={() => void submitAnswer("I do not know yet. Record this as unresolved and non-blocking if the project can safely proceed without it.")}
              >
                Decide later
              </Button>
            </div>
          </form>
          </div>
        </section>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">
          No further focused question is available yet.
        </p>
      )}
    </div>
  );
}
