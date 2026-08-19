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
  options: { headers: Headers; firewallHostForDevelopment?: string },
) => Promise<FirewallRateLimitResult>;

type AiRateLimitEnvironment = "local" | "deployment";
type RuntimeEnvironment = "development" | "production";

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
    process.env.AI_ABUSE_PROTECTION_MODE === "local"
      ? "local"
      : "deployment",
  runtimeEnvironment: RuntimeEnvironment =
    process.env.NODE_ENV === "production" ? "production" : "development",
): (requestHeaders: Headers) => Promise<AiRateLimitDecision> {
  return async (requestHeaders: Headers): Promise<AiRateLimitDecision> => {
    const firewallHostForDevelopment =
      process.env.VERCEL_FIREWALL_HOST_FOR_DEVELOPMENT;

    if (
      environment === "deployment" &&
      runtimeEnvironment !== "production" &&
      !firewallHostForDevelopment
    ) {
      return unavailableDecision();
    }

    try {
      const result = await firewallCheck(AI_RATE_LIMIT_ID, {
        headers: requestHeaders,
        firewallHostForDevelopment,
      });

      if (result.rateLimited || result.error === "blocked") {
        return rateLimitedDecision();
      }

      if (result.error === "not-found" && environment === "deployment") {
        return unavailableDecision();
      }

      return allowedDecision();
    } catch {
      return environment === "deployment"
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
