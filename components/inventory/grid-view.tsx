import type { Equipment } from "@/lib/supabase/types";
import ZoomableImage from "@/components/zoomable-image";
import CategorySection, { type CategoryGroup } from "./category-section";
import EquipmentActions from "./equipment-actions";
import StatusBadge from "./status-badge";

export default function GridView({ groups }: { groups: CategoryGroup[] }) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <CategorySection key={group.value} label={group.label} count={group.items.length}>
          {group.items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No {group.label.toLowerCase()} equipment matches these filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4">
              {group.items.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </CategorySection>
      ))}
    </div>
  );
}

function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-border p-2">
      <ZoomableImage src={item.image_url} alt={item.name} className="aspect-square w-full" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight" title={item.name}>
          {item.name}
        </p>
        <p className="truncate font-mono text-xs text-muted-foreground">{item.barcode}</p>
      </div>
      <StatusBadge status={item.status} />
      <EquipmentActions item={item} />
    </div>
  );
}
