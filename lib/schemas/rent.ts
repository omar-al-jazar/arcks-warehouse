import { z } from "zod";

export const reserveSchema = z
  .object({
    barcode: z.string().trim().min(1, "Choose a piece of gear."),
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a pickup date."),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a return date."),
    fulfilment: z.enum(["delivery", "collect"], { error: "Choose delivery or collection." }),
    name: z.string().trim().min(2, "Enter your name.").max(80, "Name is too long."),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9][0-9\s-]{7,18}$/, "Enter a WhatsApp number."),
  })
  .refine((value) => value.end > value.start, { message: "Return must be after pickup.", path: ["end"] });
