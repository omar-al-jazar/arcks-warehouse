"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { dbErrorMessage } from "@/lib/supabase/errors";
import { authorize } from "@/lib/auth/session";
import { OWNER_ONLY } from "@/lib/auth/roles";
import { parseForm, parseInput } from "@/lib/validation";
import { bookingDecisionSchema, deliveryFeeSchema } from "@/lib/schemas/bookings";
import type { BookingStatus } from "@/lib/supabase/types";

export type BookingActionState = {
  error?: string;
  success?: boolean;
};

// Which statuses each decision may move a booking out of. Gear that has
// already gone out is handled by the warehouse checkout, not from here.
const FROM: Record<"confirm" | "cancel", BookingStatus[]> = {
  confirm: ["held"],
  cancel: ["held", "confirmed"],
};

export async function decideBooking(bookingId: number, decision: "confirm" | "cancel"): Promise<BookingActionState> {
  if (!(await authorize(OWNER_ONLY))) {
    return { error: "Only the owner can change a booking." };
  }

  const parsed = parseInput(bookingDecisionSchema, { bookingId, decision });
  if (!parsed.ok) return { error: "Invalid request." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .update(
      parsed.data.decision === "confirm" ? { status: "confirmed", held_until: null } : { status: "cancelled" }
    )
    .eq("id", parsed.data.bookingId)
    .in("status", FROM[parsed.data.decision])
    .select("id");

  if (error) return { error: dbErrorMessage(error, "Couldn't update the booking. Try again.") };
  // Zero rows: it was cancelled or released between the page loading and this click.
  if (data.length === 0) return { error: "That booking has already changed. Refresh to see it." };

  revalidatePath("/owner/bookings");
  return { success: true };
}

export async function setDeliveryFee(_prev: BookingActionState, formData: FormData): Promise<BookingActionState> {
  if (!(await authorize(OWNER_ONLY))) {
    return { error: "Only the owner can set the delivery fee." };
  }

  const parsed = parseForm(deliveryFeeSchema, formData);
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rental_settings")
    .update({ delivery_fee_sar: parsed.data.deliveryFee })
    .eq("id", true)
    .select("id");

  if (error) return { error: dbErrorMessage(error, "Couldn't save the delivery fee. Try again.") };
  if (data.length === 0) return { error: "Couldn't save the delivery fee. Try again." };

  revalidatePath("/owner/settings");
  return { success: true };
}
