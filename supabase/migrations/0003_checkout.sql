-- G-TECH SUMMIT 2026 — checkout (phase 8).
-- Run once in the Supabase SQL Editor, after 0002_partner_logos.sql.
--
-- Two functions, callable by the server only (service role):
--   create_order()   checks the places left and creates the order, its
--                    passes, the buyer and the hackathon team in ONE
--                    transaction — two buyers can never take the same place;
--   finalize_order() marks a verified payment as paid and issues one ticket
--                    per person and per pass. Safe to call twice.
-- Capacities and prices are passed in by the server from src/config/passes.ts.

-- ── Columns ──────────────────────────────────────────────────────────────

alter table public.orders
  -- Secret of the buyer's confirmation link (never the readable reference).
  add column access_token text unique,
  -- Sandbox orders: never counted in the public gauges nor mixed with real sales.
  add column is_test boolean not null default false,
  -- Paid after its hold expired while no place was left: a super admin refunds it.
  add column refund_required boolean not null default false;

alter table public.payments
  add column environment text;

-- ── Public gauges: real orders only ──────────────────────────────────────

create or replace function public.pass_sales()
returns table (pass_id public.pass_id, sold bigint)
language sql stable security definer set search_path = '' as $$
  select i.pass_id, count(*)
  from public.order_items i
  join public.orders o on o.id = i.order_id
  where not o.is_test
    and (o.status = 'PAID' or (o.status = 'PENDING' and o.expires_at > now()))
  group by i.pass_id;
$$;

-- ── Places taken for one pass (paid + pending still on hold) ─────────────

create function public.places_taken(p_pass public.pass_id, p_is_test boolean, p_except uuid default null)
returns bigint
language sql stable set search_path = '' as $$
  select count(*)
  from public.order_items i
  join public.orders o on o.id = i.order_id
  where i.pass_id = p_pass
    and o.is_test = p_is_test
    and o.id is distinct from p_except
    and (o.status = 'PAID' or (o.status = 'PENDING' and o.expires_at > now()));
$$;

-- ── create_order ─────────────────────────────────────────────────────────
-- p_order: {
--   reference, access_token, is_test, total,
--   buyer: { first_name, last_name, email, phone },
--   items: [{ pass_id, unit_price }],
--   team:  { name, track_code, members: [{ is_buyer, is_captain, first_name, last_name, email, phone }] } | null
-- }
-- p_capacities: { "online": 100, "event": 40, "hackathon": 10 }

create function public.create_order(p_order jsonb, p_capacities jsonb, p_hold_minutes integer)
returns uuid
language plpgsql set search_path = '' as $$
declare
  v_is_test boolean := (p_order->>'is_test')::boolean;
  v_item jsonb;
  v_member jsonb;
  v_buyer uuid;
  v_order uuid;
  v_team uuid;
  v_participant uuid;
begin
  -- One checkout at a time: the count below cannot be raced.
  perform pg_advisory_xact_lock(hashtext('gts-capacity'));

  for v_item in select * from jsonb_array_elements(p_order->'items') loop
    if public.places_taken((v_item->>'pass_id')::public.pass_id, v_is_test) >= (p_capacities->>(v_item->>'pass_id'))::integer then
      raise exception 'SOLD_OUT:%', v_item->>'pass_id' using errcode = 'P0001';
    end if;
  end loop;

  insert into public.participants (first_name, last_name, email, phone, consent_at)
  values (p_order->'buyer'->>'first_name', p_order->'buyer'->>'last_name', p_order->'buyer'->>'email', p_order->'buyer'->>'phone', now())
  returning id into v_buyer;

  insert into public.orders (reference, participant_id, status, total, expires_at, access_token, is_test)
  values (p_order->>'reference', v_buyer, 'PENDING', (p_order->>'total')::integer,
          now() + make_interval(mins => p_hold_minutes), p_order->>'access_token', v_is_test)
  returning id into v_order;

  for v_item in select * from jsonb_array_elements(p_order->'items') loop
    insert into public.order_items (order_id, pass_id, unit_price)
    values (v_order, (v_item->>'pass_id')::public.pass_id, (v_item->>'unit_price')::integer);
  end loop;

  if jsonb_typeof(p_order->'team') = 'object' then
    insert into public.hackathon_teams (order_id, name, track_code)
    values (v_order, p_order->'team'->>'name', p_order->'team'->>'track_code')
    returning id into v_team;

    for v_member in select * from jsonb_array_elements(p_order->'team'->'members') loop
      if (v_member->>'is_buyer')::boolean then
        v_participant := v_buyer;
      else
        insert into public.participants (first_name, last_name, email, phone)
        values (v_member->>'first_name', v_member->>'last_name', v_member->>'email', v_member->>'phone')
        returning id into v_participant;
      end if;
      insert into public.hackathon_members (team_id, participant_id, is_captain)
      values (v_team, v_participant, (v_member->>'is_captain')::boolean);
    end loop;
  end if;

  return v_order;
