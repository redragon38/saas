type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 60_000;
const LIMIT_PER_MINUTE = 120;

const buckets = new Map<string, Bucket>();

export function consumeRateLimit(identifier: string) {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true as const, remaining: LIMIT_PER_MINUTE - 1, resetAt: now + WINDOW_MS };
  }

  if (bucket.count >= LIMIT_PER_MINUTE) {
    return { allowed: false as const, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  buckets.set(identifier, bucket);
  return { allowed: true as const, remaining: LIMIT_PER_MINUTE - bucket.count, resetAt: bucket.resetAt };
}
