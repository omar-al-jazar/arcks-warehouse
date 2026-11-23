import { addDays, dayIsBlocked, riyadhDate, riyadhToday, type DateBlock } from "@/lib/rent/dates";
import type { BookingStatus, EquipmentStatus } from "@/lib/supabase/types";

export type StockState = "free" | "held" | "confirmed" | "out" | "checkout" | "maintenance";

type TakenState = Exclude<StockState, "free">;
type Blocks = { ranges: DateBlock[]; blockedFrom?: string };
export type StockBlocks = Partial<Record<TakenState, Blocks>>;

/** When more than one reason covers a day, the first one here is shown. */
const PRECEDENCE: readonly TakenState[] = ["maintenance", "checkout", "out", "confirmed", "held"];

export type OpenCheckout = { checked_out_at: string; due_date: string | null };
export type StockBooking = { start_date: string; end_date: string; status: BookingStatus; held_until: string | null };

/**
 * The public site's blocking rule (blocksFor in lib/rent/catalog.ts), with
 * each block kept under the reason it exists. A day is taken here exactly
 * when the kit page shows it booked. Pass every open checkout for the piece.
 */
export function stockBlocks(
  piece: { status: EquipmentStatus },
  checkouts: OpenCheckout[],
  bookings: StockBooking[],
  now: Date,
): StockBlocks {
  if (piece.status === "maintenance") {
    return { maintenance: { ranges: [], blockedFrom: "0000-01-01" } };
  }

  const checkout: Blocks = { ranges: [] };
  for (const item of checkouts) {
    const start = riyadhDate(item.checked_out_at);
    if (!item.due_date || riyadhDate(item.due_date) < riyadhToday(now)) {
      checkout.blockedFrom = checkout.blockedFrom && checkout.blockedFrom < start ? checkout.blockedFrom : start;
      continue;
    }
    checkout.ranges.push({ start, end: addDays(riyadhDate(item.due_date), 1) });
  }

  if (piece.status === "checked_out" && checkouts.length === 0) {
    checkout.blockedFrom = riyadhToday(now);
  }

  const blocks: Record<"checkout" | "out" | "confirmed" | "held", Blocks> = {
    checkout,
    out: { ranges: [] },
    confirmed: { ranges: [] },
    held: { ranges: [] },
  };
  for (const booking of bookings) {
    if (booking.status !== "held" && booking.status !== "confirmed" && booking.status !== "out") continue;
    if (booking.status === "held" && booking.held_until && new Date(booking.held_until) <= now) continue;
    blocks[booking.status].ranges.push({ start: booking.start_date, end: booking.end_date });
  }

  return blocks;
}

export function stockStateOn(day: string, blocks: StockBlocks): StockState {
  for (const state of PRECEDENCE) {
    const block = blocks[state];
    if (block && dayIsBlocked(day, block.ranges, block.blockedFrom)) return state;
  }
  return "free";
}
