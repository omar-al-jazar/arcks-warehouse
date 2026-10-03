import { z } from "zod";
import { requiredText, staffRoleSchema } from "./common";

const PIN_MESSAGE = "PIN must be exactly 6 digits.";

export const createStaffSchema = z.object({
  name: requiredText("Name is required.", 80),
  role: staffRoleSchema,
  pin: z.string(PIN_MESSAGE).regex(/^\d{6}$/, PIN_MESSAGE),
});
