-- G-TECH SUMMIT 2026 — initial schema (phase 1 of the back office).
--
-- Run once in the Supabase SQL Editor (or `supabase db push`).
--
-- Access model:
--   anon / visitors   → read published content and the public settings only;
--   authenticated     → nothing, unless listed in admin_users (is_admin());
--   service role      → server only: checkout, payment webhook, seeding.
-- Every table has Row Level Security enabled. Nothing is deleted from the
-- registration tables: participants are anonymised, orders change status.
--
-- Prices and capacities are NOT stored here: src/config/passes.ts stays the
-- single source of truth and the server copies the price into order_items.

-- ── Types ────────────────────────────────────────────────────────────────

create type public.admin_role as enum ('SUPER_ADMIN', 'ADMIN');

-- Same ids as PassId in src/config/passes.ts.
create type public.pass_id as enum ('online', 'event', 'hackathon');

create type public.order_status as enum ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED', 'EXPIRED');

create type public.ticket_status as enum ('VALID', 'USED', 'CANCELLED');

-- Same values as SessionType in src/content/programme.ts.
create type public.session_type as enum (
  'accueil', 'ouverture', 'conference', 'panel', 'formation', 'atelier',
  'quiz', 'pitch', 'cloture', 'networking', 'pause'
);

-- ── Helpers ──────────────────────────────────────────────────────────────

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Administrators ───────────────────────────────────────────────────────

create table public.admin_users (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text not null unique,
  full_name       text,
  role            public.admin_role not null default 'ADMIN',
  active          boolean not null default true,
  last_sign_in_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Security definer so policies can call them without recursing into RLS.
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_users
    where id = (select auth.uid()) and active
  );
$$;

create function public.is_super_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_users
    where id = (select auth.uid()) and active and role = 'SUPER_ADMIN'
  );
$$;

