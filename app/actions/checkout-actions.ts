"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { dbErrorMessage } from "@/lib/supabase/errors";
import { parseInput } from "@/lib/validation";
import { barcodeSchema } from "@/lib/schemas/common";
import { createCheckoutSchema, type CreateCheckoutInput } from "@/lib/schemas/checkout";

export async function createCheckout(input: CreateCheckoutInput) {
  const parsed = parseInput(createCheckoutSchema, input);
  if (!parsed.ok) return { error: parsed.error };
  const { projectName, renterName, dueDate, equipmentIds } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_checkout", {
    p_project_name: projectName,
    p_renter_name: renterName,
    p_due_date: new Date(dueDate).toISOString(),
    p_equipment_ids: equipmentIds,
  });

  if (error) {
    return { error: dbErrorMessage(error, "Couldn't create the checkout. Try again.") };
  }

  revalidatePath("/manager");
  revalidatePath("/manager/orders");
  revalidatePath("/owner");
  revalidatePath("/owner/inventory");
  revalidatePath("/owner/orders");

  return { success: true, orderId: data as number };
}

export async function returnByBarcode(barcode: string) {
  const parsed = parseInput(barcodeSchema, barcode);
  if (!parsed.ok) return { error: "Scan or type a barcode to return." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("return_by_barcode", { p_barcode: parsed.data }).single();

  if (error) {
    return { error: dbErrorMessage(error, "Couldn't process that return. Try again.") };
  }

  revalidatePath("/manager");
  revalidatePath("/manager/orders");
  revalidatePath("/owner");
  revalidatePath("/owner/inventory");
  revalidatePath("/owner/orders");

  const result = data as { item_name: string; project_name: string };
  return { success: true, itemName: result.item_name, projectName: result.project_name };
}
