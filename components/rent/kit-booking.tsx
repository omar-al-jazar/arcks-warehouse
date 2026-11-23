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
  formatSar,
  quote,
  rentalDays,
  RIYADH,
  type Fulfilment,
} from "@/lib/rent/dates";

type Day = { date: string; booked: boolean };

const initialState: ReserveState = {};

export default function KitBooking({
  barcode,
  dayRateSar,
  days,
}: {
  barcode: string;
  dayRateSar: number | null;
  days: Day[];
}) {
  const stay = defaultStay(days);
  const [start, setStart] = useState(stay?.start ?? days[0]?.date ?? "");
  const [end, setEnd] = useState(stay?.end ?? "");
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [state, action, pending] = useActionState(reserveGear, initialState);

  const priced = useMemo(() => quote(rentalDays(start, end), dayRateSar, fulfilment, null), [start, end, dayRateSar, fulfilment]);
  const taken = days.some((day) => day.booked && day.date >= start && day.date < end);
  const heldLabel = state.heldUntil
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: RIYADH,
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      }).format(new Date(state.heldUntil))
    : null;

  return (
    <Card className="h-fit w-full gap-4 p-5 lg:sticky lg:top-6 lg:w-[340px]">
      <p className="flex items-baseline gap-2">
        <span className="font-heading text-3xl font-bold text-primary">{formatSar(dayRateSar, "[RATE]")}</span>
        <span className="text-sm text-muted-foreground">/ day</span>
      </p>

      {heldLabel ? (
        <div className="flex flex-col gap-3">
          <Alert>
            <AlertDescription>Held until {heldLabel}. We will confirm on WhatsApp. No card charged yet.</AlertDescription>
          </Alert>
          {state.whatsappUrl ? (
            <>
              <a
                href={state.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ className: "h-12 w-full text-base" })}
              >
                Open the WhatsApp confirmation
              </a>
              <p className="text-center text-xs text-muted-foreground">
                Opens a WhatsApp chat with the number you entered, with this hold ready to send.
              </p>
            </>
          ) : null}
        </div>
      ) : (
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="barcode" value={barcode} />
          <input type="hidden" name="fulfilment" value={fulfilment} />
          <div className="flex flex-wrap gap-2">
            <Field className="min-w-[130px] flex-1">
              <FieldLabel htmlFor="pickup">Pickup</FieldLabel>
              <Input id="pickup" name="start" type="date" value={start} min={days[0]?.date} onChange={(event) => setStart(event.target.value)} required />
            </Field>
            <Field className="min-w-[130px] flex-1">
              <FieldLabel htmlFor="return">Return</FieldLabel>
              <Input id="return" name="end" type="date" value={end} min={start ? addDays(start, 1) : undefined} onChange={(event) => setEnd(event.target.value)} required />
            </Field>
          </div>

          <FieldSet className="gap-2">
            <FieldLegend variant="label">How you get it</FieldLegend>
            <ToggleGroup
              value={[fulfilment]}
              onValueChange={(value) => {
                const next = value[0];
                if (next === "delivery" || next === "collect") setFulfilment(next);
              }}
              className="w-full"
            >
              <ToggleGroupItem value="delivery" className="min-h-11 flex-1">
                Deliver in Riyadh
              </ToggleGroupItem>
              <ToggleGroupItem value="collect" className="min-h-11 flex-1">
                Collect
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldSet>

          <Separator />
          <div className="flex flex-col gap-2 text-sm">
            <PriceRow label={`${formatSar(dayRateSar, "[RATE]")} × ${Math.max(priced.days, 0)} days`} value={formatSar(priced.subtotal, "[SUBTOTAL]")} />
            <PriceRow
              label={fulfilment === "delivery" ? "Riyadh delivery + pickup" : "Collect from the workshop"}
              value={formatSar(priced.fee, "[FEE]")}
            />
            <PriceRow label="VAT 15%" value={formatSar(priced.vat, "[VAT]")} />
            <Separator />
            <PriceRow label="Total" value={formatSar(priced.total, "[TOTAL]")} strong />
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" name="name" autoComplete="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">WhatsApp</FieldLabel>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="05xxxxxxxx" required />
            </Field>
          </FieldGroup>

          {state.error ? (
            <Alert>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          {taken ? <p className="text-sm text-muted-foreground">That range includes a booked day.</p> : null}

          <Button type="submit" className="h-12 w-full text-base" disabled={pending || taken || priced.days < 1}>
            {pending ? "Reserving…" : "Reserve these dates"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Holds the gear for 24h. No card charged yet. We confirm on WhatsApp, then you pay.
          </p>
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
