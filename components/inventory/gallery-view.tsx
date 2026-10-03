"use client";

import { useState } from "react";
import type { Equipment } from "@/lib/supabase/types";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import ZoomableImage from "@/components/zoomable-image";
import EquipmentActions from "./equipment-actions";
import StatusBadge from "./status-badge";
import { ImageIcon } from "lucide-react";

export default function GalleryView({ items }: { items: Equipment[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  if (!selected) {
    return (
      <Card className="p-6 text-center text-sm text-muted-foreground">No equipment matches these filters.</Card>
    );
  }

  const category = EQUIPMENT_CATEGORIES.find((c) => c.value === selected.category);

  return (
    <Card className="grid grid-cols-1 overflow-hidden py-0 md:grid-cols-[280px_1fr]">
      <ul className="flex max-h-[70vh] flex-col overflow-y-auto border-b border-border md:max-h-[600px] md:border-r md:border-b-0">
        {items.map((item) => (
          <li key={item.id} className="border-b border-border last:border-0">
            <button
              type="button"
              onClick={() => setSelectedId(item.id)}
              aria-current={item.id === selected.id}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted",
                item.id === selected.id && "bg-muted"
              )}
            >
              <Thumbnail src={item.image_url} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{item.name}</span>
                <span className="block truncate font-mono text-xs text-muted-foreground">{item.barcode}</span>
              </span>
              <StatusBadge status={item.status} className="shrink-0" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 p-6">
        {selected.image_url ? (
          <ZoomableImage src={selected.image_url} alt={selected.name} fit="contain" className="aspect-video w-full" />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <ImageIcon className="size-10" />
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-semibold">{selected.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category?.label} · <span className="font-mono">{selected.barcode}</span>
            </p>
          </div>
          <StatusBadge status={selected.status} />
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Serial #</dt>
            <dd>{selected.serial_number ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Notes</dt>
            <dd className="line-clamp-2">{selected.description ?? "—"}</dd>
          </div>
        </dl>

        <EquipmentActions item={selected} />
      </div>
    </Card>
  );
}

// Plain <img>, not ZoomableImage: this sits inside a row <button>, and a
// button can't nest another button.
function Thumbnail({ src }: { src: string | null }) {
  if (!src) return <span className="size-8 shrink-0 rounded bg-muted" />;
  // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable source
  return <img src={src} alt="" className="size-8 shrink-0 rounded object-cover" />;
}
