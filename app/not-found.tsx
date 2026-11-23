import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md items-center gap-3 p-8 text-center">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="font-heading text-lg font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">That page doesn&rsquo;t exist, or it has moved.</p>
        <Link href="/" className={buttonVariants({ className: "mt-2" })}>
          Back to ARC
        </Link>
      </Card>
    </div>
  );
}
