import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Passkeys (registerPasskey/signInWithPasskey) are an experimental
      // API — must opt in explicitly. Browser-only: the WebAuthn ceremony
      // itself runs via navigator.credentials, so this has no effect on the
      // server client in lib/supabase/server.ts.
      auth: { experimental: { passkey: true } },
      // createBrowserClient caches a module-level singleton by default. A
      // logout -> re-login cycle in the same tab (redirect() does a soft,
      // client-side navigation, not a hard reload) never tears that cached
      // client down, so it keeps whatever session it saw at first creation.
      // Every call here is already infrequent (login-time only), so always
      // building a fresh client is the simple, correct fix.
      isSingleton: false,
      // supabase-js derives its session cookie name from the *hostname* of
      // the Supabase URL it's given (`sb-<first-label>-auth-token`) unless
      // told otherwise. The server client (lib/supabase/server.ts) talks to
      // Supabase over the internal Docker network (SUPABASE_URL=http://kong:8000
      // -> cookie "sb-kong-auth-token"), while this browser client is built
      // with the public NEXT_PUBLIC_SUPABASE_URL (e.g. the gearroom stack's
      // Tailscale URL -> a different cookie name). Those names never match,
      // so the browser client can never find the session cookie the server
      // just set. Pinning the same explicit cookie name this app's shared
      // gearroom Supabase backend already uses (see warehouse-tracker's
      // lib/supabase/client.ts) is the actual fix.
      cookieOptions: { name: "sb-gearroom-auth-token" },
    }
  );
}
