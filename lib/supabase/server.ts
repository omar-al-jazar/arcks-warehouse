import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getServiceRoleKey, getSupabaseEnv } from "@/lib/env";
import { AUTH_COOKIE_NAME } from "./config";
import type { Database } from "./types";

// Create a new server client per request — it configures fetch calls using
// that request's cookies. The URL and anon key come from getSupabaseEnv(),
// which prefers the internal Docker host over the browser-facing one.
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(
    url,
    anonKey,
    {
      // Must match the browser client's cookieOptions.name in
      // lib/supabase/client.ts. Left to its default, supabase-js names the
      // session cookie after the Supabase URL's hostname
      // (`sb-<first-label>-auth-token`) — this server client resolves
      // SUPABASE_URL to the internal Docker hostname (http://kong:8000),
      // while the browser client resolves the public URL, so the two sides
      // computed different cookie names and the browser could never read
      // the session the server had just written.
      cookieOptions: { name: AUTH_COOKIE_NAME },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore because the
            // proxy refreshes the session on every request.
          }
        },
      },
    }
  );
}

// Admin client using the service_role key. Server-only — never import this
// from a Client Component. Bypasses RLS, so use sparingly (seeding, and
// creating auth users from the owner's "add manager" flow later).
export function createAdminClient() {
  return createServerClient<Database>(
    getSupabaseEnv().url,
    getServiceRoleKey(),
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );
}
