import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // proxy.ts runs server-side inside the `app` container, so it must reach
  // Supabase via the internal Docker network address, not the browser-facing
  // NEXT_PUBLIC_SUPABASE_URL. Same reasoning for the anon key: the
  // NEXT_PUBLIC_ version is inlined as a build-time placeholder (see
  // lib/supabase/server.ts), so this reads the runtime-only alias instead.
  const supabase = createServerClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Must match lib/supabase/client.ts and lib/supabase/server.ts — see
      // the comment there. Without this, supabase-js's default cookie name
      // (derived from the Supabase URL's hostname) differs here (internal
      // Docker host "kong") from what the browser client computes (the
      // public Tailscale host), so this proxy would never see a session the
      // browser client's own requests are actually using.
      cookieOptions: { name: "sb-gearroom-auth-token" },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes the session and validates the JWT. Never use getSession() here
  // — it doesn't revalidate the token.
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const { pathname } = request.nextUrl;
  const isManagerRoute = pathname.startsWith("/manager");
  const isOwnerRoute = pathname.startsWith("/owner");

  if (!isManagerRoute && !isOwnerRoute) {
    return supabaseResponse;
  }

  if (error || !claims) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (claims.app_metadata as { role?: string } | undefined)?.role;

  if (isOwnerRoute && role !== "owner") {
    return NextResponse.redirect(new URL("/manager", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
