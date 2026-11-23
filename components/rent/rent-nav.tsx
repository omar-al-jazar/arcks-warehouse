import Link from "next/link";

export default function RentNav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-4">
        <Link href="/rent" className="mr-auto flex items-center gap-2.5 text-foreground">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 7h12v10H3z" />
              <path d="M15 11l6-3v8l-6-3z" />
            </svg>
          </span>
          <span className="font-heading text-[17px] font-bold">[YOUR BRAND]</span>
        </Link>
        <p className="text-[13px] text-muted-foreground">
          Need help? <span className="font-semibold text-primary">WhatsApp us</span>
        </p>
      </div>
    </header>
  );
}
