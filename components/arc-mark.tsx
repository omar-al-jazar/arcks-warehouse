import { cn } from "cn";

const sizeClass = {
  sm: { arc: "h-1.5 w-7", word: "text-sm" },
  md: { arc: "h-2.5 w-10", word: "text-2xl" },
  lg: { arc: "h-4 w-16", word: "text-5xl" },
} as const;

export default function ArcMark({
  size = "md",
  className,
}: {
  size?: keyof typeof sizeClass;
  className?: string;
}) {
  const scale = sizeClass[size];

  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <svg viewBox="0 0 64 16" className={cn(scale.arc, "text-primary")} aria-hidden="true">
        <path
          d="M2 14 Q32 0 62 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className={cn("font-heading font-bold leading-none tracking-tight", scale.word)}>ARC</span>
    </span>
  );
}
