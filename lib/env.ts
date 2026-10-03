import { z } from "zod";

// Validation is lazy (on first use, then cached) rather than at import time:
// `next build` in Docker runs with placeholder values and without the
// runtime-only secrets, and importing this module must not fail there.
//
// Every variable is read as a literal `process.env.NAME`, never by passing
// `process.env` wholesale: Next only inlines NEXT_PUBLIC_* values into the
// bundle for literal reads, and Docker doesn't set them at runtime.

// docker-compose passes unset variables through as empty strings.
const blankAsMissing = (value: unknown) => (value === "" ? undefined : value);
const text = z.string().min(1);
const optionalText = z.preprocess(blankAsMissing, text.optional());
const optionalUrl = z.preprocess(blankAsMissing, z.url().optional());

function lazy<T>(load: () => T): () => T {
  let value: T | undefined;
  return () => (value ??= load());
}

function parseEnv<S extends z.ZodType>(schema: S, source: Record<string, string | undefined>): z.output<S> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

const supabaseSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: text,
  SUPABASE_URL: optionalUrl,
  SUPABASE_ANON_KEY: optionalText,
});

/**
 * Where server-side code (server client, proxy) reaches Supabase. The plain
 * SUPABASE_* values are runtime-only and point at the internal Docker host;
 * the NEXT_PUBLIC_ ones are build-time values and the fallback for local dev.
 */
export const getSupabaseEnv = lazy(() => {
  const env = parseEnv(supabaseSchema, {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  });
  return {
    url: env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
});

export const getServiceRoleKey = lazy(
  () =>
    parseEnv(z.object({ SUPABASE_SERVICE_ROLE_KEY: text }), {
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }).SUPABASE_SERVICE_ROLE_KEY
);

/** Undefined when photo identification isn't configured. */
export const getGeminiApiKey = lazy(
  () => parseEnv(z.object({ GEMINI_API_KEY: optionalText }), { GEMINI_API_KEY: process.env.GEMINI_API_KEY }).GEMINI_API_KEY
);

/** Undefined when stock-photo lookup isn't configured. */
export const getExaApiKey = lazy(
  () => parseEnv(z.object({ EXA_API_KEY: optionalText }), { EXA_API_KEY: process.env.EXA_API_KEY }).EXA_API_KEY
);
