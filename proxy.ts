import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/supabase/config";

// Runs inside the app container, so it reaches Supabase over the internal
// Docker network (SUPABASE_URL=http://kong:8000). The NEXT_PUBLIC_ fallback
// is for plain local dev; the NEXT_PUBLIC_ anon key is a build-time
// placeholder in Docker, so the runtime-only SUPABASE_ANON_KEY comes first.
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function proxy(request: NextRequest) {
  // Server Components can't write cookies, so this is the one place the
  // session is refreshed: any rotated token is written onto both the
  // forwarded request (so the page render sees it) and the response.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookieOptions: { name: AUTH_COOKIE_NAME },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getClaims() validates the JWT and refreshes it when it's near expiry.
  // Don't use getSession() here — it trusts the cookie without checking it.
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const { pathname, search } = request.nextUrl;
  const isOwnerRoute = pathname === "/owner" || pathname.startsWith("/owner/");
  const isManagerRoute = pathname === "/manager" || pathname.startsWith("/manager/");

  if (!isOwnerRoute && !isManagerRoute) return response;

  if (error || !claims) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return redirectKeepingCookies(loginUrl, response);
  }

  const role = (claims.app_metadata as { role?: string } | undefined)?.role;
  if (isOwnerRoute && role !== "owner") {
    return redirectKeepingCookies(new URL("/manager", request.url), response);
  }

  return response;
}

// A redirect is a brand-new response, so a token refreshed above would be
// lost unless its Set-Cookie headers are copied across.
function redirectKeepingCookies(url: URL, from: NextResponse) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
