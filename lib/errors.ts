/** An error whose message is written for the end user and safe to show. */
export class UserError extends Error {
  name = "UserError";
}

/**
 * Message to show for a caught error: a UserError's own text, otherwise a
 * generic fallback — the real error is logged, never shown.
 */
export function userMessage(error: unknown, fallback: string): string {
  if (error instanceof UserError) return error.message;
  console.error(error);
  return fallback;
}
