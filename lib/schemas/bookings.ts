import { z } from "zod";
import { isSaudiMobileDigits, normalizeWhatsappDigits } from "@/lib/rent/whatsapp";
import { optionalSar } from "./common";

export const bookingDecisionSchema = z.object({
  bookingId: z.number().int().positive(),
  decision: z.enum(["confirm", "cancel"]),
});

export const deliveryFeeSchema = z.object({
  deliveryFee: optionalSar("Delivery fee"),
});

/** Owner Settings: blank clears; otherwise store wa.me digits (9665…). */
export const businessWhatsappSchema = z.object({
  businessWhatsapp: z
    .string()
    .trim()
    .transform((value) => normalizeWhatsappDigits(value))
    .refine(
      (digits) => digits === null || isSaudiMobileDigits(digits),
      "Enter a Saudi mobile number (05xxxxxxxx)."
    ),
});
