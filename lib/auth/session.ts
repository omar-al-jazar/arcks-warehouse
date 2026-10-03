import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StaffRole } from "@/lib/supabase/types";
import { homeFor } from "./roles";

export type Profile = { id: string; name: string; role: StaffRole };

/**
 * The signed-in user's profile, or null. Wrapped in React `cache()` so the
 * Auth round-trip and profiles query run once per request no matter how many
 * layouts, pages and actions ask.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("id", user.id)
    .single();

  return profile;
});

/**
 * For Server Actions: the profile if signed in with one of `roles`, otherwise
 * null — the caller returns its own action-specific error.
 */
export async function authorize(roles: readonly StaffRole[]): Promise<Profile | null> {
  const profile = await getCurrentProfile();
  return profile && roles.includes(profile.role) ? profile : null;
}

/**
 * For layouts and pages: the profile, or a redirect — to /login when signed
 * out, to the user's own home when their role isn't allowed here.
 */
export async function requireRole(roles: readonly StaffRole[]): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!roles.includes(profile.role)) redirect(homeFor(profile.role));
  return profile;
}
