import Image from "next/image";
import HeroScrollLink from "@/components/rent/hero-scroll-link";
import type { RentCopy } from "@/lib/rent/i18n";

export default function RentHero({ copy }: { copy: RentCopy }) {
  return (
    <section className="rent-chapter rent-hero relative isolate flex min-h-[100svh] w-full">
      <div className="rent-hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="rent-hero-grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-start justify-end gap-12 px-6 pb-16 pt-24">
        <div className="rent-hero-brand w-[min(420px,78vw)] max-w-full min-w-0">
          <Image
            src="/lighting-lockup.png"
            alt="Lighting Equipment"
            width={1080}
            height={541}
            priority
            sizes="420px"
            className="h-auto w-full"
          />
        </div>
        <h1 className="rent-hero-title max-w-[14ch] font-heading text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          {copy.heroHeadline}
        </h1>
        <div className="rent-hero-cta">
          <HeroScrollLink
            href="#camera"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground"
          >
            {copy.heroCta}
          </HeroScrollLink>
        </div>
      </div>
    </section>
  );
}
