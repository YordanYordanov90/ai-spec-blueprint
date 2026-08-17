"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, FileInput } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProjectIdeaFormProps = {
  onCapture: (idea: string) => void | Promise<void>;
  pending?: boolean;
  error?: string | null;
};

export function ProjectIdeaForm({
  onCapture,
  pending = false,
  error = null,
}: ProjectIdeaFormProps) {
  const ideaId = useId();
  const [draft, setDraft] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const displayedError = localError ?? error;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const idea = draft.trim();

    if (idea.length === 0) {
      setLocalError("Enter a project idea before continuing.");
      return;
    }

    setLocalError(null);
    await onCapture(idea);
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex items-start gap-4 border-b border-border pb-5">
        <span className="grid size-9 shrink-0 place-items-center border border-accent/40 bg-accent/8 text-accent">
          <FileInput aria-hidden="true" className="size-4" />
        </span>
        <div>
          <Label htmlFor={ideaId} className="text-sm font-semibold">
            Initial project idea
          </Label>
          <p
            id={`${ideaId}-hint`}
            className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground"
          >
            Describe the problem, who it is for, and what the first version must
            not take on yet. Rough language is fine; the structure comes next.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          id={ideaId}
          name="initialIdea"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (localError) {
              setLocalError(null);
            }
          }}
          required
          minLength={1}
          rows={8}
          disabled={pending}
          aria-describedby={
            displayedError ? `${ideaId}-hint ${ideaId}-error` : `${ideaId}-hint`
          }
          aria-invalid={displayedError ? true : undefined}
          placeholder="A focused workspace for drafting release notes. It is for product engineers. V1 should stay unauthenticated and should not publish automatically."
          className="min-h-52 resize-y rounded-none border-border bg-code-surface px-4 py-4 font-mono text-xs leading-6 placeholder:text-muted-foreground/60"
        />
        {displayedError ? (
          <p id={`${ideaId}-error`} className="text-sm text-destructive" role="alert">
            {displayedError}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-11 w-fit rounded-none px-5"
        disabled={pending}
      >
        {pending ? "Starting discovery…" : "Start Grill Me"}
        {!pending ? <ArrowRight aria-hidden="true" /> : null}
      </Button>
    </form>
  );
}
