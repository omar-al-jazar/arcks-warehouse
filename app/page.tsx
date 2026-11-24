import { redirect } from "next/navigation";
import { homeFor } from "@/lib/auth/roles";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function Home() {
  const profile = await getCurrentProfile();
  // Staff keep their own door. Visitors land on the rental catalog.
  if (profile) redirect(homeFor(profile.role));
  redirect("/rent");
}
