import { isIP } from "node:net";

import { z } from "zod";

export const RateLimitConfigSchema = z
  .object({
    maxRequests: z.number().int().positive(),
    windowMs: z.number().int().positive(),
  })
  .strict();

export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;

export type RateLimitDecision = Readonly<{
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number | null;
}>;

type RateLimitWindow = {
  count: number;
  resetAt: number;
};

export const DEFAULT_AI_RATE_LIMIT: RateLimitConfig = Object.freeze({
  maxRequests: 10,
  windowMs: 10 * 60 * 1000,
});

export function createRateLimiter(
  config: RateLimitConfig,
  now: () => number = Date.now,
): {
  consume: (key: string) => RateLimitDecision;
  clear: () => void;
} {
  const validatedConfig = RateLimitConfigSchema.parse(config);
  const windows = new Map<string, RateLimitWindow>();

  function removeExpiredWindows(timestamp: number): void {
    for (const [key, window] of windows) {
      if (window.resetAt <= timestamp) {
        windows.delete(key);
      }
    }
  }

  function consume(key: string): RateLimitDecision {
    const normalizedKey = z.string().trim().min(1).parse(key);
    const timestamp = now();
    removeExpiredWindows(timestamp);

    const existingWindow = windows.get(normalizedKey);

    if (!existingWindow) {
      windows.set(normalizedKey, {
        count: 1,
        resetAt: timestamp + validatedConfig.windowMs,
      });

      return {
        allowed: true,
        remaining: validatedConfig.maxRequests - 1,
        retryAfterSeconds: null,
      };
    }

    if (existingWindow.count >= validatedConfig.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((existingWindow.resetAt - timestamp) / 1000),
        ),
      };
    }

    existingWindow.count += 1;

    return {
      allowed: true,
      remaining: validatedConfig.maxRequests - existingWindow.count,
      retryAfterSeconds: null,
    };
  }

  return { consume, clear: () => windows.clear() };
}

const aiRateLimiter = createRateLimiter(DEFAULT_AI_RATE_LIMIT);

export function consumeAiRateLimit(key: string): RateLimitDecision {
  return aiRateLimiter.consume(key);
}

function readClientIp(value: string | null): string | null {
  const candidate = value?.split(",")[0]?.trim();

  return candidate && isIP(candidate) !== 0 ? candidate : null;
}

export function getRequestRateLimitKey(requestHeaders: Headers): string {
  const clientIp =
    readClientIp(requestHeaders.get("x-forwarded-for")) ??
    readClientIp(requestHeaders.get("x-real-ip"));

  return clientIp ? `ip:${clientIp}` : "anonymous";
}
