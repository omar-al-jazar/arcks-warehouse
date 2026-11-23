import Link from "next/link";
import { connection } from "next/server";
import { listPublicGear } from "@/lib/rent/catalog";
import type { EquipmentCategory } from "@/lib/supabase/types";

const ORDER: EquipmentCategory[] = ["camera", "lighting", "grip"];
const LABEL: Record<EquipmentCategory, string> = {
  camera: "Camera",
  lighting: "Lighting",
  grip: "Grip",
};

export const metadata = { title: "Gear — [YOUR BRAND]" };

export default async function RentIndexPage() {
  // Without this the page is prerendered at build time, and the gear list and statuses never change.
  await connection();
  const gear = await listPublicGear();
  const groups = ORDER.map((category) => ({
    category,
    items: gear.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8">
      <div className="flex max-w-xl flex-col gap-2">
        <h1 className="font-heading text-4xl font-bold">The gear</h1>
        <p className="text-muted-foreground">Every piece in the warehouse. Open one to see the price, the dates, and reserve it.</p>
      </div>
      {groups.length === 0 ? (
        <p className="text-muted-foreground">No gear is listed yet.</p>
      ) : (
        groups.map((group) => (
          <section key={group.category} id={group.category} className="flex flex-col gap-3">
            <h2 className="font-heading text-xl">{LABEL[group.category]}</h2>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {group.items.map((item) => (
                <li key={item.barcode}>
                  <Link href={`/rent/${item.barcode}`} className="flex items-center justify-between gap-4 bg-card px-4 py-3">
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.barcode}</span>
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">{statusLabel(item.status)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}

function statusLabel(status: string) {
  if (status === "available") return "In the warehouse";
  if (status === "checked_out") return "Out";
  return "Maintenance";
}
