import { Inter, Space_Grotesk } from "next/font/google";
import RentNav from "@/components/rent/rent-nav";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RentLayout({ children }: LayoutProps<"/rent">) {
  return (
    <div className={`rent ${display.variable} ${body.variable} min-h-screen`}>
      <RentNav />
      {children}
    </div>
  );
}
