-- Removes every TEST order (made with the Genius Pay sandbox keys) and what
-- belongs only to them: tickets, payments, team, participants, webhook logs.
-- Real orders are never touched (is_test = false).
-- Run in the Supabase SQL Editor before opening real sales.

begin;

create temporary table test_orders on commit drop as
  select id from public.orders where is_test;

create temporary table test_people on commit drop as
  select participant_id as id from public.orders where id in (select id from test_orders)
  union
  select m.participant_id
  from public.hackathon_members m
  join public.hackathon_teams t on t.id = m.team_id
  where t.order_id in (select id from test_orders);

delete from public.payment_events
  where provider_reference in (select provider_reference from public.payments where order_id in (select id from test_orders));
delete from public.tickets where order_id in (select id from test_orders);
delete from public.payments where order_id in (select id from test_orders);
delete from public.hackathon_teams where order_id in (select id from test_orders); -- members follow
delete from public.orders where id in (select id from test_orders);                -- order items follow

-- Participants only linked to test orders.
delete from public.participants p
  where p.id in (select id from test_people)
    and not exists (select 1 from public.orders o where o.participant_id = p.id)
    and not exists (select 1 from public.hackathon_members m where m.participant_id = p.id)
    and not exists (select 1 from public.tickets k where k.participant_id = p.id);

-- Check: 0 expected.
select count(*) as test_orders_left from public.orders where is_test;

commit;
