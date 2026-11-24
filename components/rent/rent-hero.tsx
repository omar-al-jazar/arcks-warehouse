import Link from "next/link";
import type { RentCopy } from "@/lib/rent/i18n";

export default function RentHero({ copy }: { copy: RentCopy }) {
  return (
    <section className="rent-hero relative isolate min-h-[min(92vh,720px)] w-full overflow-hidden">
      <div className="rent-hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="rent-hero-grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[min(92vh,720px)] w-full max-w-6xl flex-col justify-end gap-6 px-6 pb-16 pt-24">
        <p className="rent-hero-brand font-heading text-sm font-bold tracking-[0.2em] text-primary uppercase">
          {copy.heroBrand}
        </p>
        <h1 className="rent-hero-title max-w-[14ch] font-heading text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          {copy.heroHeadline}
        </h1>
        <p className="rent-hero-support max-w-[36ch] text-base text-muted-foreground sm:text-lg">
          {copy.heroSupport}
        </p>
        <div className="rent-hero-cta">
          <Link
            href="#gear"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            {copy.heroCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
