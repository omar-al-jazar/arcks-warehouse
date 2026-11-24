import "server-only";

import { cookies } from "next/headers";
import { isRentLocale, RENT_LOCALE_COOKIE, type RentLocale } from "@/lib/rent/i18n";

export async function getRentLocale(): Promise<RentLocale> {
  const jar = await cookies();
  const raw = jar.get(RENT_LOCALE_COOKIE)?.value;
  return isRentLocale(raw) ? raw : "en";
}
