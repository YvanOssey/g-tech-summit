-- G-TECH SUMMIT 2026 — entrance control (phase 10).
-- Run once in the Supabase SQL Editor, after 0004_registrations_admin.sql.
--
-- A two-day pass is checked once PER DAY: one row per ticket and per day.
-- A second scan the same day is refused by the unique constraint.

create table public.ticket_checkins (
  id         bigint generated always as identity primary key,
  ticket_id  uuid not null references public.tickets (id) on delete cascade,
  day        smallint not null check (day in (1, 2)),
  checked_at timestamptz not null default now(),
  checked_by uuid references public.admin_users (id) on delete set null,
  unique (ticket_id, day)
);

alter table public.ticket_checkins enable row level security;

create policy "checkins: admins read" on public.ticket_checkins
  for select to authenticated using (public.is_admin());
create policy "checkins: admins record as themselves" on public.ticket_checkins
  for insert to authenticated with check (public.is_admin() and checked_by = (select auth.uid()));
-- Undo a scan made by mistake.
create policy "checkins: admins undo" on public.ticket_checkins
  for delete to authenticated using (public.is_admin());
