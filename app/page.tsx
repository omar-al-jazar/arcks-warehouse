import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { homeFor } from "@/lib/auth/roles";
import { buttonVariants } from "@/components/ui/button";
import ArcMark from "@/components/arc-mark";

const departments = [
  { name: "Camera", detail: "Bodies, lenses, monitors, wireless video." },
  { name: "Light", detail: "Fixtures, softboxes, tube lights, effects." },
  { name: "Grip", detail: "Stands, flags, apple boxes, the odds and ends." },
];

export default async function Home() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homeFor(profile.role));

  return (
    <main className="arc-bay flex min-h-screen flex-col justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-8">
        <ArcMark size="lg" />
        <div className="flex max-w-[28rem] flex-col gap-3">
          <h1 className="text-3xl font-medium leading-tight">Every piece of gear, from checkout to return.</h1>
          <p className="text-muted-foreground">Scan it out, scan it back, and see who has it.</p>
        </div>
        <Link href="/login" className={buttonVariants({ size: "lg" })}>
          Sign in
        </Link>
        <ul className="grid w-full gap-6 border-t border-border pt-6 sm:grid-cols-3">
          {departments.map((department) => (
            <li key={department.name} className="flex flex-col gap-1">
              <p className="font-medium">{department.name}</p>
              <p className="text-sm text-muted-foreground">{department.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
