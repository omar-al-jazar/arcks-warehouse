import { z } from "zod";
import { requiredText } from "./common";

const REQUIRED = "Project, renter, and due date are required.";
const NO_ITEMS = "Scan at least one item before checking out.";

export const createCheckoutSchema = z.object({
  projectName: requiredText(REQUIRED, 120),
  renterName: requiredText(REQUIRED, 120),
  dueDate: z
    .string(REQUIRED)
    .min(1, REQUIRED)
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Due date is invalid."),
  equipmentIds: z
    .array(z.number().int().positive(), NO_ITEMS)
    .min(1, NO_ITEMS)
    .max(200, "That's too many items for one checkout."),
});

export type CreateCheckoutInput = z.input<typeof createCheckoutSchema>;
