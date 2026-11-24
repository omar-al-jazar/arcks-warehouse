import localFont from "next/font/local";
import RentNav from "@/components/rent/rent-nav";
import { rentCopy } from "@/lib/rent/i18n";
import { getRentLocale } from "@/lib/rent/locale";

/** Self-hosted Thmanyah — no Google Fonts fetch at Docker build time. */
const thmanyahSans = localFont({
  src: [
    { path: "../../public/fonts/thmanyah/thmanyahsans-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/thmanyah/thmanyahsans-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/thmanyah/thmanyahsans-Bold.woff2", weight: "700" },
    { path: "../../public/fonts/thmanyah/thmanyahsans-Black.woff2", weight: "900" },
  ],
  variable: "--font-body",
  display: "swap",
});

const thmanyahDisplay = localFont({
  src: [
    { path: "../../public/fonts/thmanyah/thmanyahserifdisplay-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/thmanyah/thmanyahserifdisplay-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/thmanyah/thmanyahserifdisplay-Bold.woff2", weight: "700" },
    { path: "../../public/fonts/thmanyah/thmanyahserifdisplay-Black.woff2", weight: "900" },
  ],
  variable: "--font-display",
  display: "swap",
});

export default async function RentLayout({ children }: LayoutProps<"/rent">) {
  const locale = await getRentLocale();
  const copy = rentCopy(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      className={`rent ${thmanyahSans.variable} ${thmanyahDisplay.variable} min-h-screen`}
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
