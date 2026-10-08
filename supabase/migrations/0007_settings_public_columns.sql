-- G-TECH SUMMIT 2026 — event settings: visitors read only public columns (audit F-11).
-- Run once in the Supabase SQL Editor, after 0006_mfa.sql, AND ONLY ONCE the
-- site version that reads explicit columns is deployed (src/server/repositories/settings.ts):
-- an older version reads "*" and would fall back to its default settings.
--
-- The public site (publishable key, role anon) may read the settings shown on
-- the site. It no longer sees who last changed them (updated_by, an admin's
-- id) nor when (updated_at). Admins (role authenticated) are unchanged: RLS
-- still applies to them.

revoke select on public.event_settings from anon;
grant select (
  id,
  venue_name,
  venue_address,
  venue_map_url,
  registration_open,
  team_size_min,
  team_size_max,
  registration_deadline,
  challenges_start,
  jury
) on public.event_settings to anon;
