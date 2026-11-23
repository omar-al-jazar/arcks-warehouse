import { z } from "zod";
import { optionalSar } from "./common";

export const bookingDecisionSchema = z.object({
  bookingId: z.number().int().positive(),
  decision: z.enum(["confirm", "cancel"]),
});

export const deliveryFeeSchema = z.object({
  deliveryFee: optionalSar("Delivery fee"),
});
