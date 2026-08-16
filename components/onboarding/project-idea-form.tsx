"use client";

import { useId, useState, type FormEvent } from "react";

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
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor={ideaId}>Initial project idea</Label>
        <p id={`${ideaId}-hint`} className="text-sm leading-6 text-muted-foreground">
          Describe the problem, who it is for, and what the first version must
          not take on yet.
        </p>
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
          placeholder="Example: A focused workspace for drafting release notes. V1 should stay unauthenticated and should not publish automatically."
          className="min-h-40 rounded-md bg-background/80"
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
        className="h-11 w-fit rounded-md px-5"
        disabled={pending}
      >
        {pending ? "Starting discovery…" : "Start Grill Me"}
      </Button>
    </form>
  );
}
