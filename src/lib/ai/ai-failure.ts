import { z } from "zod";

import { proposeProjectBlueprint } from "../blueprint/discovery/propose-blueprint";
import type { DiscoveryState } from "../blueprint/schemas/discovery";
import type { ProjectBlueprint } from "../blueprint/schemas/project-blueprint";

const NonEmptyTextSchema = z.string().trim().min(1);

export const AiFailureKindSchema = z.enum([
  "provider-failure",
  "invalid-structured-output",
  "application-validation-failure",
  "user-input-failure",
]);

export const AiFailureSchema = z
  .object({
    kind: AiFailureKindSchema,
    message: NonEmptyTextSchema,
    details: z.array(NonEmptyTextSchema),
  })
  .strict();

export type AiFailure = z.infer<typeof AiFailureSchema>;
export type AiFailureKind = z.infer<typeof AiFailureKindSchema>;

export type AiResult<Value> =
  | { ok: true; value: Value }
  | { ok: false; error: AiFailure };

function redactSecrets(text: string): string {
  return text.replace(
    /(sk-|Bearer\s+|api[_-]?key[=:\s]+)[A-Za-z0-9._-]+/gi,
    "[redacted]",
  );
}

function zodDetails(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return redactSecrets(`${path}: ${issue.message}`);
  });
}

export function createAiFailure(
  kind: AiFailureKind,
  message: string,
  details: readonly string[] = [],
): AiFailure {
  return AiFailureSchema.parse({
    kind,
    message: redactSecrets(message),
    details: details.map(redactSecrets),
  });
}

export function classifyAiError(
  error: unknown,
  fallbackKind: AiFailureKind = "provider-failure",
): AiFailure {
  if (error instanceof z.ZodError) {
    const firstPath = error.issues[0]?.path[0];
    const kind =
      firstPath === "initialIdea" ||
      firstPath === "additionalUserInput" ||
      firstPath === "existingState"
        ? "user-input-failure"
        : fallbackKind === "application-validation-failure"
          ? "application-validation-failure"
          : "invalid-structured-output";

    return createAiFailure(
      kind,
      "Validation failed.",
      zodDetails(error),
    );
  }

  if (error instanceof Error) {
    if (error.message.startsWith("Duplicate extracted fact id:")) {
      return createAiFailure(
        "invalid-structured-output",
        error.message,
      );
    }

    if (error.message === "Model did not return structured output.") {
      return createAiFailure("invalid-structured-output", error.message);
    }

    if (error.message.startsWith("Discovery is not ready")) {
      return createAiFailure(
        "application-validation-failure",
        error.message,
      );
    }

    if (error.message.startsWith("Discovery is missing required facts")) {
      return createAiFailure(
        "application-validation-failure",
        error.message,
      );
    }

    return createAiFailure(fallbackKind, error.message);
  }

  return createAiFailure(fallbackKind, "An unknown AI failure occurred.");
}

export async function runAiOperation<Value>(
  operation: () => Promise<Value>,
  fallbackKind: AiFailureKind = "provider-failure",
): Promise<AiResult<Value>> {
  try {
    return { ok: true, value: await operation() };
  } catch (error) {
    return { ok: false, error: classifyAiError(error, fallbackKind) };
  }
}

export function runSyncOperation<Value>(
  operation: () => Value,
  fallbackKind: AiFailureKind = "application-validation-failure",
): AiResult<Value> {
  try {
    return { ok: true, value: operation() };
  } catch (error) {
    return { ok: false, error: classifyAiError(error, fallbackKind) };
  }
}

export function proposeProjectBlueprintResult(
  state: DiscoveryState,
): AiResult<ProjectBlueprint> {
  return runSyncOperation(
    () => proposeProjectBlueprint(state),
    "application-validation-failure",
  );
}
