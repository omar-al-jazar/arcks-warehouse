"use client";

import { useActionState } from "react";
import { setBusinessWhatsapp, type BookingActionState } from "@/app/actions/booking-actions";
import { Card } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: BookingActionState = {};

export default function BusinessWhatsappForm({ businessWhatsapp }: { businessWhatsapp: string | null }) {
  const [state, formAction, pending] = useActionState(setBusinessWhatsapp, initialState);

  return (
    <Card className="gap-3 p-5">
      <h2 className="text-sm font-semibold text-muted-foreground">Business WhatsApp</h2>
      <form action={formAction} className="flex flex-col gap-3">
        <Field>
          <FieldLabel htmlFor="business-whatsapp">Number for customer messages</FieldLabel>
          <Input
            id="business-whatsapp"
            name="businessWhatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="05xxxxxxxx"
            defaultValue={businessWhatsapp ?? ""}
          />
          <FieldDescription>
            Saved as wa.me digits (9665…). Leave blank to clear. After a public reserve, the confirmation
            button opens a chat to this number.
          </FieldDescription>
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save WhatsApp number"}
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
