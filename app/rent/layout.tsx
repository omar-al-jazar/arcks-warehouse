import { IBM_Plex_Sans_Arabic, Space_Grotesk } from "next/font/google";
import RentNav from "@/components/rent/rent-nav";
import { rentCopy } from "@/lib/rent/i18n";
import { getRentLocale } from "@/lib/rent/locale";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-body",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function RentLayout({ children }: LayoutProps<"/rent">) {
  const locale = await getRentLocale();
  const copy = rentCopy(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      className={`rent ${display.variable} ${arabic.variable} min-h-screen`}
      lang={locale}
      dir={dir}
      data-locale={locale}
    >
      <RentNav locale={locale} />
      {children}
      <span className="sr-only">{copy.brandPlaceholder}</span>
    </div>
  );
}
