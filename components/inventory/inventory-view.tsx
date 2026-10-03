"use client";

import { useState } from "react";
import type { Equipment } from "@/lib/supabase/types";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ListIcon, LayoutGridIcon, GalleryHorizontalIcon } from "lucide-react";
import type { CategoryGroup } from "./category-section";
import ListView from "./list-view";
import GridView from "./grid-view";
import GalleryView from "./gallery-view";

const VIEWS = [
  { value: "list", label: "List", Icon: ListIcon },
  { value: "grid", label: "Grid", Icon: LayoutGridIcon },
  { value: "gallery", label: "Gallery", Icon: GalleryHorizontalIcon },
] as const;

type View = (typeof VIEWS)[number]["value"];

export default function InventoryView({ items }: { items: Equipment[] }) {
  const [view, setView] = useState<View>("list");

  const groups: CategoryGroup[] = EQUIPMENT_CATEGORIES.map(({ value, shortLabel }) => ({
    value,
    label: shortLabel,
    items: items.filter((item) => item.category === value),
  }));

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        value={[view]}
        onValueChange={(next) => {
          // Re-pressing the active toggle yields an empty array; keep the current view.
          const chosen = VIEWS.find((v) => v.value === next[0]);
          if (chosen) setView(chosen.value);
        }}
      >
        {VIEWS.map(({ value, label, Icon }) => (
          <ToggleGroupItem key={value} value={value} aria-label={`${label} view`}>
            <Icon data-icon="inline-start" />
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {view === "list" && <ListView groups={groups} />}
      {view === "grid" && <GridView groups={groups} />}
      {view === "gallery" && <GalleryView items={items} />}
    </div>
  );
}
