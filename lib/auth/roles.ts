import type { StaffRole } from "@/lib/supabase/types";

export const OWNER_ONLY: readonly StaffRole[] = ["owner"];
export const STAFF: readonly StaffRole[] = ["owner", "manager"];

export function homeFor(role: StaffRole) {
  return role === "owner" ? "/owner" : "/manager";
}
