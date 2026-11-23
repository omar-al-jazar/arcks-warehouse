import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import type { EquipmentCategory, EquipmentStatus, KitContentItem } from "@/lib/supabase/types";
import { eachDay, riyadhToday, STRIP_DAYS } from "@/lib/rent/dates";
import { stockBlocks, stockStateOn, type OpenCheckout, type StockBooking } from "@/lib/rent/stock";

export type PublicGear = {
  id: number;
  barcode: string;
  name: string;
  category: EquipmentCategory;
  description: string | null;
  imageUrl: string | null;
  status: EquipmentStatus;
  dayRateSar: number | null;
  kitContents: KitContentItem[];
};

const GEAR_COLUMNS = "id, barcode, name, category, description, image_url, status, day_rate_sar, kit_contents";

export async function listPublicGear(): Promise<PublicGear[]> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("equipment").select(GEAR_COLUMNS).order("name");
  if (error) throw error;
  return (data ?? []).map(toPublicGear);
}

export async function getPublicGear(barcode: string): Promise<PublicGear | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("equipment").select(GEAR_COLUMNS).eq("barcode", barcode).maybeSingle();
  if (error) throw error;
  return data ? toPublicGear(data) : null;
}

/**
 * The Riyadh delivery fee, or null until the owner sets one. RLS lets only
 * signed-in staff read rental_settings, so visitors get it through the service role.
 */
export async function getPublicDeliveryFee(): Promise<number | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.from("rental_settings").select("delivery_fee_sar").eq("id", true).maybeSingle();
  if (error) throw error;
  return toSar(data?.delivery_fee_sar);
}

/**
 * Business WhatsApp digits (9665…), or null until the owner sets one.
 * Public reserve builds wa.me from this only — never from the customer phone.
 */
export async function getPublicBusinessWhatsapp(): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rental_settings")
    .select("business_whatsapp")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  return data?.business_whatsapp ?? null;
}

export async function availabilityFor(gear: PublicGear, now = new Date()) {
  const today = riyadhToday(now);
  const blocks = await blocksFor(gear, now);
  const days = eachDay(today, STRIP_DAYS).map((date) => ({
    date,
    booked: stockStateOn(date, blocks) !== "free",
  }));
  const free = days.filter((day) => !day.booked).length;
  return { today, days, free, total: days.length };
}

/** Same blocking rule as Owner → Calendar (`stockBlocks`). */
async function blocksFor(gear: PublicGear, now: Date) {
  const admin = createAdminClient();
  const [checkouts, bookings] = await Promise.all([
    admin
      .from("checkout_items")
      .select("checked_out_at, returned_at, checkout_orders(due_date)")
      .eq("equipment_id", gear.id)
      .is("returned_at", null),
    admin
      .from("bookings")
      .select("start_date, end_date, status, held_until")
      .eq("equipment_id", gear.id)
      .in("status", ["held", "confirmed", "out"]),
  ]);

  if (checkouts.error) throw checkouts.error;
  if (bookings.error) throw bookings.error;

  const openCheckouts: OpenCheckout[] = (checkouts.data ?? []).map((item) => {
    const order = item.checkout_orders as { due_date: string } | { due_date: string }[] | null;
    const due = Array.isArray(order) ? order[0]?.due_date : order?.due_date;
    return { checked_out_at: item.checked_out_at, due_date: due ?? null };
  });

  return stockBlocks(gear, openCheckouts, (bookings.data ?? []) as StockBooking[], now);
}

function toPublicGear(row: {
  id: number;
  barcode: string;
  name: string;
  category: EquipmentCategory;
  description: string | null;
  image_url: string | null;
  status: EquipmentStatus;
  day_rate_sar: number | string | null;
  kit_contents: unknown;
}): PublicGear {
  return {
    id: row.id,
    barcode: row.barcode,
    name: row.name,
    category: row.category,
    description: row.description,
    imageUrl: row.image_url,
    status: row.status,
    dayRateSar: toSar(row.day_rate_sar),
    kitContents: toKitContents(row.kit_contents),
  };
}

function toSar(value: number | string | null | undefined) {
  const amount = value == null ? null : Number(value);
  return amount != null && Number.isFinite(amount) ? amount : null;
}

/** jsonb may be anything from the wire; keep only usable {label, qty} lines. */
function toKitContents(value: unknown): KitContentItem[] {
  if (!Array.isArray(value)) return [];
  const items: KitContentItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const label = "label" in entry ? entry.label : null;
    const qty = "qty" in entry ? Number(entry.qty) : NaN;
    if (typeof label !== "string" || !label.trim()) continue;
    if (!Number.isFinite(qty) || qty < 1) continue;
    items.push({ label: label.trim(), qty: Math.floor(qty) });
  }
  return items;
}
