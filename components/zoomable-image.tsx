"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ZoomableImage({
  src,
  alt,
  className,
  fit = "cover",
}: {
  src: string | null;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return <div className={cn("rounded bg-muted", className)} />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge ${alt}`}
        className={cn(
          "relative block cursor-zoom-in overflow-hidden rounded bg-muted transition-opacity hover:opacity-80",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- external, unpredictable source */}
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 size-full", fit === "cover" ? "object-cover" : "object-contain")}
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(90vw,48rem)] border-0 bg-transparent p-0 ring-0 sm:max-w-[min(90vw,48rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- external, unpredictable source */}
          <img src={src} alt={alt} className="max-h-[85vh] w-full rounded-lg bg-muted object-contain" />
        </DialogContent>
      </Dialog>
    </>
  );
}
