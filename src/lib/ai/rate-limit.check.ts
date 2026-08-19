import assert from "node:assert/strict";

import {
  createRateLimiter,
  getRequestRateLimitKey,
  RateLimitConfigSchema,
} from "./rate-limit";

let currentTime = 1_000;
const limiter = createRateLimiter(
  { maxRequests: 2, windowMs: 10_000 },
  () => currentTime,
);

assert.deepEqual(limiter.consume("ip:203.0.113.10"), {
  allowed: true,
  remaining: 1,
  retryAfterSeconds: null,
});
assert.deepEqual(limiter.consume("ip:203.0.113.10"), {
  allowed: true,
  remaining: 0,
  retryAfterSeconds: null,
});
assert.deepEqual(limiter.consume("ip:203.0.113.10"), {
  allowed: false,
  remaining: 0,
  retryAfterSeconds: 10,
});

assert.deepEqual(limiter.consume("ip:203.0.113.11"), {
  allowed: true,
  remaining: 1,
  retryAfterSeconds: null,
});

currentTime += 10_000;
assert.deepEqual(limiter.consume("ip:203.0.113.10"), {
  allowed: true,
  remaining: 1,
  retryAfterSeconds: null,
});

assert.throws(() => limiter.consume("   "));
assert.throws(() =>
  RateLimitConfigSchema.parse({ maxRequests: 0, windowMs: 1000 }),
);
assert.throws(() =>
  RateLimitConfigSchema.parse({ maxRequests: 1.5, windowMs: 1000 }),
);

assert.equal(
  getRequestRateLimitKey(
    new Headers({ "x-forwarded-for": "203.0.113.10, 10.0.0.1" }),
  ),
  "ip:203.0.113.10",
);
assert.equal(
  getRequestRateLimitKey(new Headers({ "x-real-ip": "2001:db8::1" })),
  "ip:2001:db8::1",
);
assert.equal(
  getRequestRateLimitKey(new Headers({ "x-forwarded-for": "not-an-ip" })),
  "anonymous",
);

console.log("AI rate-limit checks passed.");
