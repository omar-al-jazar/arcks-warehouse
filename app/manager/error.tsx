"use client";

import ErrorView from "@/components/error-view";

// Renders inside the manager layout, so the nav bar stays usable.
export default function ManagerError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorView {...props} />;
}
