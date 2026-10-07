-- G-TECH SUMMIT 2026 — optional two-factor authentication (phase 10).
-- Run once in the Supabase SQL Editor, after 0005_checkins.sql.
--
-- An admin who turned on two-factor authentication only counts as an admin
-- once the 6-digit code has been entered (session level "aal2"). Without the
-- code, the password alone gives access to no admin data, even through the
-- API. Admins without two-factor authentication are not affected.

create or replace function public.mfa_satisfied() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select auth.jwt()->>'aal'), 'aal1') = 'aal2'
      or not exists (
        select 1 from auth.mfa_factors f
        where f.user_id = (select auth.uid()) and f.status = 'verified'
      );
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_users
    where id = (select auth.uid()) and active
  ) and public.mfa_satisfied();
$$;

create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_users
    where id = (select auth.uid()) and active and role = 'SUPER_ADMIN'
  ) and public.mfa_satisfied();
$$;

revoke execute on function public.mfa_satisfied() from public, anon;
grant execute on function public.mfa_satisfied() to authenticated;
