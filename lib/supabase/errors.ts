import type { PostgrestError } from "@supabase/supabase-js";

// Our SQL functions report business-rule failures with a plain
// `raise exception '...'`, which Postgres tags P0001. Those messages are
// written for users ("Equipment 12 is not available").
const RAISED_EXCEPTION = "P0001";

/**
 * Message to show for a database error. Raised business-rule messages pass
 * through; everything else (constraint names, policy text, column names) is
 * logged and replaced so internals never reach the browser.
 */
export function dbErrorMessage(error: PostgrestError, fallback: string): string {
  switch (error.code) {
    case RAISED_EXCEPTION:
      return error.message;
    case "23505": // unique_violation
      return "That already exists.";
    case "42501": // insufficient_privilege
      return "You don't have permission to do that.";
    default:
      console.error("[db]", error);
      return fallback;
  }
}
