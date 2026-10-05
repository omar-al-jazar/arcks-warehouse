import { Skeleton } from "@/components/ui/skeleton";

// Deliberately generic — a heading line and two content blocks. Each section
// shares one loading.tsx across pages with different layouts, so a shape
// tailored to one page would flash and change on the others.
export default function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col gap-6">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
      <span className="sr-only">Loading&hellip;</span>
    </div>
  );
}
