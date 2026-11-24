import { z } from "zod";
import { safeRedirectPath } from "@/lib/security/safe-redirect";

const LOGIN_MESSAGE = "Enter your 6-digit PIN to continue.";
const PIN_STEP_MESSAGE = "Enter a 6-digit PIN at each step.";
const pin = z.string(PIN_STEP_MESSAGE).regex(/^\d{6}$/, PIN_STEP_MESSAGE);

export const loginSchema = z.object({
  role: z.enum(["manager", "owner"], LOGIN_MESSAGE),
  // Length only (not digits-only): accounts created before PINs were
  // constrained to digits must still be able to sign in.
  pin: z.string(LOGIN_MESSAGE).min(6, LOGIN_MESSAGE).max(72, LOGIN_MESSAGE),
  next: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const path = safeRedirectPath(value, "");
      return path || undefined;
    }),
});
export const changePinSchema = z
  .object({ currentPin: pin, newPin: pin, confirmPin: pin })
  .refine((v) => v.newPin === v.confirmPin, { message: "New PINs didn't match. Try again.", path: ["confirmPin"] })
  .refine((v) => v.newPin !== v.currentPin, {
    message: "New PIN must be different from your current one.",
    path: ["newPin"],
  });
