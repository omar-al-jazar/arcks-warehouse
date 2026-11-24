"use client";

import { useTransition } from "react";
import { setRentLocale } from "@/app/actions/rent-locale-actions";
import type { RentLocale } from "@/lib/rent/i18n";

export default function LocaleSwitch({
  locale,
  label,
}: {
  locale: RentLocale;
  label: string;
}) {
  const [pending, start] = useTransition();
  const next: RentLocale = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => setRentLocale(next))}
      className="text-[13px] font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-60"
    >
      {label}
    </button>
  );
}
