import type { Equipment } from "@/lib/supabase/types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import ZoomableImage from "@/components/zoomable-image";
import CategorySection, { type CategoryGroup } from "./category-section";
import EquipmentActions from "./equipment-actions";
import StatusBadge from "./status-badge";

export default function ListView({ groups }: { groups: CategoryGroup[] }) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <CategorySection key={group.value} label={group.label} count={group.items.length}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Serial #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                    No {group.label.toLowerCase()} equipment matches these filters.
                  </TableCell>
                </TableRow>
              ) : (
                group.items.map((item) => <EquipmentRow key={item.id} item={item} />)
              )}
            </TableBody>
          </Table>
        </CategorySection>
      ))}
    </div>
  );
}

function EquipmentRow({ item }: { item: Equipment }) {
  return (
    <TableRow>
      <TableCell>
        <ZoomableImage src={item.image_url} alt={item.name} className="size-8" />
      </TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="font-mono text-muted-foreground">{item.barcode}</TableCell>
      <TableCell className="text-muted-foreground">{item.serial_number ?? "—"}</TableCell>
      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell>
        <EquipmentActions item={item} />
      </TableCell>
    </TableRow>
  );
}
