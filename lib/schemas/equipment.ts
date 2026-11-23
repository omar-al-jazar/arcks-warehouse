import { z } from "zod";
import { blankAsMissing, categorySchema, optionalSar, optionalText, requiredText } from "./common";

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 100;
export const MIN_KIT_QTY = 1;
export const MAX_KIT_QTY = 999;
export const MAX_KIT_ITEMS = 40;

// Server Actions reject request bodies over 1 MB unless next.config.ts raises
// serverActions.bodySizeLimit. That limit must stay above MAX_PHOTO_BYTES plus
// multipart overhead, or oversized photos fail before reaching this check.
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const quantityMessage = `Quantity must be a whole number between ${MIN_QUANTITY} and ${MAX_QUANTITY}.`;
const kitQtyMessage = `Qty must be a whole number between ${MIN_KIT_QTY} and ${MAX_KIT_QTY}.`;

const kitContentItemSchema = z.object({
  label: requiredText("Each kit item needs a name.", 120),
  qty: z.coerce.number(kitQtyMessage).int(kitQtyMessage).min(MIN_KIT_QTY, kitQtyMessage).max(MAX_KIT_QTY, kitQtyMessage),
});

/** Form field is a JSON string of [{label, qty}]; empty / missing → []. */
export const kitContentsSchema = z.preprocess((value) => {
  if (value == null || value === "") return [];
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}, z.array(kitContentItemSchema, "Kit contents must be a list.").max(MAX_KIT_ITEMS, `At most ${MAX_KIT_ITEMS} kit items.`));

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
  dayRate: optionalSar("Day rate"),
  kitContents: kitContentsSchema,
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
