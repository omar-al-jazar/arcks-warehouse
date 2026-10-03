import type { EquipmentCategory } from "@/lib/supabase/types";

type CategoryMeta = {
  value: EquipmentCategory;
  /** Full name, used in forms and detail views. */
  label: string;
  /** Compact name, used for section headings and stat rows. */
  shortLabel: string;
};

/** Display order is the order of this array. */
export const EQUIPMENT_CATEGORIES: readonly CategoryMeta[] = [
  { value: "camera", label: "Camera", shortLabel: "Camera" },
  { value: "lighting", label: "Lighting", shortLabel: "Light" },
  { value: "grip", label: "Grip", shortLabel: "Grip" },
];
