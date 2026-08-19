import assert from "node:assert/strict";

import {
  AI_RATE_LIMIT_ID,
  AI_RATE_LIMIT_RETRY_AFTER_SECONDS,
  createAiRateLimitGuard,
} from "./rate-limit";

const headers = new Headers({
  host: "blueprint.example",
  "x-real-ip": "203.0.113.10",
});

async function runChecks(): Promise<void> {
  const calls: Array<{ id: string; requestHeaders: Headers }> = [];
  const allowedGuard = createAiRateLimitGuard(
    async (id, options) => {
      calls.push({ id, requestHeaders: options.headers });
      return { rateLimited: false };
    },
    "production",
  );

  assert.deepEqual(await allowedGuard(headers), {
    allowed: true,
    reason: "allowed",
    retryAfterSeconds: null,
  });
  assert.equal(calls[0]?.id, AI_RATE_LIMIT_ID);
  assert.equal(calls[0]?.requestHeaders.get("x-real-ip"), "203.0.113.10");

  const rateLimitedGuard = createAiRateLimitGuard(
    async () => ({ rateLimited: true }),
    "production",
  );
  assert.deepEqual(await rateLimitedGuard(headers), {
    allowed: false,
    reason: "rate-limited",
    retryAfterSeconds: AI_RATE_LIMIT_RETRY_AFTER_SECONDS,
  });

  const missingRuleGuard = createAiRateLimitGuard(
    async () => ({ rateLimited: false, error: "not-found" }),
    "production",
  );
  assert.deepEqual(await missingRuleGuard(headers), {
    allowed: false,
    reason: "unavailable",
    retryAfterSeconds: null,
  });

  const localMissingRuleGuard = createAiRateLimitGuard(
    async () => ({ rateLimited: false, error: "not-found" }),
    "development",
  );
  assert.deepEqual(await localMissingRuleGuard(headers), {
    allowed: true,
    reason: "allowed",
    retryAfterSeconds: null,
  });

  const failingGuard = createAiRateLimitGuard(
    async () => {
      throw new Error("Firewall unavailable");
    },
    "production",
  );
  assert.deepEqual(await failingGuard(headers), {
    allowed: false,
    reason: "unavailable",
    retryAfterSeconds: null,
  });
}

void runChecks()
  .then(() => {
    console.log("AI rate-limit checks passed.");
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
