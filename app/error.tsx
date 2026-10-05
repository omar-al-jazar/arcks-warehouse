"use client";

import ErrorView from "@/components/error-view";

export default function RootError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ErrorView {...props} />
    </div>
  );
}
