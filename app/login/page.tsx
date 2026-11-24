import LoginForm from "@/components/login-form";
import { safeRedirectPath } from "@/lib/security/safe-redirect";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const raw = typeof params.next === "string" ? params.next : undefined;
  const next = raw ? safeRedirectPath(raw, "") || undefined : undefined;

  return <LoginForm next={next} />;
}
