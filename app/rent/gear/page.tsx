import Link from "next/link";
import { connection } from "next/server";
import { listPublicGear, presentPublicGear } from "@/lib/rent/catalog";
import { formatSar } from "@/lib/rent/dates";
import { rentCopy } from "@/lib/rent/i18n";
import { getRentLocale } from "@/lib/rent/locale";
import type { EquipmentCategory } from "@/lib/supabase/types";

const ORDER: EquipmentCategory[] = ["camera", "lighting", "grip"];

export async function generateMetadata() {
  const locale = await getRentLocale();
  return { title: rentCopy(locale).gearHeading };
}

export default async function GearListPage() {
  await connection();
  const locale = await getRentLocale();
  const copy = rentCopy(locale);
  const gear = await listPublicGear();
  const groups = ORDER.map((category) => ({
    category,
    pieces: presentPublicGear(gear.filter((item) => item.category === category)),
  })).filter((group) => group.pieces.length > 0);
  const day = copy.perDay.replace(/^\s*\/\s*/, "");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-14 px-6 py-16">
      <h1 className="font-heading text-4xl font-bold">{copy.gearHeading}</h1>
      {groups.length === 0 ? (
        <p className="text-muted-foreground">{copy.gearEmpty}</p>
      ) : (
        groups.map((group) => (
          <section key={group.category} className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-bold">{copy.category[group.category]}</h2>
            <ul>
              {group.pieces.map(({ item, count }) => (
                <li key={item.barcode} className="border-b border-border">
                  <Link href={`/rent/${item.barcode}`} className="flex items-baseline justify-between gap-6 py-4">
                    <span className="font-medium">{item.name}</span>
                    <span className="flex shrink-0 items-baseline gap-2 text-sm text-primary">
                      {item.dayRateSar != null ? <span dir="ltr">{formatSar(item.dayRateSar, "")}</span> : null}
                      {item.dayRateSar != null ? <span>{day}</span> : null}
                      {count > 1 ? <span dir="ltr" className="text-muted-foreground">{`×${count}`}</span> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
