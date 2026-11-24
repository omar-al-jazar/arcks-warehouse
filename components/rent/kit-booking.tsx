"use client";

import { useActionState, useMemo, useState } from "react";
import { reserveGear, type ReserveState } from "@/app/actions/rent-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  addDays,
  defaultStay,
  quote,
  rentalDays,
  RIYADH,
  type Fulfilment,
} from "@/lib/rent/dates";
import { formatSarLocale, rentCopy, type RentLocale } from "@/lib/rent/i18n";

type Day = { date: string; booked: boolean };

type DeliveryZoneOption = {
  id: number;
  slug: string;
  nameEn: string;
  nameAr: string;
  feeSar: number | null;
};

const initialState: ReserveState = {};

export default function KitBooking({
  barcode,
  dayRateSar,
  zones,
  fallbackFeeSar,
  days,
  locale,
}: {
  barcode: string;
  dayRateSar: number | null;
  zones: DeliveryZoneOption[];
  fallbackFeeSar: number | null;
  days: Day[];
  locale: RentLocale;
}) {
  // Resolve copy here — never pass RentCopy from a Server Component (it holds functions).
  const copy = rentCopy(locale);
  const stay = defaultStay(days);
  const [start, setStart] = useState(stay?.start ?? days[0]?.date ?? "");
  const [end, setEnd] = useState(stay?.end ?? "");
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [zoneSlug, setZoneSlug] = useState(zones[0]?.slug ?? "");
  const [state, action, pending] = useActionState(reserveGear, initialState);

  const selectedZone = zones.find((zone) => zone.slug === zoneSlug);
  const deliveryFeeSar =
    fulfilment === "collect" ? 0 : (selectedZone?.feeSar ?? fallbackFeeSar);

  const priced = useMemo(
    () => quote(start && end ? rentalDays(start, end) : 0, dayRateSar, fulfilment, deliveryFeeSar),
    [start, end, dayRateSar, fulfilment, deliveryFeeSar],
  );
  const taken = days.some((day) => day.booked && day.date >= start && day.date < end);
  const heldLabel = state.heldUntil
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
        timeZone: RIYADH,
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      }).format(new Date(state.heldUntil))
    : null;

  const money = (amount: number | null, placeholder: string) =>
    formatSarLocale(amount, placeholder, locale);

  return (
    <Card className="h-fit w-full gap-4 p-5 lg:sticky lg:top-6 lg:w-[340px]">
      <p className="flex items-baseline gap-2">
        <span className="font-heading text-3xl font-bold text-primary">{money(dayRateSar, "[RATE]")}</span>
        <span className="text-sm text-muted-foreground">{copy.perDay}</span>
      </p>

      {heldLabel ? (
        <div className="flex flex-col gap-3">
          <Alert>
            <AlertDescription>{copy.heldUntil(heldLabel)}</AlertDescription>
          </Alert>
          {state.whatsappUrl ? (
            <>
              <a
                href={state.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ className: "h-12 w-full text-base" })}
              >
                {copy.openWhatsapp}
              </a>
              <p className="text-center text-xs text-muted-foreground">{copy.openWhatsappHint}</p>
            </>
          ) : null}
        </div>
      ) : (
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="barcode" value={barcode} />
          <input type="hidden" name="fulfilment" value={fulfilment} />
          {fulfilment === "delivery" ? (
            <input type="hidden" name="deliveryZone" value={zoneSlug} />
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Field className="min-w-[130px] flex-1">
              <FieldLabel htmlFor="pickup">{copy.pickup}</FieldLabel>
              <Input
                id="pickup"
                name="start"
                type="date"
                value={start}
                min={days[0]?.date}
                onChange={(event) => setStart(event.target.value)}
                required
              />
            </Field>
            <Field className="min-w-[130px] flex-1">
              <FieldLabel htmlFor="return">{copy.return}</FieldLabel>
              <Input
                id="return"
                name="end"
                type="date"
                value={end}
                min={start ? addDays(start, 1) : undefined}
                onChange={(event) => setEnd(event.target.value)}
                required
              />
            </Field>
          </div>

          <FieldSet className="gap-2">
            <FieldLegend variant="label">{copy.howYouGetIt}</FieldLegend>
            <ToggleGroup
              value={[fulfilment]}
              onValueChange={(value) => {
                const next = value[0];
                if (next === "delivery" || next === "collect") setFulfilment(next);
              }}
              className="w-full"
            >
              <ToggleGroupItem value="delivery" className="min-h-11 flex-1">
                {copy.deliverInRiyadh}
              </ToggleGroupItem>
              <ToggleGroupItem value="collect" className="min-h-11 flex-1">
                {copy.collect}
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldSet>

          {fulfilment === "delivery" ? (
            <Field>
              <FieldLabel htmlFor="delivery-zone">{copy.deliveryZone}</FieldLabel>
              <select
                id="delivery-zone"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={zoneSlug}
                onChange={(event) => setZoneSlug(event.target.value)}
                required
              >
                {zones.length === 0 ? (
                  <option value="">{copy.chooseZone}</option>
                ) : (
                  zones.map((zone) => (
                    <option key={zone.slug} value={zone.slug}>
                      {locale === "ar" ? zone.nameAr : zone.nameEn}
                      {zone.feeSar != null
                        ? ` — ${formatSarLocale(zone.feeSar, "", locale)}`
                        : ""}
                    </option>
                  ))
                )}
              </select>
            </Field>
          ) : null}

          <Separator />
          <div className="flex flex-col gap-2 text-sm">
            <PriceRow
              label={`${money(dayRateSar, "[RATE]")} × ${Math.max(priced.days, 0)}`}
              value={money(priced.subtotal, "[SUBTOTAL]")}
            />
            <PriceRow
              label={fulfilment === "delivery" ? copy.feeDelivery : copy.feeCollect}
              value={money(priced.fee, "[FEE]")}
            />
            <PriceRow label={copy.vat} value={money(priced.vat, "[VAT]")} />
            <Separator />
            <PriceRow label={copy.total} value={money(priced.total, "[TOTAL]")} strong />
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">{copy.name}</FieldLabel>
              <Input id="name" name="name" autoComplete="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">{copy.phone}</FieldLabel>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder={copy.phonePlaceholder}
                required
              />
            </Field>
          </FieldGroup>

          {state.error ? (
            <Alert>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          {taken ? <p className="text-sm text-muted-foreground">{copy.rangeTaken}</p> : null}

          <Button
            type="submit"
            className="h-12 w-full text-base"
            disabled={pending || taken || priced.days < 1 || (fulfilment === "delivery" && !zoneSlug)}
          >
            {pending ? copy.reserving : copy.reserve}
          </Button>
          <p className="text-center text-xs text-muted-foreground">{copy.holdHint}</p>
        </form>
      )}
    </Card>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <p className="flex items-baseline justify-between gap-3">
      <span className={strong ? "font-semibold text-foreground" : "text-muted-foreground"}>{label}</span>
      <span className={strong ? "font-heading text-xl font-bold text-primary" : "font-semibold"}>{value}</span>
    </p>
  );
}
