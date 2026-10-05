"use client";

import "./globals.css";

// Replaces the root layout when it fails, so it must supply its own <html>
// and <body> and pull in the global styles itself. Kept to plain elements:
// this is the last-resort screen and should depend on as little as possible.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center p-4 font-sans">
        <div role="alert" className="w-full max-w-md rounded-xl bg-card p-8 text-center ring-1 ring-foreground/10">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The app hit an unexpected problem. Try again &mdash; if it keeps happening, let the owner know.
          </p>
          {error.digest ? (
            <p className="mt-2 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={retry}
            className="mt-4 h-8 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
