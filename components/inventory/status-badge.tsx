import { Badge } from "@/components/ui/badge";
import type { EquipmentStatus } from "@/lib/supabase/types";

const VARIANT: Record<EquipmentStatus, "good" | "warn" | "secondary"> = {
  available: "good",
  checked_out: "warn",
  maintenance: "secondary",
};

export default function StatusBadge({ status, className }: { status: EquipmentStatus; className?: string }) {
  return (
    <Badge variant={VARIANT[status]} className={className}>
      {status.replace("_", " ")}
    </Badge>
  );
}
