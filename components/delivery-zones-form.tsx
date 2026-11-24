"use client";

import { useActionState } from "react";
import { setDeliveryZones, type BookingActionState } from "@/app/actions/booking-actions";
import { Card } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { OwnerDeliveryZone } from "@/lib/supabase/queries";

const initialState: BookingActionState = {};

export default function DeliveryZonesForm({ zones }: { zones: OwnerDeliveryZone[] }) {
  const [state, formAction, pending] = useActionState(setDeliveryZones, initialState);

  return (
    <Card className="gap-3 p-5">
      <h2 className="text-sm font-semibold text-muted-foreground">Riyadh delivery zones</h2>
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="zones" value={zones.map((zone) => zone.slug).join(",")} />
        {zones.map((zone) => (
          <Field key={zone.slug}>
            <FieldLabel htmlFor={`fee-${zone.slug}`}>
              {zone.nameEn} / {zone.nameAr} (SAR)
            </FieldLabel>
            <Input
              id={`fee-${zone.slug}`}
              name={`fee_${zone.slug}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              defaultValue={zone.feeSar ?? ""}
            />
          </Field>
        ))}
        <FieldDescription>
          Added to delivery bookings before VAT. Leave a zone blank to fall back to the house-wide fee below.
        </FieldDescription>
        <Button type="submit" disabled={pending || zones.length === 0}>
          {pending ? "Saving…" : "Save zone fees"}
        </Button>
        <p role="status" className="min-h-4 text-xs">
          {state.error ? (
            <span className="text-destructive">{state.error}</span>
          ) : state.success ? (
            <span className="text-good">Saved.</span>
          ) : null}
        </p>
      </form>
    </Card>
  );
}
