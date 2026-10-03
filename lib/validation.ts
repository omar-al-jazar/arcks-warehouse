import { z } from "zod";

export type ParseResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Validates untrusted input — every Server Action argument is one, whatever
 * its TypeScript type says. The error is the first issue's message, so each
 * schema phrases its messages for the end user.
 */
export function parseInput<S extends z.ZodType>(schema: S, input: unknown): ParseResult<z.output<S>> {
  const result = schema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error.issues[0]?.message ?? "Invalid input." };
}

export function parseForm<S extends z.ZodType>(schema: S, formData: FormData): ParseResult<z.output<S>> {
  return parseInput(schema, Object.fromEntries(formData));
}
