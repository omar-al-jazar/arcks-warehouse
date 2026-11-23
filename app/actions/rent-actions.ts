"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { parseForm } from "@/lib/validation";
import { reserveSchema } from "@/lib/schemas/rent";
import { availabilityFor, getPublicDeliveryFee, getPublicGear } from "@/lib/rent/catalog";
import { addDays, HOLD_HOURS, quote, rentalDays, riyadhToday } from "@/lib/rent/dates";
import { confirmationText, whatsappLink } from "@/lib/rent/whatsapp";

export type ReserveState = {
  error?: string;
  heldUntil?: string;
  whatsappUrl?: string;
};

export async function reserveGear(_prev: ReserveState, formData: FormData): Promise<ReserveState> {
  const parsed = parseForm(reserveSchema, formData);
  if (!parsed.ok) return { error: parsed.error };

  const gear = await getPublicGear(parsed.data.barcode);
  if (!gear) return { error: "That piece is no longer listed." };
  if (gear.status === "maintenance") return { error: "This piece is in maintenance." };

  const today = riyadhToday();
  if (parsed.data.start < today) return { error: "Pickup can't be in the past." };

  const days = rentalDays(parsed.data.start, parsed.data.end);
  if (days < 1) return { error: "Return must be after pickup." };

  const [{ days: strip }, deliveryFeeSar] = await Promise.all([availabilityFor(gear), getPublicDeliveryFee()]);
  const wanted = Array.from({ length: days }, (_, index) => addDays(parsed.data.start, index));
  const outside = wanted.some((day) => !strip.some((entry) => entry.date === day));
  const blocked = wanted.some((day) => strip.find((entry) => entry.date === day)?.booked);
  if (outside || blocked) return { error: "Those dates are already taken." };

  // Price from the stored day rate and fee only. Never accept an amount from the form.
  const priced = quote(days, gear.dayRateSar, parsed.data.fulfilment, deliveryFeeSar);

  const admin = createAdminClient();
  const now = new Date();
  await admin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("equipment_id", gear.id)
    .eq("status", "held")
    .lte("held_until", now.toISOString());

  const heldUntil = new Date(now.getTime() + HOLD_HOURS * 60 * 60 * 1000);
  const { error } = await admin.from("bookings").insert({
    equipment_id: gear.id,
    start_date: parsed.data.start,
    end_date: parsed.data.end,
    fulfilment: parsed.data.fulfilment,
    status: "held",
    held_until: heldUntil.toISOString(),
    customer_name: parsed.data.name,
    customer_phone: parsed.data.phone,
    day_rate_sar: gear.dayRateSar,
    delivery_fee_sar: priced.fee,
    vat_sar: priced.vat,
    total_sar: priced.total,
  });

  if (error) {
    if (error.code === "23P01") return { error: "Those dates were just reserved." };
    console.error("[rent]", error);
    return { error: "The hold didn't save. Try those dates again." };
  }

  revalidatePath(`/rent/${gear.barcode}`);
  revalidatePath("/owner/bookings");
  // Email is not wired. Nothing here sends mail or pretends a message was delivered.
  return {
    heldUntil: heldUntil.toISOString(),
    whatsappUrl: whatsappLink(
      parsed.data.phone,
      confirmationText({
        customerName: parsed.data.name,
        gearName: gear.name,
        barcode: gear.barcode,
        start: parsed.data.start,
        end: parsed.data.end,
      }),
    ),
  };
}
