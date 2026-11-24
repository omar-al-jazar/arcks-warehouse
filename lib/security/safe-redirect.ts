/**
 * Only allow same-origin relative paths. Blocks open redirects like
 * `//evil.com`, `/\evil.com`, and protocol-relative tricks that pass a
 * naive `startsWith("/")` check.
 */
export function safeRedirectPath(candidate: string | null | undefined, fallback = "/"): string {
  if (candidate == null) return fallback;
  const path = candidate.trim();
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//")) return fallback;
  if (path.includes("\\")) return fallback;
  if (/^\/[\s]*\/\//.test(path)) return fallback;
  // Disallow scheme-looking segments after the first slash (e.g. /https://…).
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) return fallback;
  return path;
}
