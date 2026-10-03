import Link from "next/link";
import { getAllEquipment } from "@/lib/supabase/queries";
import AddEquipmentForm from "@/components/add-equipment-form";
import PhotoAddEquipment from "@/components/photo-add-equipment";
import CollapsibleSection from "@/components/collapsible-section";
import InventoryView from "@/components/inventory/inventory-view";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { PrinterIcon } from "lucide-react";

export default async function InventoryPage({
  searchParams,
}: PageProps<"/owner/inventory">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "";
  const search = typeof params.search === "string" ? params.search : "";

  const items = await getAllEquipment({ status, search });

  return (
    <div className="flex flex-col gap-6">
      <CollapsibleSection title="Add equipment">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Add from a photo</h3>
            <PhotoAddEquipment />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Add manually</h3>
            <AddEquipmentForm />
          </div>
        </div>
      </CollapsibleSection>

      <Card className="flex-row flex-wrap items-center gap-3 p-5">
        <form className="flex flex-1 flex-wrap items-center gap-3">
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search name or barcode"
            className="min-w-[180px] flex-1"
          />
          <NativeSelect name="status" defaultValue={status}>
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="checked_out">Checked out</option>
            <option value="maintenance">Maintenance</option>
          </NativeSelect>
          <Button type="submit">Filter</Button>
        </form>
        <Link
          href="/owner/inventory/labels"
          aria-label="Print barcode labels"
          title="Print barcode labels"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <PrinterIcon />
        </Link>
      </Card>

      <InventoryView items={items} />
    </div>
  );
}
