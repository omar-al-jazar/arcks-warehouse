import Link from "next/link";
import { connection } from "next/server";
import RentHero from "@/components/rent/rent-hero";
import { listPublicGear, presentPublicGear } from "@/lib/rent/catalog";
import { formatSar } from "@/lib/rent/dates";
import { rentCopy } from "@/lib/rent/i18n";
import { getRentLocale } from "@/lib/rent/locale";
import type { EquipmentCategory } from "@/lib/supabase/types";

const ORDER: EquipmentCategory[] = ["camera", "lighting", "grip"];

export async function generateMetadata() {
  const locale = await getRentLocale();
  return { title: rentCopy(locale).metaTitle };
}

export default async function RentIndexPage() {
  await connection();
  const locale = await getRentLocale();
  const copy = rentCopy(locale);
  const gear = await listPublicGear();
  const chapters = ORDER.map((category) => {
    const pieces = presentPublicGear(gear.filter((item) => item.category === category));
    return { category, lead: pieces[0] };
  }).filter((chapter) => chapter.lead);

  return (
    <>
      <RentHero copy={copy} />
      {chapters.map((chapter) => {
        const item = chapter.lead.item;
        const day = copy.perDay.replace(/^\s*\/\s*/, "");
        return (
          <section
            key={chapter.category}
            id={chapter.category}
            className="rent-chapter relative flex min-h-[100svh] items-end overflow-hidden bg-black"
          >
            {item.imageUrl ? (
              // Warehouse photos are already hosted URLs. Contain keeps a wide fixture sharp.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt="" className="absolute inset-0 size-full object-contain" />
            ) : (
              <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,color-mix(in_oklab,var(--primary)_32%,transparent),transparent_60%),#0a0a0b]" />
            )}
            <span className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/45 to-black/10 ltr:bg-gradient-to-r" />
            <div className="relative z-10 flex w-full max-w-3xl flex-col items-start gap-6 px-6 pb-16 md:px-10">
              <h2 className="font-heading text-6xl leading-none font-bold sm:text-8xl">
                {copy.category[chapter.category]}
              </h2>
              <p className="font-heading text-3xl leading-tight font-bold sm:text-4xl">{item.name}</p>
              {item.dayRateSar != null ? (
                <p className="flex items-baseline gap-2 text-lg text-primary">
                  <span dir="ltr">{formatSar(item.dayRateSar, "")}</span>
                  <span>{day}</span>
                </p>
              ) : null}
              <Link
                href={`/rent/${item.barcode}`}
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground"
              >
                {copy.reserve}
              </Link>
            </div>
          </section>
        );
      })}
    </>
  );
}
