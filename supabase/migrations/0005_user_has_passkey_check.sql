-- Expose "does the current user have a registered passkey?" to the app
-- without exposing the `auth` schema itself.
--
-- Why: the login flow wants to offer a one-time "set up Face ID / Touch ID"
-- prompt after a successful PIN login, but only if this account doesn't
-- already have one enrolled. The credentials live in
-- auth.webauthn_credentials, which PostgREST doesn't expose (by design —
-- the `auth` schema isn't part of the API surface). A SECURITY DEFINER
-- function is the standard Supabase pattern for handing back a narrow,
-- safe answer derived from `auth.*` without exposing the schema itself.
--
-- Scoped to auth.uid() (the caller's own session) rather than taking a
-- user_id parameter, so any authenticated user can only ever check their
-- own enrollment status — never anyone else's.
--
-- Run e.g.:
--   docker compose exec -T db psql -U postgres -d postgres < supabase/migrations/0005_user_has_passkey_check.sql

create or replace function public.user_has_passkey()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from auth.webauthn_credentials
    where user_id = auth.uid()
  );
$$;

grant execute on function public.user_has_passkey() to authenticated;
