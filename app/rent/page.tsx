import Link from "next/link";
import { connection } from "next/server";
import RentHero from "@/components/rent/rent-hero";
import { listPublicGear } from "@/lib/rent/catalog";
import { rentCopy } from "@/lib/rent/i18n";
import { getRentLocale } from "@/lib/rent/locale";
import type { EquipmentCategory } from "@/lib/supabase/types";

const ORDER: EquipmentCategory[] = ["camera", "lighting", "grip"];

export async function generateMetadata() {
  const locale = await getRentLocale();
  return { title: rentCopy(locale).metaTitle };
}

export default async function RentIndexPage() {
  // Without this the page is prerendered at build time, and the gear list and statuses never change.
  await connection();
  const locale = await getRentLocale();
  const copy = rentCopy(locale);
  const gear = await listPublicGear();
  const groups = ORDER.map((category) => ({
    category,
    items: gear.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <RentHero copy={copy} />
      <main id="gear" className="mx-auto flex w-full max-w-6xl scroll-mt-8 flex-col gap-10 px-6 py-12">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">{copy.gearHeading}</h2>
          <p className="text-muted-foreground">{copy.gearSupport}</p>
        </div>
        {groups.length === 0 ? (
          <p className="text-muted-foreground">{copy.gearEmpty}</p>
        ) : (
          groups.map((group) => (
            <section key={group.category} id={group.category} className="flex flex-col gap-3">
              <h3 className="font-heading text-xl">{copy.category[group.category]}</h3>
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {group.items.map((item) => (
                  <li key={item.barcode}>
                    <Link
                      href={`/rent/${item.barcode}`}
                      className="flex items-center justify-between gap-4 bg-card px-4 py-3"
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.barcode}</span>
                      </span>
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {statusLabel(item.status, copy)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>
    </>
  );
}

function statusLabel(
  status: string,
  copy: ReturnType<typeof rentCopy>
) {
  if (status === "available") return copy.statusAvailable;
  if (status === "checked_out") return copy.statusOut;
  return copy.statusMaintenance;
}
