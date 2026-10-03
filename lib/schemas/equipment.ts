import { z } from "zod";
import { blankAsMissing, categorySchema, optionalText, requiredText } from "./common";

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 100;

// Server Actions reject request bodies over 1 MB unless next.config.ts raises
// serverActions.bodySizeLimit. That limit must stay above MAX_PHOTO_BYTES plus
// multipart overhead, or oversized photos fail before reaching this check.
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const quantityMessage = `Quantity must be a whole number between ${MIN_QUANTITY} and ${MAX_QUANTITY}.`;

export const addEquipmentSchema = z.object({
  name: requiredText("Name is required.", 120),
  category: categorySchema,
  description: optionalText(500),
  serialNumber: optionalText(120),
  imageUrl: optionalText(2048),
  barcode: optionalText(64),
  quantity: z.preprocess(
    blankAsMissing,
    z.coerce.number(quantityMessage).int(quantityMessage).min(MIN_QUANTITY, quantityMessage).max(MAX_QUANTITY, quantityMessage).default(MIN_QUANTITY)
  ),
});

export const updateEquipmentSchema = z.object({
  equipmentId: z.coerce.number("Invalid equipment.").int("Invalid equipment.").positive("Invalid equipment."),
  name: requiredText("Name is required.", 120),
  category: categorySchema,
  serialNumber: optionalText(120),
  imageUrl: optionalText(2048),
});

export const equipmentStatusSchema = z.object({
  equipmentId: z.number().int().positive(),
  status: z.enum(["available", "maintenance"]),
});

export const stockImageQuerySchema = requiredText("Enter a name to search for.", 120);

export const identifyPhotoSchema = z.object({
  photo: z
    .instanceof(File, { error: "No photo was uploaded." })
    .refine((file) => file.size > 0, "No photo was uploaded.")
    .refine((file) => PHOTO_TYPES.includes(file.type), "Use a JPEG, PNG, WebP or HEIC photo.")
    .refine((file) => file.size <= MAX_PHOTO_BYTES, "That photo is too large (8 MB max)."),
});
