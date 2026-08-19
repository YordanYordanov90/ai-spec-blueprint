import { checkRateLimit } from "@vercel/firewall";

import { z } from "zod";

export const AI_RATE_LIMIT_ID = "ai-grill-me";
// Keep this aligned with the configured Vercel Firewall window for this ID.
export const AI_RATE_LIMIT_RETRY_AFTER_SECONDS = 60;

export const AiRateLimitDecisionSchema = z
  .object({
    allowed: z.boolean(),
    reason: z.enum(["allowed", "rate-limited", "unavailable"]),
    retryAfterSeconds: z.number().int().positive().nullable(),
  })
  .strict();

export type AiRateLimitDecision = z.infer<typeof AiRateLimitDecisionSchema>;

type FirewallRateLimitResult = {
  rateLimited: boolean;
  error?: "not-found" | "blocked";
};

type FirewallRateLimitCheck = (
  rateLimitId: string,
  options: { headers: Headers },
) => Promise<FirewallRateLimitResult>;

type AiRateLimitEnvironment = "development" | "production";

function allowedDecision(): AiRateLimitDecision {
  return AiRateLimitDecisionSchema.parse({
    allowed: true,
    reason: "allowed",
    retryAfterSeconds: null,
  });
}

function rateLimitedDecision(): AiRateLimitDecision {
  return AiRateLimitDecisionSchema.parse({
    allowed: false,
    reason: "rate-limited",
    retryAfterSeconds: AI_RATE_LIMIT_RETRY_AFTER_SECONDS,
  });
}

function unavailableDecision(): AiRateLimitDecision {
  return AiRateLimitDecisionSchema.parse({
    allowed: false,
    reason: "unavailable",
    retryAfterSeconds: null,
  });
}

export function createAiRateLimitGuard(
  firewallCheck: FirewallRateLimitCheck = checkRateLimit,
  environment: AiRateLimitEnvironment =
    process.env.NODE_ENV === "production" ? "production" : "development",
): (requestHeaders: Headers) => Promise<AiRateLimitDecision> {
  return async (requestHeaders: Headers): Promise<AiRateLimitDecision> => {
    try {
      const result = await firewallCheck(AI_RATE_LIMIT_ID, {
        headers: requestHeaders,
      });

      if (result.rateLimited || result.error === "blocked") {
        return rateLimitedDecision();
      }

      if (result.error === "not-found" && environment === "production") {
        return unavailableDecision();
      }

      return allowedDecision();
    } catch {
      return environment === "production"
        ? unavailableDecision()
        : allowedDecision();
    }
  };
}

const aiRateLimitGuard = createAiRateLimitGuard();

export function checkAiRateLimit(
  requestHeaders: Headers,
): Promise<AiRateLimitDecision> {
  return aiRateLimitGuard(requestHeaders);
}
