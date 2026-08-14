const WINDOW_MS = 60_000;
const MAX_REQUESTS = 15;

const hits = new Map<string, number[]>();

/**
 * Simple sliding-window rate limit, in-memory. Fine for a single-instance
 * portfolio deployment; swap for a Redis/Upstash-backed limiter if this
 * ever runs across multiple serverless instances.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS;
}
