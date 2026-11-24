import { requireRole } from "@/lib/auth/session";
import { OWNER_ONLY } from "@/lib/auth/roles";
import NavBar from "@/components/nav-bar";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function OwnerLayout({ children }: LayoutProps<"/owner">) {
  const profile = await requireRole(OWNER_ONLY);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        title="Owner"
        name={profile.name}
        links={[
          { href: "/owner", label: "Dashboard" },
          { href: "/owner/inventory", label: "Inventory" },
          { href: "/owner/orders", label: "Orders" },
          { href: "/owner/bookings", label: "Bookings" },
          { href: "/owner/calendar", label: "Calendar" },
          { href: "/owner/staff", label: "Staff" },
          { href: "/owner/settings", label: "Settings" },
        ]}
      />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
