"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isRentLocale, RENT_LOCALE_COOKIE, type RentLocale } from "@/lib/rent/i18n";

export async function setRentLocale(locale: RentLocale) {
  if (!isRentLocale(locale)) return;
  const jar = await cookies();
  jar.set(RENT_LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/rent");
}
