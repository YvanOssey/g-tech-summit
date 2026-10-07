-- G-TECH SUMMIT 2026 — registrations management (phase 9).
-- Run once in the Supabase SQL Editor, after 0003_checkout.sql.

-- Admins designate the captain of a team.
create policy "members: admins update" on public.hackathon_members
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Super admins record a refund on the payment.
create policy "payments: super admin updates" on public.payments
  for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
