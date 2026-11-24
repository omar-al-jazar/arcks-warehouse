import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/env";
import { AUTH_COOKIE_NAME } from "@/lib/supabase/config";
import { applySecurityHeaders } from "@/lib/security/headers";
import { safeRedirectPath } from "@/lib/security/safe-redirect";

export async function proxy(request: NextRequest) {
  const { url, anonKey } = getSupabaseEnv();

  // Server Components can't write cookies, so this is the one place the
  // session is refreshed: any rotated token is written onto both the
  // forwarded request (so the page render sees it) and the response.
  let response = NextResponse.next({ request });
  applySecurityHeaders(response.headers);
  const supabase = createServerClient(url, anonKey, {
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
    const next = safeRedirectPath(pathname + search, "/");
    if (next !== "/") loginUrl.searchParams.set("next", next);
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
  applySecurityHeaders(redirect.headers);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
