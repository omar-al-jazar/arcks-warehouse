"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { dbErrorMessage } from "@/lib/supabase/errors";
import { authorize } from "@/lib/auth/session";
import { OWNER_ONLY } from "@/lib/auth/roles";
import { parseForm } from "@/lib/validation";
import { createStaffSchema } from "@/lib/schemas/staff";

export type StaffFormState = {
  error?: string;
  success?: boolean;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

export async function createStaff(
  _prevState: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  if (!(await authorize(OWNER_ONLY))) {
    return { error: "Only the owner can add staff." };
  }

  const parsed = parseForm(createStaffSchema, formData);
  if (!parsed.ok) return { error: parsed.error };
  const { name, role, pin } = parsed.data;

  const admin = createAdminClient();

  const slug = slugify(name) || "staff";
  let email = `${slug}@arcks-warehouse.local`;
  let attempt = 1;
  while (true) {
    const { data: existing } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
    if (!existing) break;
    attempt += 1;
    email = `${slug}${attempt}@arcks-warehouse.local`;
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: pin,
    email_confirm: true,
    app_metadata: { role },
  });

  if (createError || !created.user) {
    console.error("[staff] createUser failed:", createError);
    return { error: "Couldn't create the account. Try again." };
  }

  const { error: profileError } = await admin
    .from("profiles")
    .insert({ id: created.user.id, name, role, email });

  if (profileError) {
    // Clean up the orphaned auth user rather than leaving an account with no profile.
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: dbErrorMessage(profileError, "Couldn't create the account. Try again.") };
  }

  revalidatePath("/owner/staff");
  return { success: true };
}
