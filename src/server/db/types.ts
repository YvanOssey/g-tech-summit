/**
 * Types of the database, written to match supabase/migrations/0001_init.sql.
 * Keep both in sync (or regenerate with `supabase gen types typescript`).
 */
import type { PassId } from "@/config/passes";
import type { SessionType } from "@/content/programme";

export type AdminRole = "SUPER_ADMIN" | "ADMIN";
export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED" | "EXPIRED";
export type TicketStatus = "VALID" | "USED" | "CANCELLED";

/** Row → Insert: columns with a database default become optional. */
type Table<Row, Defaulted extends keyof Row> = {
  Row: Row;
  Insert: Omit<Row, Defaulted> & Partial<Pick<Row, Defaulted>>;
  Update: Partial<Row>;
  Relationships: [];
};

type Timestamps = { created_at: string; updated_at: string };

export type AdminUserRow = Timestamps & {
  id: string;
  email: string;
  full_name: string | null;
  role: AdminRole;
  active: boolean;
  last_sign_in_at: string | null;
};

export type AuditLogRow = {
  id: number;
  admin_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  changes: Record<string, unknown> | null;
  created_at: string;
};

export type ParticipantRow = Timestamps & {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  consent_at: string | null;
  notes: string | null;
  anonymised_at: string | null;
};

export type OrderRow = Timestamps & {
  id: string;
  reference: string;
  participant_id: string;
  status: OrderStatus;
  total: number;
  currency: string;
  expires_at: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  refunded_at: string | null;
  /** Secret of the buyer's confirmation link. */
  access_token: string | null;
  /** Sandbox order (Genius Pay test keys): kept out of the real figures. */
  is_test: boolean;
  /** Paid after its hold expired with no place left: to be refunded. */
  refund_required: boolean;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  pass_id: PassId;
  unit_price: number;
};

export type HackathonTeamRow = Timestamps & {
  id: string;
  order_id: string;
  name: string;
  track_code: string;
};

export type HackathonMemberRow = {
  team_id: string;
  participant_id: string;
  is_captain: boolean;
};

export type TicketRow = {
  id: string;
  order_id: string;
  participant_id: string;
  pass_id: PassId;
  token: string;
  status: TicketStatus;
  issued_at: string;
  emailed_at: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
};

export type PaymentRow = Timestamps & {
  id: string;
  order_id: string;
  provider: string;
  provider_reference: string | null;
  status: string;
  amount: number;
  fees: number | null;
  payment_method: string | null;
  checkout_url: string | null;
  completed_at: string | null;
  /** "sandbox" or "live", as reported by Genius Pay. */
  environment: string | null;
};

export type PaymentEventRow = {
  id: number;
  provider_reference: string | null;
  event: string;
  payload: Record<string, unknown>;
  signature_valid: boolean;
  received_at: string;
  processed_at: string | null;
  error: string | null;
};

export type ProgrammeSlotRow = Timestamps & {
  id: string;
  day: 1 | 2;
  /** "HH:MM:SS" */
  start_time: string;
  end_time: string | null;
  type: SessionType;
  title: string;
  subtitle: string | null;
  detail: string | null;
  speakers: string | null;
  room: string | null;
  ref: string | null;
  position: number;
  published: boolean;
};

export type PartnerRow = Timestamps & {
  id: string;
  name: string;
  logo_path: string;
  logo_width: number;
  logo_height: number;
  website_url: string | null;
  category: string | null;
  position: number;
  published: boolean;
};

export type SpeakerRow = Timestamps & {
  id: string;
  name: string;
  role: string | null;
  kind: "speaker" | "panelist" | "moderator" | "trainer";
  session_ref: string;
  photo_path: string | null;
  photo_width: number | null;
  photo_height: number | null;
  position: number;
  published: boolean;
};

export type FaqItemRow = Timestamps & {
  id: string;
  question: string;
  answer: string;
  position: number;
  published: boolean;
};

export type EventSettingsRow = {
  id: 1;
  venue_name: string | null;
  venue_address: string | null;
  venue_map_url: string | null;
  registration_open: boolean;
  show_upcoming: boolean;
  team_size_min: number | null;
  team_size_max: number | null;
  registration_deadline: string | null;
  challenges_start: string | null;
  jury: string[] | null;
  updated_at: string;
  updated_by: string | null;
};

export type TicketCheckinRow = {
  id: number;
  ticket_id: string;
  day: 1 | 2;
  checked_at: string;
  checked_by: string | null;
};

type WithTimestamps = "id" | "created_at" | "updated_at";

export type Database = {
  public: {
    Tables: {
      admin_users: Table<AdminUserRow, "full_name" | "role" | "active" | "last_sign_in_at" | "created_at" | "updated_at">;
      audit_log: Table<AuditLogRow, "id" | "entity_id" | "changes" | "created_at">;
      participants: Table<ParticipantRow, WithTimestamps | "phone" | "consent_at" | "notes" | "anonymised_at">;
      orders: Table<OrderRow, WithTimestamps | "status" | "currency" | "expires_at" | "paid_at" | "cancelled_at" | "refunded_at" | "access_token" | "is_test" | "refund_required">;
      order_items: Table<OrderItemRow, "id">;
      hackathon_teams: Table<HackathonTeamRow, WithTimestamps>;
      hackathon_members: Table<HackathonMemberRow, "is_captain">;
      tickets: Table<TicketRow, "id" | "status" | "issued_at" | "emailed_at" | "checked_in_at" | "checked_in_by">;
      payments: Table<
        PaymentRow,
        WithTimestamps | "provider" | "provider_reference" | "status" | "fees" | "payment_method" | "checkout_url" | "completed_at" | "environment"
      >;
      ticket_checkins: Table<TicketCheckinRow, "id" | "checked_at" | "checked_by">;
      payment_events: Table<PaymentEventRow, "id" | "provider_reference" | "received_at" | "processed_at" | "error">;
      programme_slots: Table<
        ProgrammeSlotRow,
        WithTimestamps | "end_time" | "subtitle" | "detail" | "speakers" | "room" | "ref" | "position" | "published"
      >;
      partners: Table<PartnerRow, WithTimestamps | "website_url" | "category" | "position" | "published">;
      speakers: Table<SpeakerRow, WithTimestamps | "role" | "kind" | "photo_path" | "photo_width" | "photo_height" | "position" | "published">;
      faq_items: Table<FaqItemRow, WithTimestamps | "position" | "published">;
      event_settings: Table<
        EventSettingsRow,
        | "id"
        | "venue_name"
        | "venue_address"
        | "venue_map_url"
        | "registration_open"
        | "show_upcoming"
        | "team_size_min"
        | "team_size_max"
        | "registration_deadline"
        | "challenges_start"
        | "jury"
        | "updated_at"
        | "updated_by"
      >;
    };
    Views: Record<string, never>;
    Functions: {
      pass_sales: { Args: Record<string, never>; Returns: { pass_id: PassId; sold: number }[] };
      track_sales: { Args: Record<string, never>; Returns: { track_code: string; sold: number }[] };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
      create_order: { Args: { p_order: Record<string, unknown>; p_capacities: Record<string, number>; p_hold_minutes: number }; Returns: string };
      finalize_order: {
        Args: { p_order_id: string; p_completed_at: string; p_capacities: Record<string, number> };
        Returns: "paid" | "already_paid" | "no_place";
      };
    };
    Enums: {
      admin_role: AdminRole;
      pass_id: PassId;
      order_status: OrderStatus;
      ticket_status: TicketStatus;
      session_type: SessionType;
    };
    CompositeTypes: Record<string, never>;
  };
};