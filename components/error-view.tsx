"use client";

import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ErrorView({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card role="alert" className="mx-auto w-full max-w-md items-center gap-3 p-8 text-center">
      <TriangleAlertIcon className="size-8 text-warn" />
      <h1 className="font-heading text-lg font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        We couldn&rsquo;t load this page. Try again &mdash; if it keeps happening, let the owner know.
      </p>
      {/* Matches this failure to the server log entry. */}
      {error.digest ? <p className="font-mono text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
      <Button className="mt-2" onClick={retry}>
        Try again
      </Button>
    </Card>
  );
}
