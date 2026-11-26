import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";
import { addDays, eachDay, riyadhToday } from "@/lib/rent/dates";
import type { StockState } from "@/lib/rent/stock";
import { getStockCalendar } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

const WINDOW_DAYS = 14;
const MAX_DAYS_AHEAD = 365;

const STATES: Record<StockState, { label: string; description: string; className: string }> = {
  free: { label: "Free", description: "Free to book", className: "text-muted-foreground" },
  held: {
    label: "Held",
    description: "10-minute hold",
    className: "border border-dashed border-primary text-primary",
  },
  confirmed: {
    label: "Confirmed",
    description: "Confirmed booking",
    className: "border border-primary/60 bg-primary/25 text-foreground",
  },
  out: { label: "Out", description: "Out with a customer", className: "bg-primary text-primary-foreground" },
  checkout: {
    label: "Desk",
    description: "Checked out at the warehouse desk",
    className: "bg-warn text-primary-foreground",
  },
  maintenance: {
    label: "Maint.",
    description: "In maintenance",
    className:
      "bg-[repeating-linear-gradient(135deg,var(--color-secondary)_0_5px,transparent_5px_10px)] text-muted-foreground",
  },
};

const LEGEND: StockState[] = ["free", "held", "confirmed", "out", "checkout", "maintenance"];
const STICKY = "sticky left-0 z-10 bg-card shadow-[inset_-1px_0_0_var(--color-border)]";

const weekdayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });
const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const fullDayFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const asDate = (day: string) => new Date(`${day}T12:00:00Z`);

export default async function OwnerCalendarPage({ searchParams }: PageProps<"/owner/calendar">) {
  const params = await searchParams;
  const now = new Date();
  const today = riyadhToday(now);
  const lastStart = addDays(today, MAX_DAYS_AHEAD);
  const start = clampDay(typeof params.from === "string" ? params.from : today, today, lastStart);
  const days = eachDay(start, WINDOW_DAYS);
  const pieces = await getStockCalendar(days, now);

  const groups = EQUIPMENT_CATEGORIES.map(({ value, label }) => ({
    value,
    label,
    pieces: pieces.filter((piece) => piece.category === value),
  })).filter((group) => group.pieces.length > 0);

  const previous = start > today ? clampDay(addDays(start, -WINDOW_DAYS), today, lastStart) : null;
  const next = start < lastStart ? clampDay(addDays(start, WINDOW_DAYS), today, lastStart) : null;
  const last = days[days.length - 1];
  const firstFormat = start.slice(0, 4) === last.slice(0, 4) ? dayFormat : fullDayFormat;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-heading text-lg font-semibold">Stock calendar</h1>
          <p className="text-sm text-muted-foreground">
            {firstFormat.format(asDate(start))} – {fullDayFormat.format(asDate(last))}
          </p>
        </div>
        <nav aria-label="Calendar dates" className="flex gap-2">
          <WindowLink from={previous} direction="previous" />
          <WindowLink from={next} direction="next" />
        </nav>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {LEGEND.map((state) => (
          <li key={state} className="flex items-center gap-2">
            <span className={cellClassName(state)}>{STATES[state].label}</span>
            {STATES[state].description}
          </li>
        ))}
      </ul>

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={STICKY}>Gear</TableHead>
              {days.map((day, index) => (
                <TableHead
                  key={day}
                  scope="col"
                  aria-current={day === today ? "date" : undefined}
                  className={cn("h-auto px-0.5 py-2 text-center", day === today && "text-primary")}
                >
                  <span className="flex flex-col items-center leading-tight">
                    <span className="text-[10px] font-medium">
                      {day === today ? "Today" : weekdayFormat.format(asDate(day))}
                    </span>
                    <span className="text-sm font-semibold">{Number(day.slice(8))}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {index === 0 || day.endsWith("-01") ? monthFormat.format(asDate(day)) : "\u00a0"}
                    </span>
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {groups.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={WINDOW_DAYS + 1} className="py-6 text-center text-muted-foreground">
                  No gear yet.
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            groups.map((group) => (
              <TableBody key={group.value}>
                <TableRow className="bg-secondary hover:bg-secondary">
                  <TableHead scope="rowgroup" className={cn(STICKY, "h-8 bg-secondary text-xs text-muted-foreground")}>
                    {group.label}
                  </TableHead>
                  <TableCell colSpan={WINDOW_DAYS} className="p-0" />
                </TableRow>
                {group.pieces.map((piece) => (
                  <TableRow key={piece.id} className="hover:bg-transparent">
                    <TableHead scope="row" className={cn(STICKY, "h-auto py-1.5")}>
                      <span className="block max-w-28 truncate sm:max-w-36" title={piece.name}>
                        {piece.name}
                      </span>
                      <span className="block font-mono text-xs font-normal text-muted-foreground">{piece.barcode}</span>
                    </TableHead>
                    {piece.states.map((state, index) => (
                      <TableCell key={days[index]} className="p-0.5">
                        <StockCell state={state} piece={piece.name} day={days[index]} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ))
          )}
        </Table>
      </Card>
    </div>
  );
}

function StockCell({ state, piece, day }: { state: StockState; piece: string; day: string }) {
  const { label, description } = STATES[state];
  const className = cn(cellClassName(state), "w-full");
  if (state !== "held" && state !== "confirmed") {
    return (
      <span title={description} className={className}>
        {label}
      </span>
    );
  }
  return (
    <Link
      href="/owner/bookings"
      title={`${description}. Open bookings`}
      aria-label={`${piece}, ${fullDayFormat.format(asDate(day))}: ${description}. Open bookings`}
      className={cn(
        className,
        "hover:ring-2 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      )}
    >
      {label}
    </Link>
  );
}

function cellClassName(state: StockState) {
  return cn(
    "flex h-8 min-w-13 items-center justify-center rounded-md px-0.5 text-[10px] font-semibold",
    STATES[state].className
  );
}

function WindowLink({ from, direction }: { from: string | null; direction: "previous" | "next" }) {
  const content =
    direction === "previous" ? (
      <>
        <ChevronLeftIcon data-icon="inline-start" />
        Previous
      </>
    ) : (
      <>
        Next
        <ChevronRightIcon data-icon="inline-end" />
      </>
    );
  const className = buttonVariants({ variant: "outline", size: "sm" });
  if (!from) {
    return (
      <span aria-disabled="true" className={cn(className, "opacity-50")}>
        {content}
      </span>
    );
  }
  return (
    <Link href={`/owner/calendar?from=${from}`} className={className}>
      {content}
    </Link>
  );
}

/** `day` when it is a real YYYY-MM-DD within [min, max]; a later date gives `max`, anything else `min`. */
function clampDay(day: string, min: string, max: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || addDays(day, 0) !== day || day < min) return min;
  return day > max ? max : day;
}
