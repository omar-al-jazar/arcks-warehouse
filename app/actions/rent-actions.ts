"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { parseForm } from "@/lib/validation";
import { reserveSchema } from "@/lib/schemas/rent";
import {
  availabilityFor,
  getPublicBusinessWhatsapp,
  getPublicGear,
  resolveDeliveryFee,
} from "@/lib/rent/catalog";
import { addDays, HOLD_HOURS, quote, rentalDays, riyadhToday } from "@/lib/rent/dates";
import {
  isRentLocale,
  localizeReserveFormError,
  reserveErrors,
  type RentLocale,
} from "@/lib/rent/i18n";
import { allowIp, allowPhone, clientIp } from "@/lib/rent/rate-limit";
import { confirmationText, whatsappLink } from "@/lib/rent/whatsapp";

export type ReserveState = {
  error?: string;
  heldUntil?: string;
  whatsappUrl?: string;
};

export async function reserveGear(_prev: ReserveState, formData: FormData): Promise<ReserveState> {
  const localeRaw = formData.get("locale");
  const localeHint: RentLocale =
    typeof localeRaw === "string" && isRentLocale(localeRaw) ? localeRaw : "ar";

  const parsed = parseForm(reserveSchema, formData);
  if (!parsed.ok) return { error: localizeReserveFormError(parsed.error, localeHint) };

  const locale: RentLocale = isRentLocale(parsed.data.locale) ? parsed.data.locale : "ar";
  const err = reserveErrors[locale];

  const ip = await clientIp();
  if (!allowIp(ip)) return { error: err.rateIp };
  if (!(await allowPhone(parsed.data.phone))) return { error: err.ratePhone };

  const gear = await getPublicGear(parsed.data.barcode);
  if (!gear) return { error: err.missing };
  if (gear.status === "maintenance") return { error: err.maintenance };

  const today = riyadhToday();
  if (parsed.data.start < today) return { error: err.past };

  const days = rentalDays(parsed.data.start, parsed.data.end);
  if (days < 1) return { error: err.returnAfter };

  const [{ days: strip }, businessWhatsapp, delivery] = await Promise.all([
    availabilityFor(gear),
    getPublicBusinessWhatsapp(),
    resolveDeliveryFee(
      parsed.data.fulfilment === "delivery" ? parsed.data.deliveryZone : undefined
    ),
  ]);
  const wanted = Array.from({ length: days }, (_, index) => addDays(parsed.data.start, index));
  const outside = wanted.some((day) => !strip.some((entry) => entry.date === day));
  const blocked = wanted.some((day) => strip.find((entry) => entry.date === day)?.booked);
  if (outside || blocked) return { error: err.taken };

  if (parsed.data.fulfilment === "delivery" && delivery.zoneId == null) {
    return { error: err.zone };
  }

  // Price from the stored day rate and zone fee only. Never accept an amount from the form.
  const priced = quote(days, gear.dayRateSar, parsed.data.fulfilment, delivery.feeSar);

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
    delivery_zone_id: parsed.data.fulfilment === "delivery" ? delivery.zoneId : null,
    vat_sar: priced.vat,
    total_sar: priced.total,
  });

  if (error) {
    if (error.code === "23P01") return { error: err.race };
    console.error("[rent]", error);
    return { error: err.save };
  }

  revalidatePath(`/rent/${gear.barcode}`);
  revalidatePath("/owner/bookings");
  const text = confirmationText(
    {
      customerName: parsed.data.name,
      gearName: gear.name,
      barcode: gear.barcode,
      start: parsed.data.start,
      end: parsed.data.end,
    },
    locale
  );
  return {
    heldUntil: heldUntil.toISOString(),
    whatsappUrl: businessWhatsapp ? whatsappLink(businessWhatsapp, text) : undefined,
  };
}
