"use client";

import { useActionState } from "react";
import { setDeliveryFee, type BookingActionState } from "@/app/actions/booking-actions";
import { Card } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: BookingActionState = {};

export default function DeliveryFeeForm({ deliveryFeeSar }: { deliveryFeeSar: number | null }) {
  const [state, formAction, pending] = useActionState(setDeliveryFee, initialState);

  return (
    <Card className="gap-3 p-5">
      <h2 className="text-sm font-semibold text-muted-foreground">Public rental</h2>
      <form action={formAction} className="flex flex-col gap-3">
        <Field>
          <FieldLabel htmlFor="delivery-fee">Riyadh delivery fee (SAR)</FieldLabel>
          <Input
            id="delivery-fee"
            name="deliveryFee"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            defaultValue={deliveryFeeSar ?? ""}
          />
          <FieldDescription>
            Fallback fee when a zone has no price. Prefer the zone fees above for Riyadh deliveries.
          </FieldDescription>
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save delivery fee"}
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
