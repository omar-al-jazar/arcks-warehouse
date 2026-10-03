import { createBrowserClient } from "@supabase/ssr";
import { AUTH_COOKIE_NAME } from "./config";
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
      // told otherwise. The server client talks to Supabase over the
      // internal Docker network (SUPABASE_URL=http://kong:8000 -> cookie
      // "sb-kong-auth-token"), while this browser client is built with the
      // public NEXT_PUBLIC_SUPABASE_URL. Those names never match, so the
      // browser client could never find the session cookie the server had
      // just set — every registerPasskey()/getSession() call in the browser
      // saw "Auth session missing!" no matter how fresh the client was.
      // Pinning an explicit, shared cookie name here and in
      // lib/supabase/server.ts is the actual fix.
      cookieOptions: { name: AUTH_COOKIE_NAME },
    }
  );
}
