import { z } from "zod";

export const categorySchema = z.enum(["camera", "lighting", "grip"], "Pick a valid category.");
export const staffRoleSchema = z.enum(["manager", "owner"], "Pick a valid role.");

export const barcodeSchema = z.string().trim().min(1).max(64);

/** A string field that must be present and non-blank. */
export const requiredText = (message: string, max: number) =>
  z.string(message).trim().min(1, message).max(max, message);

/** A free-text field that may be absent or blank; blank becomes null. */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "That value is too long.")
    .transform((value) => value || null)
    .default(null);

/** Form fields arrive as "" when left empty — treat that as not provided. */
export const blankAsMissing = (value: unknown) => (value === "" ? undefined : value);
