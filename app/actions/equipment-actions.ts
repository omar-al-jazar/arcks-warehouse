"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getEquipmentByBarcode } from "@/lib/supabase/queries";
import { dbErrorMessage } from "@/lib/supabase/errors";
import { authorize } from "@/lib/auth/session";
import { OWNER_ONLY, STAFF } from "@/lib/auth/roles";
import { identifyEquipmentPhoto, type EquipmentPhotoSuggestion } from "@/lib/vision";
import { findStockImage } from "@/lib/image-search";
import { userMessage } from "@/lib/errors";
import { parseForm, parseInput } from "@/lib/validation";
import { barcodeSchema, categorySchema } from "@/lib/schemas/common";
import {
  addEquipmentSchema,
  equipmentStatusSchema,
  identifyPhotoSchema,
  stockImageQuerySchema,
  updateEquipmentSchema,
} from "@/lib/schemas/equipment";
import type { EquipmentCategory } from "@/lib/supabase/types";

export type EquipmentFormState = {
  error?: string;
  success?: boolean;
  message?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function addEquipment(
  _prevState: EquipmentFormState,
  formData: FormData
): Promise<EquipmentFormState> {
  if (!(await authorize(STAFF))) {
    return { error: "Only staff can add equipment." };
  }

  const parsed = parseForm(addEquipmentSchema, formData);
  if (!parsed.ok) return { error: parsed.error };
  const { name, category, description, serialNumber, imageUrl, barcode, quantity } = parsed.data;

  const supabase = await createClient();
  const extraFields = { description, serial_number: serialNumber, image_url: imageUrl };

  // No barcode given: mint one from the per-category sequence (the photo-add
  // flow always takes this path, one item at a time).
  if (!barcode) {
    const { data: generated, error: barcodeError } = await supabase.rpc("next_equipment_barcode", {
      p_category: category,
    });
    if (barcodeError) return { error: dbErrorMessage(barcodeError, "Couldn't generate a barcode. Try again.") };

    const { error } = await supabase.from("equipment").insert({
      barcode: generated as string,
      name,
      category,
      ...extraFields,
    });
    if (error) return { error: dbErrorMessage(error, "Couldn't add the item. Try again.") };

    revalidatePath("/owner/inventory");
    return { success: true };
  }

  // Quantity 1: `barcode` is the literal, full barcode with an exact
  // uniqueness check and a single insert.
  if (quantity === 1) {
    const existing = await getEquipmentByBarcode(barcode);
    if (existing) {
      return { error: `Barcode ${barcode} is already assigned to "${existing.name}".` };
    }

    const { error } = await supabase.from("equipment").insert({
      barcode,
      name,
      category,
      ...extraFields,
    });

    if (error) {
      return { error: dbErrorMessage(error, "Couldn't add the item. Try again.") };
    }

    revalidatePath("/owner/inventory");
    return { success: true };
  }

  // Bulk path: `barcode` is treated as a prefix (e.g. "GRP"), not a literal
  // barcode. Find existing barcodes matching `prefix-%`, parse the numeric
  // suffixes, and continue numbering from max + 1.
  const prefix = barcode.replace(/-+$/, "");
  const { data: existingRows, error: lookupError } = await supabase
    .from("equipment")
    .select("barcode")
    .ilike("barcode", `${prefix}-%`);

  if (lookupError) {
    return { error: dbErrorMessage(lookupError, "Couldn't check existing barcodes. Try again.") };
  }

  const suffixPattern = new RegExp(`^${escapeRegExp(prefix)}-(\\d+)$`, "i");
  let maxSuffix = 0;
  for (const row of existingRows ?? []) {
    const match = row.barcode.match(suffixPattern);
    if (match) {
      const num = Number.parseInt(match[1], 10);
      if (num > maxSuffix) maxSuffix = num;
    }
  }

  const start = maxSuffix + 1;
  const newBarcodes = Array.from({ length: quantity }, (_, i) => `${prefix}-${String(start + i).padStart(4, "0")}`);

  const rows = newBarcodes.map((code) => ({
    barcode: code,
    name,
    category,
    ...extraFields,
  }));

  const { error: insertError } = await supabase.from("equipment").insert(rows);

  if (insertError) {
    return { error: dbErrorMessage(insertError, "Couldn't add the items. Try again.") };
  }

  revalidatePath("/owner/inventory");
  return {
    success: true,
    message: `Added ${quantity} items: ${newBarcodes[0]} through ${newBarcodes[newBarcodes.length - 1]}.`,
  };
}

export async function updateEquipment(
  _prevState: EquipmentFormState,
  formData: FormData
): Promise<EquipmentFormState> {
  if (!(await authorize(OWNER_ONLY))) {
    return { error: "Only the owner can edit equipment." };
  }

  const parsed = parseForm(updateEquipmentSchema, formData);
  if (!parsed.ok) return { error: parsed.error };
  const { equipmentId, name, category, serialNumber, imageUrl, dayRate } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("equipment")
    .update({ name, category, serial_number: serialNumber, image_url: imageUrl, day_rate_sar: dayRate })
    .eq("id", equipmentId);

  if (error) {
    return { error: dbErrorMessage(error, "Couldn't save your changes. Try again.") };
  }

  revalidatePath("/owner/inventory");
  return { success: true };
}

export async function setEquipmentStatus(equipmentId: number, status: "available" | "maintenance") {
  if (!(await authorize(OWNER_ONLY))) {
    throw new Error("Only the owner can update equipment status.");
  }

  // The TypeScript union above isn't enforced at runtime: a client can send
  // any value, including "checked_out", which only a checkout may set.
  const parsed = parseInput(equipmentStatusSchema, { equipmentId, status });
  if (!parsed.ok) throw new Error("Invalid request.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("equipment")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.equipmentId);
  if (error) throw new Error(dbErrorMessage(error, "Couldn't update the status."));

  revalidatePath("/owner/inventory");
  revalidatePath("/owner");
}

export async function lookupBarcode(barcode: string) {
  const parsed = parseInput(barcodeSchema, barcode);
  return parsed.ok ? getEquipmentByBarcode(parsed.data) : null;
}

// ---------------------------------------------------------------------------
// Photo-based intake: identify a phone photo, then suggest a stock image and
// the next barcode for the category the model picked. Three separate actions
// so the review form can re-run any one step (e.g. "search again for a
// better photo") without re-uploading or re-identifying.
// ---------------------------------------------------------------------------

export type PhotoIdentifyResult =
  | { success: true; suggestion: EquipmentPhotoSuggestion; stockImageUrl: string | null }
  | { error: string };

export async function identifyPhoto(formData: FormData): Promise<PhotoIdentifyResult> {
  if (!(await authorize(STAFF))) {
    return { error: "Only staff can add equipment." };
  }

  const parsed = parseForm(identifyPhotoSchema, formData);
  if (!parsed.ok) return { error: parsed.error };
  const { photo } = parsed.data;

  const base64 = Buffer.from(await photo.arrayBuffer()).toString("base64");

  let suggestion: EquipmentPhotoSuggestion;
  try {
    suggestion = await identifyEquipmentPhoto(base64, photo.type);
  } catch (error) {
    return { error: userMessage(error, "Couldn't identify the photo. Try again, or add the item manually.") };
  }

  const stockImageUrl = await findStockImage(suggestion.name).catch(() => null);

  return { success: true, suggestion, stockImageUrl };
}

export async function searchStockImage(name: string): Promise<{ imageUrl: string | null }> {
  if (!(await authorize(STAFF))) {
    throw new Error("Only staff can add equipment.");
  }
  const parsed = parseInput(stockImageQuerySchema, name);
  if (!parsed.ok) return { imageUrl: null };

  const imageUrl = await findStockImage(parsed.data).catch(() => null);
  return { imageUrl };
}

export async function previewNextBarcode(category: EquipmentCategory): Promise<{ barcode: string }> {
  if (!(await authorize(STAFF))) {
    throw new Error("Only staff can add equipment.");
  }
  const parsed = parseInput(categorySchema, category);
  if (!parsed.ok) throw new Error(parsed.error);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("next_equipment_barcode", { p_category: parsed.data });
  if (error) throw new Error(dbErrorMessage(error, "Couldn't reserve a barcode."));
  return { barcode: data as string };
}
