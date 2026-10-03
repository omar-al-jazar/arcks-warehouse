import type { EquipmentCategory, Equipment } from "@/lib/supabase/types";
import { Card } from "@/components/ui/card";

export type CategoryGroup = {
  value: EquipmentCategory;
  label: string;
  items: Equipment[];
};

export default function CategorySection({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden py-0">
      <h2 className="border-b px-4 py-3 text-sm font-semibold text-muted-foreground">
        {label} <span className="text-muted-foreground/60">({count})</span>
      </h2>
      {children}
    </Card>
  );
}