end;
$$;

-- ── finalize_order ───────────────────────────────────────────────────────
-- Called once Genius Pay confirms the payment (re-fetched by the server).
-- Returns 'paid', 'already_paid' or 'no_place' (then flagged for refund).

create function public.finalize_order(p_order_id uuid, p_completed_at timestamptz, p_capacities jsonb)
returns text
language plpgsql set search_path = '' as $$
declare
  v_order public.orders%rowtype;
  v_item record;
  v_member record;
begin
  perform pg_advisory_xact_lock(hashtext('gts-capacity'));
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'ORDER_NOT_FOUND' using errcode = 'P0002';
  end if;

  if v_order.status in ('PAID', 'REFUNDED') or v_order.refund_required then
    return 'already_paid';
  end if;

  -- Paid after the 30-minute hold: only accepted if places are still free.
  if not (v_order.status = 'PENDING' and p_completed_at <= v_order.expires_at) then
    for v_item in select pass_id from public.order_items where order_id = p_order_id loop
      if public.places_taken(v_item.pass_id, v_order.is_test, p_order_id) >= (p_capacities->>v_item.pass_id::text)::integer then
        update public.orders
          set status = 'CANCELLED', refund_required = true, paid_at = p_completed_at, cancelled_at = now()
          where id = p_order_id;
        return 'no_place';
      end if;
    end loop;
  end if;

  update public.orders set status = 'PAID', paid_at = p_completed_at where id = p_order_id;

  -- One ticket per person and per pass. The token is the secret in the QR code.
  for v_item in select pass_id from public.order_items where order_id = p_order_id loop
    if v_item.pass_id = 'hackathon' then
      for v_member in
        select m.participant_id from public.hackathon_members m
        join public.hackathon_teams t on t.id = m.team_id
        where t.order_id = p_order_id
      loop
        insert into public.tickets (order_id, participant_id, pass_id, token)
        values (p_order_id, v_member.participant_id, 'hackathon',
                replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''))
        on conflict (order_id, participant_id, pass_id) do nothing;
      end loop;
    else
      insert into public.tickets (order_id, participant_id, pass_id, token)
      values (p_order_id, v_order.participant_id, v_item.pass_id,
              replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''))
      on conflict (order_id, participant_id, pass_id) do nothing;
    end if;
  end loop;

  return 'paid';
end;
$$;

-- Server only.
revoke execute on function public.create_order(jsonb, jsonb, integer) from public, anon, authenticated;
revoke execute on function public.finalize_order(uuid, timestamptz, jsonb) from public, anon, authenticated;
revoke execute on function public.places_taken(public.pass_id, boolean, uuid) from public, anon, authenticated;
grant execute on function public.create_order(jsonb, jsonb, integer) to service_role;
grant execute on function public.finalize_order(uuid, timestamptz, jsonb) to service_role;
grant execute on function public.places_taken(public.pass_id, boolean, uuid) to service_role;
