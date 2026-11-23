"use client";

import { useState, useTransition } from "react";
import { decideBooking } from "@/app/actions/booking-actions";
import { Button } from "@/components/ui/button";

export default function BookingRowActions({ bookingId, canConfirm }: { bookingId: number; canConfirm: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  function decide(decision: "confirm" | "cancel") {
    setError(undefined);
    startTransition(async () => {
      const result = await decideBooking(bookingId, decision);
      setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        {canConfirm && (
          <Button size="sm" disabled={isPending} onClick={() => decide("confirm")}>
            Confirm
          </Button>
        )}
        <Button size="sm" variant="outline" disabled={isPending} onClick={() => decide("cancel")}>
          Cancel
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
