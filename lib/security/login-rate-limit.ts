/** Failed PIN attempts per client IP. In-process — same caveat as rent IP limit. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

const failures = new Map<string, number[]>();

function prune(hits: number[], now: number): number[] {
  return hits.filter((t) => now - t < WINDOW_MS);
}

export function allowLoginAttempt(ip: string): boolean {
  const key = ip.trim() || "unknown";
  const now = Date.now();
  const hits = prune(failures.get(key) ?? [], now);
  failures.set(key, hits);
  return hits.length < MAX_FAILURES;
}

export function recordLoginFailure(ip: string): void {
  const key = ip.trim() || "unknown";
  const now = Date.now();
  const hits = prune(failures.get(key) ?? [], now);
  hits.push(now);
  failures.set(key, hits);
}

export function clearLoginFailures(ip: string): void {
  const key = ip.trim() || "unknown";
  failures.delete(key);
}

/** Test helper — not for production call sites. */
export function _resetLoginRateLimitForTests() {
  failures.clear();
}
