export const RIYADH = "Asia/Riyadh";
export const VAT_RATE = 0.15;
export const HOLD_HOURS = 24;
export const STRIP_DAYS = 14;

export type Fulfilment = "delivery" | "collect";

export function riyadhToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: RIYADH,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function riyadhDate(iso: string) {
  return riyadhToday(new Date(iso));
}

export function addDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function rentalDays(start: string, end: string) {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const ms = Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd);
  return Math.round(ms / 86_400_000);
}

export function eachDay(start: string, count: number) {
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

export type DateBlock = { start: string; end: string };

export function dayIsBlocked(day: string, blocks: DateBlock[], blockedFrom?: string) {
  if (blockedFrom && day >= blockedFrom) return true;
  return blocks.some((block) => day >= block.start && day < block.end);
}

export function defaultStay(days: { date: string; booked: boolean }[]) {
  const startIndex = days.findIndex((day) => !day.booked);
  if (startIndex === -1) return null;
  const start = days[startIndex].date;
  const following = days[startIndex + 1];
  const nights = following && !following.booked ? 2 : 1;
  return { start, end: addDays(start, nights) };
}

export type Quote = {
  days: number;
  subtotal: number | null;
  fee: number | null;
  vat: number | null;
  total: number | null;
};

export function quote(
  days: number,
  dayRate: number | null,
  fulfilment: Fulfilment,
  deliveryFee: number | null
): Quote {
  const subtotal = dayRate == null || days < 1 ? null : roundMoney(dayRate * days);
  const fee = fulfilment === "collect" ? 0 : deliveryFee;
  const vat = subtotal != null && fee != null ? roundMoney((subtotal + fee) * VAT_RATE) : null;
  const total = subtotal != null && fee != null && vat != null ? roundMoney(subtotal + fee + vat) : null;
  return { days, subtotal, fee, vat, total };
}

function roundMoney(amount: number) {
  return Math.round(amount * 100) / 100;
}

export function formatSar(amount: number | null, placeholder: string) {
  if (amount == null) return `SAR ${placeholder}`;
  return `SAR ${amount.toLocaleString("en-SA", { maximumFractionDigits: 2 })}`;
}
