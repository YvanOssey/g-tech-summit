-- Creates the FIRST super administrator. Run once, in the Supabase SQL Editor.
--
-- 1. Authentication → Users → "Add user" → "Create new user": the address
--    below and a strong password, "Auto Confirm User" ticked. (No e-mail is
--    needed: Supabase only lets you edit its e-mail templates once a custom
--    SMTP server is configured.)
-- 2. Replace the address in this file, run it — but do not commit it.
-- 3. Sign in at /admin.
--
-- Later administrators are invited from the back office itself.

insert into public.admin_users (id, email, full_name, role)
select id, email, null, 'SUPER_ADMIN'
from auth.users
where email = lower('votre-adresse@exemple.com')
on conflict (id) do update set role = 'SUPER_ADMIN', active = true;

-- Check: one row expected.
select email, role, active from public.admin_users;
