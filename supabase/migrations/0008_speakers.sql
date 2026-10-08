-- G-TECH SUMMIT 2026 — speakers (panelists, moderators, conference speakers, trainers).
-- Run once in the Supabase SQL Editor, after 0007_settings_public_columns.sql.
--
-- Each speaker is attached to one session of /programme: a conference
-- (conference-1…3), a panel (panel-1…2) or a formation (form-1…4). The list
-- of sessions lives in the code (src/content/speakers.ts). Photos are stored
-- in the public bucket "speakers"; only admins can upload or remove them.

create table public.speakers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 2 and 120),
  -- Job and organisation, shown under the name ("Directrice digitale, Orange CI").
  role         text check (role is null or char_length(role) <= 160),
  -- Part in the session.
  kind         text not null default 'speaker' check (kind in ('speaker', 'panelist', 'moderator', 'trainer')),
  session_ref  text not null check (session_ref ~ '^[a-z0-9-]{1,40}$'),
  photo_path   text,
  photo_width  integer check (photo_width is null or photo_width > 0),
  photo_height integer check (photo_height is null or photo_height > 0),
  position     integer not null default 0,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger speakers_updated_at before update on public.speakers
  for each row execute function public.set_updated_at();

alter table public.speakers enable row level security;

create policy "speakers: visitors read published" on public.speakers
  for select to anon using (published);
create policy "speakers: signed-in read published or all if admin" on public.speakers
  for select to authenticated using (published or public.is_admin());
create policy "speakers: admins write" on public.speakers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── Photos ───────────────────────────────────────────────────────────────
-- Public bucket (the site shows the photos), 2.5 MB, PNG / JPEG / WebP only.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('speakers', 'speakers', true, 2621440, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "speaker photos: admins read" on storage.objects
  for select to authenticated using (bucket_id = 'speakers' and public.is_admin());
create policy "speaker photos: admins upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'speakers' and public.is_admin());
create policy "speaker photos: admins replace" on storage.objects
  for update to authenticated using (bucket_id = 'speakers' and public.is_admin()) with check (bucket_id = 'speakers' and public.is_admin());
create policy "speaker photos: admins remove" on storage.objects
  for delete to authenticated using (bucket_id = 'speakers' and public.is_admin());
