import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";

/** Sliding window for public reserve. Keeps spam off without a Redis box. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_PHONE = 3;
const MAX_PER_IP = 8;

const ipHits = new Map<string, number[]>();

function prune(hits: number[], now: number): number[] {
  return hits.filter((t) => now - t < WINDOW_MS);
}

/** Best-effort IP key from the incoming request. Empty when unknown. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() ?? "";
}

/** In-process IP cap. Soft on multi-instance hosts; still cuts hot loops. */
export function allowIp(ip: string): boolean {
  if (!ip) return true;
  const now = Date.now();
  const hits = prune(ipHits.get(ip) ?? [], now);
  if (hits.length >= MAX_PER_IP) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

/**
 * Count recent holds for this phone across the fleet via `created_at`.
 * Counts every status so cancelled spam still trips the limit.
 */
export async function allowPhone(phone: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("customer_phone", phone)
    .gte("created_at", since);

  if (error) {
    console.error("[rent/rate-limit]", error);
    // Fail open on read errors so a DB blip doesn't freeze reserves.
    return true;
  }
  return (count ?? 0) < MAX_PER_PHONE;
}