create table public.audit_log (
  id         bigint generated always as identity primary key,
  admin_id   uuid references public.admin_users (id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  text,
  -- Field names and non-sensitive values only: never payment data.
  changes    jsonb,
  created_at timestamptz not null default now()
);

-- ── Registrations ────────────────────────────────────────────────────────

create table public.participants (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  phone       text,
  consent_at  timestamptz,
  -- Internal note, visible to admins only.
  notes       text,
  -- Set when the person asks to be forgotten; personal fields are blanked.
  anonymised_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index participants_email_idx on public.participants (lower(email));
create index participants_created_idx on public.participants (created_at desc);

-- One order = one buyer.
create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  -- Human-readable, e.g. GTS-7K3Q9P.
  reference      text not null unique,
  participant_id uuid not null references public.participants (id) on delete restrict,
  status         public.order_status not null default 'PENDING',
  -- FCFA, integer, computed by the server from src/config/passes.ts.
  total          integer not null check (total >= 0),
  currency       text not null default 'XOF',
  -- A pending order holds its places until then.
  expires_at     timestamptz,
  paid_at        timestamptz,
  cancelled_at   timestamptz,
  refunded_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index orders_status_idx on public.orders (status);
create index orders_created_idx on public.orders (created_at desc);
create index orders_participant_idx on public.orders (participant_id);

create table public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  pass_id    public.pass_id not null,
  -- Price at the time of purchase.
  unit_price integer not null check (unit_price >= 0),
  unique (order_id, pass_id)
);
create index order_items_pass_idx on public.order_items (pass_id);

-- One team per Pass Hackathon. Members are participants (2 or 3, enforced by the server).
create table public.hackathon_teams (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null unique references public.orders (id) on delete restrict,
  name       text not null,
  -- Track code from src/content/hackathon.ts ("01", "02").
  track_code text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hackathon_members (
  team_id        uuid not null references public.hackathon_teams (id) on delete cascade,
  participant_id uuid not null references public.participants (id) on delete restrict,
  is_captain     boolean not null default false,
  primary key (team_id, participant_id)
);

-- Every person gets their own ticket, hackathon members included.
create table public.tickets (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders (id) on delete restrict,
  participant_id uuid not null references public.participants (id) on delete restrict,
  pass_id        public.pass_id not null,
  -- Random secret encoded in the QR code.
  token          text not null unique,
  status         public.ticket_status not null default 'VALID',
  issued_at      timestamptz not null default now(),
  emailed_at     timestamptz,
  checked_in_at  timestamptz,
  checked_in_by  uuid references public.admin_users (id) on delete set null,
  unique (order_id, participant_id, pass_id)
);
create index tickets_participant_idx on public.tickets (participant_id);

-- Payments through Genius Pay. `status` keeps the provider's own value
-- (pending, processing, completed, failed, cancelled, expired).
create table public.payments (
  id                 uuid primary key default gen_random_uuid(),
  order_id           uuid not null references public.orders (id) on delete restrict,
  provider           text not null default 'geniuspay',
  provider_reference text unique,
  status             text not null default 'pending',
  amount             integer not null check (amount >= 0),
  fees               integer,
  payment_method     text,
  checkout_url       text,
  completed_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index payments_order_idx on public.payments (order_id);

-- Raw webhook log: every call is kept, processed at most once.
create table public.payment_events (
  id                 bigint generated always as identity primary key,
  provider_reference text,
  event              text not null,
  payload            jsonb not null,
  signature_valid    boolean not null,
  received_at        timestamptz not null default now(),
  processed_at       timestamptz,
  error              text
);
create index payment_events_ref_idx on public.payment_events (provider_reference);

-- ── Public content ───────────────────────────────────────────────────────

create table public.programme_slots (
  id         uuid primary key default gen_random_uuid(),
  day        smallint not null check (day in (1, 2)),
  start_time time not null,
  end_time   time,
  type       public.session_type not null,
  title      text not null,
  subtitle   text,
  detail     text,
  -- Empty = "à annoncer".
  speakers   text,
  -- Stored for the organisers, not shown publicly while the venue is unknown.
  room       text,
  -- Anchor of the detailed description on /programme.
  ref        text,
  position   integer not null default 0,
  published  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index programme_slots_order_idx on public.programme_slots (day, position);

create table public.partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  -- Either a file in /public (e.g. /partners/aiesec.png) or a Storage path.
  logo_path   text not null,
  logo_width  integer not null check (logo_width > 0),
  logo_height integer not null check (logo_height > 0),
  website_url text check (website_url is null or website_url like 'https://%'),
  category    text,
  position    integer not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.faq_items (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  -- Plain text only.
  answer     text not null,
  position   integer not null default 0,
  published  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Single row (id = 1): the undecided settings of src/config/settings.ts.
create table public.event_settings (
  id                     smallint primary key default 1 check (id = 1),
  venue_name             text,
  venue_address          text,
  venue_map_url          text check (venue_map_url is null or venue_map_url like 'https://%'),
  registration_open      boolean not null default false,
  team_size_min          smallint check (team_size_min > 0),
  team_size_max          smallint check (team_size_max >= team_size_min),
  registration_deadline  date,
  challenges_start       date,
  jury                   text[],
  updated_at             timestamptz not null default now(),
  updated_by             uuid references public.admin_users (id) on delete set null
);

-- ── Sales counts for the public gauges ───────────────────────────────────
-- Paid orders, plus pending ones that still hold their places.
-- Hackathon counts teams (one order item per team).

create function public.pass_sales()
returns table (pass_id public.pass_id, sold bigint)
language sql stable security definer set search_path = '' as $$
  select i.pass_id, count(*)
  from public.order_items i
  join public.orders o on o.id = i.order_id
  where o.status = 'PAID'
     or (o.status = 'PENDING' and o.expires_at > now())
  group by i.pass_id;
$$;

-- ── updated_at triggers ──────────────────────────────────────────────────

create trigger admin_users_updated   before update on public.admin_users      for each row execute function public.set_updated_at();
create trigger participants_updated  before update on public.participants     for each row execute function public.set_updated_at();
create trigger orders_updated        before update on public.orders           for each row execute function public.set_updated_at();
create trigger teams_updated         before update on public.hackathon_teams  for each row execute function public.set_updated_at();
create trigger payments_updated      before update on public.payments         for each row execute function public.set_updated_at();
create trigger slots_updated         before update on public.programme_slots  for each row execute function public.set_updated_at();
create trigger partners_updated      before update on public.partners         for each row execute function public.set_updated_at();
create trigger faq_updated           before update on public.faq_items        for each row execute function public.set_updated_at();
create trigger settings_updated      before update on public.event_settings   for each row execute function public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────

alter table public.admin_users       enable row level security;
alter table public.audit_log         enable row level security;
alter table public.participants      enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.hackathon_teams   enable row level security;
alter table public.hackathon_members enable row level security;
alter table public.tickets           enable row level security;
alter table public.payments          enable row level security;
alter table public.payment_events    enable row level security;
alter table public.programme_slots   enable row level security;
alter table public.partners          enable row level security;
alter table public.faq_items         enable row level security;
alter table public.event_settings    enable row level security;

-- Administrators: everyone sees their own row; only super admins see and manage the others.
create policy "admin_users: read own or super admin" on public.admin_users
  for select to authenticated using (id = (select auth.uid()) or public.is_super_admin());
create policy "admin_users: super admin writes" on public.admin_users
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create policy "audit_log: super admin reads" on public.audit_log
  for select to authenticated using (public.is_super_admin());
create policy "audit_log: admins append as themselves" on public.audit_log
  for insert to authenticated with check (public.is_admin() and admin_id = (select auth.uid()));

-- Registration data: admins read and update; inserts come from the server
-- (service role) during checkout. No delete policy on purpose.
create policy "participants: admins read" on public.participants for select to authenticated using (public.is_admin());
create policy "participants: admins update" on public.participants for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "orders: admins read" on public.orders for select to authenticated using (public.is_admin());
create policy "orders: admins update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "order_items: admins read" on public.order_items for select to authenticated using (public.is_admin());
create policy "teams: admins read" on public.hackathon_teams for select to authenticated using (public.is_admin());
create policy "teams: admins update" on public.hackathon_teams for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "members: admins read" on public.hackathon_members for select to authenticated using (public.is_admin());
create policy "tickets: admins read" on public.tickets for select to authenticated using (public.is_admin());
create policy "tickets: admins update" on public.tickets for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "payments: admins read" on public.payments for select to authenticated using (public.is_admin());
create policy "payment_events: super admin reads" on public.payment_events for select to authenticated using (public.is_super_admin());

-- Public content: visitors read what is published; admins manage everything.
create policy "slots: visitors read published" on public.programme_slots for select to anon using (published);
create policy "slots: signed-in read published or all if admin" on public.programme_slots for select to authenticated using (published or public.is_admin());
create policy "slots: admins write" on public.programme_slots for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "partners: visitors read published" on public.partners for select to anon using (published);
create policy "partners: signed-in read published or all if admin" on public.partners for select to authenticated using (published or public.is_admin());
create policy "partners: admins write" on public.partners for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "faq: visitors read published" on public.faq_items for select to anon using (published);
create policy "faq: signed-in read published or all if admin" on public.faq_items for select to authenticated using (published or public.is_admin());
create policy "faq: admins write" on public.faq_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Settings are public information (venue, dates, jury). Admins may edit the
-- hackathon fields; venue and registration opening are super admin only
-- (enforced by the trigger below).
create policy "settings: public reads" on public.event_settings for select to anon, authenticated using (true);
create policy "settings: admins update" on public.event_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

create function public.guard_critical_settings() returns trigger
language plpgsql set search_path = '' as $$
begin
  -- The service role (no auth.uid()) is the server itself and is not restricted.
  if (select auth.uid()) is not null and not public.is_super_admin() and (
       new.registration_open is distinct from old.registration_open
    or new.venue_name        is distinct from old.venue_name
    or new.venue_address     is distinct from old.venue_address
    or new.venue_map_url     is distinct from old.venue_map_url
  ) then
    raise exception 'Seul un super administrateur peut modifier le lieu ou l’ouverture des inscriptions.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger settings_guard before update on public.event_settings
  for each row execute function public.guard_critical_settings();

-- Functions: visitors may only call pass_sales().
revoke execute on function public.pass_sales() from public;
grant execute on function public.pass_sales() to anon, authenticated;
revoke execute on function public.is_admin(), public.is_super_admin() from public, anon;
grant execute on function public.is_admin(), public.is_super_admin() to authenticated;
