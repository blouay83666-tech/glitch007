// Tiny in-memory sliding-window rate limiter. Good enough to blunt abuse of the
// public order endpoint on a single instance; swap for Redis in a real cluster.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(key, arr);
    return false; // blocked
  }
  arr.push(now);
  hits.set(key, arr);
  return true; // allowed
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
