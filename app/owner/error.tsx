"use client";

import ErrorView from "@/components/error-view";

// A segment's error.tsx renders inside that segment's layout, so the owner
// nav bar stays usable when a page fails.
export default function OwnerError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorView {...props} />;
}
