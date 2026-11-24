import Link from "next/link";
import { notFound } from "next/navigation";
import KitBooking from "@/components/rent/kit-booking";
import {
  availabilityFor,
  getPublicDeliveryFee,
  getPublicGear,
  listPublicDeliveryZones,
} from "@/lib/rent/catalog";
import { rentCopy } from "@/lib/rent/i18n";
import { getRentLocale } from "@/lib/rent/locale";

export async function generateMetadata({ params }: PageProps<"/rent/[barcode]">) {
  const { barcode } = await params;
  const [gear, locale] = await Promise.all([getPublicGear(barcode), getRentLocale()]);
  const copy = rentCopy(locale);
  return { title: gear ? copy.metaKitTitle(gear.name) : copy.metaTitle };
}

export default async function KitPage({ params }: PageProps<"/rent/[barcode]">) {
  const { barcode } = await params;
  const gear = await getPublicGear(barcode);
  if (!gear) notFound();

  const locale = await getRentLocale();
  const copy = rentCopy(locale);

  const [availability, deliveryFeeSar, zones] = await Promise.all([
    availabilityFor(gear),
    getPublicDeliveryFee(),
    listPublicDeliveryZones(),
  ]);
  const freeOnStrip = availability.free;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-7">
      <p className="text-[13px] text-muted-foreground">
        <Link href="/rent">{copy.breadcrumbHome}</Link>
        <span className="px-1.5">/</span>
        <Link href={`/rent#${gear.category}`}>{copy.category[gear.category]}</Link>
        <span className="px-1.5">/</span>
        <span className="text-foreground">{gear.name}</span>
      </p>

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {gear.imageUrl ? (
            // Warehouse photos are already hosted URLs. next/image would need each host allowed.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gear.imageUrl}
              alt={gear.name}
              className="aspect-video w-full rounded-xl border border-border object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-border bg-secondary text-xs font-semibold text-muted-foreground">
              {copy.kitPhotoPlaceholder}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <p className="text-[13px] font-semibold text-[var(--daylight)]">
              {copy.freeDays(freeOnStrip, availability.total)}
            </p>
            <h1 className="font-heading text-3xl font-bold">{gear.name}</h1>
            <p className="max-w-[62ch] text-base text-muted-foreground">
              {gear.description || copy.kitFallbackDescription}
            </p>
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="font-heading text-lg">{copy.next14}</h2>
            <ul className="flex flex-wrap gap-2">
              {availability.days.map((day) => {
                const date = new Date(`${day.date}T12:00:00Z`);
                const dow = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
                  weekday: "short",
                  timeZone: "UTC",
                }).format(date);
                return (
                  <li
                    key={day.date}
                    className={
                      day.booked
                        ? "flex w-14 flex-col items-center gap-0.5 rounded-lg border border-border bg-secondary px-1 py-2 text-center text-muted-foreground"
                        : "flex w-14 flex-col items-center gap-0.5 rounded-lg border border-[var(--daylight-line)] bg-[var(--daylight-bg)] px-1 py-2 text-center text-[var(--daylight-text)]"
                    }
                  >
                    <span className="text-[10px] font-semibold">{dow}</span>
                    <span className="text-[15px] font-bold">
                      {locale === "ar"
                        ? String(Number(day.date.slice(8))).replace(
                            /[0-9]/g,
                            (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)] ?? d
                          )
                        : Number(day.date.slice(8))}
                    </span>
                    <span className="text-[9px] font-semibold">
                      {day.booked ? copy.booked : copy.free}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="text-[13px] text-muted-foreground">{copy.next14Hint}</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-heading text-lg">{copy.whatArrives}</h2>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {(gear.kitContents.length > 0
                ? gear.kitContents
                : [{ label: gear.name, qty: 1 }]
              ).map((item, index) => (
                <li
                  key={`${item.label}-${index}`}
                  className="flex items-center justify-between gap-3 bg-card px-4 py-3"
                >
                  <span>{item.label}</span>
                  <span className="text-sm font-semibold text-muted-foreground">× {item.qty}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <KitBooking
          barcode={gear.barcode}
          dayRateSar={gear.dayRateSar}
          zones={zones}
          fallbackFeeSar={deliveryFeeSar}
          days={availability.days}
          locale={locale}
        />
      </div>
    </main>
  );
}
