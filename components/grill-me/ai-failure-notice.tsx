import type { AiFailure } from "@/src/lib/ai/ai-failure";

const failureKindLabels: Record<AiFailure["kind"], string> = {
  "provider-failure": "Provider failure",
  "invalid-structured-output": "Invalid structured output",
  "application-validation-failure": "Application validation failure",
  "user-input-failure": "User input failure",
  "rate-limit": "Rate limit reached",
  "abuse-protection-failure": "AI protection unavailable",
};

export function AiFailureNotice({
  failure,
  onRetry,
}: {
  failure: AiFailure;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="border border-destructive/40 bg-destructive/10 p-4"
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-destructive uppercase">
        {failureKindLabels[failure.kind]}
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground">{failure.message}</p>
      {failure.retryAfterSeconds ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Retry after {failure.retryAfterSeconds} seconds.
        </p>
      ) : null}
      {failure.details.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm leading-6 text-muted-foreground">
          {failure.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Retry this step
        </button>
      ) : null}
    </div>
  );
}
