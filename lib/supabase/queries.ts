import "server-only";
import { createClient } from "@/lib/supabase/server";
import { summarizeStatusCounts, type EquipmentStats } from "@/lib/equipment-stats";
import type { EquipmentCategory, EquipmentStatus } from "@/lib/supabase/types";

export async function getAllStaff() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, role, email, created_at")
    .order("created_at");
  if (error) throw error;
  return data;
}

export type EquipmentFilters = {
  category?: string;
  status?: string;
  search?: string;
};

// PostgREST's .or() takes a raw filter string (e.g.
// "name.ilike.%foo%,barcode.ilike.%bar%"), so interpolating user input into
// it directly is filter-syntax injection: characters like `,` `(` `)` `%`
// `.` let a search term inject extra conditions or break the filter's
// structure. Real equipment names/barcodes in this system (see seed data)
// are plain text — letters, digits, spaces, hyphens — so stripping
// everything else from the search term before interpolating removes the
// injection vectors without breaking legitimate searches.
function sanitizeSearchTerm(term: string) {
  return term.replace(/[^a-zA-Z0-9 -]/g, "");
}

export async function getAllEquipment(filters: EquipmentFilters = {}) {
  const supabase = await createClient();
  let query = supabase.from("equipment").select("*").order("name");

  if (filters.category) {
    query = query.eq("category", filters.category as EquipmentCategory);
  }
  if (filters.status) {
    query = query.eq("status", filters.status as EquipmentStatus);
  }
  if (filters.search) {
    const term = sanitizeSearchTerm(filters.search);
    if (term) {
      query = query.or(`name.ilike.%${term}%,barcode.ilike.%${term}%`);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getEquipmentByBarcode(barcode: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("equipment")
    .select("*")
    .eq("barcode", barcode)
    .maybeSingle();
  return data;
}

export async function getEquipmentStats(): Promise<EquipmentStats> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("equipment_status_counts");
  if (error) throw error;
  return summarizeStatusCounts(data);
}

export async function getActiveOrdersWithItems() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("checkout_orders")
    .select(
      "*, profiles!checkout_orders_checked_out_by_fkey(name), checkout_items(id, equipment_id, returned_at, equipment(name, barcode, category))"
    )
    .eq("status", "active")
    .order("due_date");
  if (error) throw error;

  return orders.map(({ checkout_items, ...order }) => ({
    ...order,
    items: checkout_items ?? [],
  }));
}

export async function getOverdueOrders() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("checkout_orders")
    .select(
      "*, profiles!checkout_orders_checked_out_by_fkey(name), checkout_items(id, equipment_id, returned_at, equipment(name, barcode, category))"
    )
    .eq("status", "active")
    .lt("due_date", new Date().toISOString())
    .order("due_date");
  if (error) throw error;

  return orders.map(({ checkout_items, ...order }) => ({
    ...order,
    items: checkout_items ?? [],
  }));
}

export async function getOrderHistory() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("checkout_orders")
    .select("*, checkout_items(id, equipment_id, returned_at, equipment(name, barcode))")
    .order("checked_out_at", { ascending: false });
  if (error) throw error;

  return orders.map(({ checkout_items, ...order }) => ({
    ...order,
    items: checkout_items ?? [],
  }));
}

/** Public-site bookings, newest first. RLS limits this to signed-in staff. */
export async function getBookings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, equipment(name, barcode)")
    .order("created_at", { ascending: false });
  if (error) throw error;

  // A hold past its deadline stays "held" in the table until the next reserve
  // on that piece releases it, but its dates are already open to the public.
  const now = Date.now();
  return data.map((booking) => ({
    ...booking,
    expired:
      booking.status === "held" && booking.held_until != null && new Date(booking.held_until).getTime() <= now,
  }));
}

export async function getRentalSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rental_settings").select("delivery_fee_sar").maybeSingle();
  if (error) throw error;
  return { deliveryFeeSar: data?.delivery_fee_sar ?? null };
}

export async function findActiveCheckoutItemForEquipment(equipmentId: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("checkout_items")
    .select("*")
    .eq("equipment_id", equipmentId)
    .is("returned_at", null)
    .maybeSingle();
  return data;
}
