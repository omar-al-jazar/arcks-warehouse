"use client";

import { useActionState, useState } from "react";
import { updateEquipment, type EquipmentFormState } from "@/app/actions/equipment-actions";
import type { EquipmentCategory, KitContentItem } from "@/lib/supabase/types";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";
import { MAX_KIT_ITEMS, MAX_KIT_QTY, MIN_KIT_QTY } from "@/lib/schemas/equipment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";

const initialState: EquipmentFormState = {};

type KitRow = { key: string; label: string; qty: string };

function toRows(items: KitContentItem[]): KitRow[] {
  return items.map((item, index) => ({
    key: `kit-${index}-${item.label}`,
    label: item.label,
    qty: String(item.qty),
  }));
}

function rowsToJson(rows: KitRow[]): string {
  // Drop blank labels on submit; the server schema still validates the rest.
  const items = rows
    .map((row) => ({ label: row.label.trim(), qty: Number(row.qty) }))
    .filter((item) => item.label.length > 0);
  return JSON.stringify(items);
}

export default function EditEquipmentButton({
  equipmentId,
  name,
  category,
  serialNumber,
  imageUrl,
  dayRateSar,
  kitContents,
}: {
  equipmentId: number;
  name: string;
  category: EquipmentCategory;
  serialNumber: string | null;
  imageUrl: string | null;
  dayRateSar: number | null;
  kitContents: KitContentItem[];
}) {
  const [open, setOpen] = useState(false);
  const [kitRows, setKitRows] = useState<KitRow[]>(() => toRows(kitContents));
  const [state, formAction, pending] = useActionState(async (prev: EquipmentFormState, formData: FormData) => {
    const result = await updateEquipment(prev, formData);
    if (result.success) setOpen(false);
    return result;
  }, initialState);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setKitRows(toRows(kitContents));
  }

  function updateRow(key: string, patch: Partial<Pick<KitRow, "label" | "qty">>) {
    setKitRows((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function removeRow(key: string) {
    setKitRows((rows) => rows.filter((row) => row.key !== key));
  }

  function addRow() {
    if (kitRows.length >= MAX_KIT_ITEMS) return;
    setKitRows((rows) => [...rows, { key: `kit-new-${Date.now()}`, label: "", qty: "1" }]);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-muted-foreground underline">
        Edit
      </button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit equipment</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="equipmentId" value={equipmentId} />
          <input type="hidden" name="kitContents" value={rowsToJson(kitRows)} />
          <FieldGroup className="gap-3">
            <Field>
              <FieldLabel htmlFor="edit-name">Name</FieldLabel>
              <Input id="edit-name" name="name" defaultValue={name} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-category">Category</FieldLabel>
              <NativeSelect id="edit-category" name="category" defaultValue={category} className="w-full">
                {EQUIPMENT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-serial">Serial number</FieldLabel>
              <Input id="edit-serial" name="serialNumber" defaultValue={serialNumber ?? ""} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-image">Image URL</FieldLabel>
              <Input id="edit-image" name="imageUrl" defaultValue={imageUrl ?? ""} placeholder="/equipment/name.jpg or https://..." />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-day-rate">Day rate (SAR)</FieldLabel>
              <Input
                id="edit-day-rate"
                name="dayRate"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                defaultValue={dayRateSar ?? ""}
              />
              <FieldDescription>Shown on the public rental page. Leave blank until you have a price.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>What arrives</FieldLabel>
              <FieldDescription>
                Kit contents shown with this piece. Leave empty if it rents alone.
              </FieldDescription>
              <div className="mt-2 flex flex-col gap-2">
                {kitRows.map((row, index) => (
                  <div key={row.key} className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <FieldLabel htmlFor={`kit-label-${row.key}`} className="sr-only">
                        Item {index + 1} name
                      </FieldLabel>
                      <Input
                        id={`kit-label-${row.key}`}
                        value={row.label}
                        onChange={(event) => updateRow(row.key, { label: event.target.value })}
                        placeholder="e.g. Light stand"
                        maxLength={120}
                      />
                    </div>
                    <div className="w-20 shrink-0">
                      <FieldLabel htmlFor={`kit-qty-${row.key}`} className="sr-only">
                        Item {index + 1} qty
                      </FieldLabel>
                      <Input
                        id={`kit-qty-${row.key}`}
                        type="number"
                        inputMode="numeric"
                        min={MIN_KIT_QTY}
                        max={MAX_KIT_QTY}
                        step="1"
                        value={row.qty}
                        onChange={(event) => updateRow(row.key, { qty: event.target.value })}
                        aria-label={`Qty for item ${index + 1}`}
                      />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeRow(row.key)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={addRow}
                  disabled={kitRows.length >= MAX_KIT_ITEMS}
                >
                  Add item
                </Button>
              </div>
            </Field>
          </FieldGroup>

          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

          <DialogFooter className="-mx-0 -mb-0 border-t-0 bg-transparent p-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="flex-1">
              {pending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
