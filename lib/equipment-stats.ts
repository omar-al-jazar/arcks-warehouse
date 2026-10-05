import { EQUIPMENT_CATEGORIES } from "@/lib/constants";
import type { EquipmentCategory, EquipmentStatus } from "@/lib/supabase/types";

/** One row of public.equipment_status_counts(): how many items share a category and status. */
export type StatusCountRow = { category: EquipmentCategory; status: EquipmentStatus; count: number };

export type StatusTally = { total: number; available: number; checkedOut: number; maintenance: number };

export type EquipmentStats = StatusTally & { byCategory: Record<EquipmentCategory, StatusTally> };

const TALLY_FIELD = {
  available: "available",
  checked_out: "checkedOut",
  maintenance: "maintenance",
} as const satisfies Record<EquipmentStatus, keyof StatusTally>;

const emptyTally = (): StatusTally => ({ total: 0, available: 0, checkedOut: 0, maintenance: 0 });

/** Folds the database's grouped counts into the shape the dashboard renders. */
export function summarizeStatusCounts(rows: StatusCountRow[]): EquipmentStats {
  const byCategory = Object.fromEntries(
    EQUIPMENT_CATEGORIES.map(({ value }) => [value, emptyTally()])
  ) as Record<EquipmentCategory, StatusTally>;
  const stats: EquipmentStats = { ...emptyTally(), byCategory };

  for (const { category, status, count } of rows) {
    for (const tally of [stats, byCategory[category]]) {
      tally.total += count;
      tally[TALLY_FIELD[status]] += count;
    }
  }
  return stats;
}
