import Image from "next/image";
import Link from "next/link";
import LocaleSwitch from "@/components/rent/locale-switch";
import { rentCopy, type RentLocale } from "@/lib/rent/i18n";

export default function RentNav({ locale }: { locale: RentLocale }) {
  const copy = rentCopy(locale);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-4">
        <Link href="/rent" className="mr-auto" aria-label="Lighting Equipment">
          <Image
            src="/lighting-mark.png"
            alt=""
            width={400}
            height={541}
            className="h-10 w-10 object-contain"
          />
        </Link>
        <Link href="/login" className="text-[13px] text-muted-foreground hover:text-foreground">
          {copy.navAdmin}
        </Link>
        <LocaleSwitch locale={locale} label={copy.localeSwitchTo} />
        <p className="text-[13px] text-muted-foreground">
          {copy.navHelp} <span className="font-semibold text-primary">{copy.navWhatsapp}</span>
        </p>
      </div>
    </header>
  );
}
