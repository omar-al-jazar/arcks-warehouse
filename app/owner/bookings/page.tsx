import BookingRowActions from "@/components/booking-row-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatSar } from "@/lib/rent/dates";
import { confirmationText, whatsappLink } from "@/lib/rent/whatsapp";
import { getBookings } from "@/lib/supabase/queries";
import type { BookingStatus } from "@/lib/supabase/types";

function formatDay(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const STATUS_LABEL: Record<BookingStatus, string> = {
  held: "Held",
  confirmed: "Confirmed",
  out: "Out",
  returned: "Returned",
  cancelled: "Cancelled",
};

function statusVariant(
  status: BookingStatus,
  expired: boolean
): "warn" | "good" | "outline" | "destructive" {
  if (expired) return "destructive";
  if (status === "held" || status === "out") return "warn";
  if (status === "confirmed" || status === "returned") return "good";
  return "outline";
}

function statusLabel(status: BookingStatus, expired: boolean) {
  if (expired) return "Expired";
  return STATUS_LABEL[status];
}

export default async function OwnerBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-lg font-semibold">Bookings ({bookings.length})</h1>
      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                  No holds yet.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const gear = Array.isArray(booking.equipment) ? booking.equipment[0] : booking.equipment;
                const gearName = gear?.name ?? "Reserved piece";
                const barcode = gear?.barcode ?? "—";
                const liveHold = booking.status === "held" && !booking.expired;
                const canChange = liveHold || booking.status === "confirmed" || booking.expired;
                const href = whatsappLink(
                  booking.customer_phone,
                  confirmationText({
                    customerName: booking.customer_name,
                    gearName,
                    barcode: gear?.barcode ?? "unlisted",
                    start: booking.start_date,
                    end: booking.end_date,
                  }),
                );

                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{gearName}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{barcode}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDay(booking.start_date)} – {formatDay(booking.end_date)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {booking.total_sar == null && booking.delivery_fee_sar == null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <div className="flex flex-col">
                          {booking.total_sar != null ? (
                            <span className="font-medium">{formatSar(booking.total_sar, "")}</span>
                          ) : null}
                          {booking.delivery_fee_sar != null ? (
                            <span className="text-xs text-muted-foreground">
                              {booking.fulfilment === "collect" ? "Collect" : "Delivery"}{" "}
                              {formatSar(booking.delivery_fee_sar, "")}
                            </span>
                          ) : null}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{booking.customer_name}</span>
                        <span className="text-xs text-muted-foreground">{booking.customer_phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(booking.status, booking.expired)}>
                        {statusLabel(booking.status, booking.expired)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-end gap-2">
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp ${booking.customer_name}`}
                          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                          WhatsApp
                        </a>
                        {canChange ? (
                          <BookingRowActions bookingId={booking.id} canConfirm={liveHold} />
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
