/**
 * Name of the Supabase session cookie, shared by the browser client, the
 * server client and proxy.ts. supabase-js otherwise derives it from the
 * hostname of the Supabase URL it is given — and each of those three talks
 * to a different host (public URL in the browser, internal Docker host
 * `kong` on the server), so they would each read and write a different
 * cookie. Every caller must use this constant.
 */
export const AUTH_COOKIE_NAME = "sb-arcks-shadcn-auth-token";
