-- 2026-11-03: the first 10 places on site are free ("Pass Entrée gratuit"),
-- then the Pass Entrée at 2 500 FCFA (40 places). Capacities live in
-- src/config/passes.ts; the database only needs the new pass id.
-- Run alone: a new enum value cannot be used in the transaction that adds it.
alter type public.pass_id add value if not exists 'free' before 'event';
