import type { Equipment } from "@/lib/supabase/types";
import EditEquipmentButton from "@/components/edit-equipment-button";
import EquipmentRowActions from "@/components/equipment-row-actions";

export default function EquipmentActions({ item }: { item: Equipment }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <EditEquipmentButton
        equipmentId={item.id}
        name={item.name}
        category={item.category}
        serialNumber={item.serial_number}
        imageUrl={item.image_url}
        dayRateSar={item.day_rate_sar}
      />
      <EquipmentRowActions equipmentId={item.id} status={item.status} />
    </div>
  );
}
