import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { EVENT } from "@/config/event";
import { PASSES } from "@/config/passes";
import { EntrancePanel } from "@/components/admin/EntrancePanel";
import { Section } from "@/components/ui/Section";
import { SITE_URL } from "@/config/site";
import { getAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { pickDay } from "@/server/checkin";
import { createServiceClient } from "@/server/db/clients";

export const metadata: Metadata = {
  title: "Mon billet",
  robots: { index: false, follow: false },
};

const STATUS: Record<string, string> = { VALID: "Valide", USED: "Valide", CANCELLED: "Annulé" };

/**
 * One nominative ticket. The address contains the ticket's secret token
 * (64 random characters): whoever has the link has the ticket, as with a
 * paper ticket. The QR code encodes the ticket's address: scanned with any
 * phone camera by a signed-in admin, the page shows the entrance control.
 */
export default async function TicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ jour?: string; entree?: string }>;
}) {
  const [{ token }, query, admin] = await Promise.all([params, searchParams, getAdmin()]);
  if (!/^[a-f0-9]{64}$/.test(token)) notFound();

  const db = createServiceClient();
  const { data: ticket } = await db.from("tickets").select("id, token, pass_id, status, participant_id, order_id").eq("token", token).maybeSingle();
  if (!ticket) notFound();
  const [{ data: holder }, { data: order }] = await Promise.all([
    db.from("participants").select("first_name, last_name").eq("id", ticket.participant_id).single(),
    db.from("orders").select("reference, is_test").eq("id", ticket.order_id).single(),
  ]);

  // Entrance control: check-ins are read as the admin (RLS), never shown to visitors.
  let checkins: { day: 1 | 2; at: string; by: string | null }[] = [];
  if (admin) {
    const session = await createSessionClient();
    const [{ data: rows }, { data: admins }] = await Promise.all([
      session.from("ticket_checkins").select("day, checked_at, checked_by").eq("ticket_id", ticket.id).order("day"),
      session.from("admin_users").select("id, full_name, email"),
    ]);
    const name = (id: string | null) => {
      const a = admins?.find((x) => x.id === id);
      return a ? (a.full_name ?? a.email) : id === admin.id ? (admin.full_name ?? admin.email) : null;
    };
    checkins = (rows ?? []).map((r) => ({ day: r.day, at: r.checked_at, by: name(r.checked_by) }));
  }

  const qr = await QRCode.toString(`${SITE_URL}/billet/${token}`, { type: "svg", errorCorrectionLevel: "M", margin: 1, color: { dark: "#171717", light: "#fffdf8" } });
  const pass = PASSES[ticket.pass_id];
  const valid = ticket.status === "VALID";

  return (
    <Section tone="stone" className="pt-14 pb-24 md:pt-20 md:pb-32">
      {admin && (
        <div className="shell">
          <EntrancePanel
            ticket={{ id: ticket.id, token, status: ticket.status, passId: ticket.pass_id, isTest: Boolean(order?.is_test) }}
            holder={`${holder?.first_name ?? ""} ${holder?.last_name ?? ""}`.trim()}
            checkins={checkins}
            day={pickDay(query.jour)}
            result={query.entree}
          />
        </div>
      )}
      <div className={`shell flex justify-center ${admin ? "mt-6" : ""}`}>
        <article
          aria-label={`Billet de ${holder?.first_name} ${holder?.last_name}`}
          className="grid w-full max-w-3xl overflow-hidden rounded-object bg-paper text-ink ring-1 ring-ink ring-inset md:grid-cols-[1fr_17rem]"
        >
          <div className="flex flex-col gap-8 p-6 sm:p-8">
            <div className="type-meta flex flex-wrap justify-between gap-4 text-grey">
              <span>Billet nominatif</span>
              <span>Réf. {order?.reference}</span>
            </div>
            <p className="type-condensed text-title">
              G-Tech
              <br />
              Summit <span className="text-signal-text">26</span>
            </p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink pt-5">
              <div className="col-span-2">
                <dt className="type-meta text-grey">Participant</dt>
                <dd className="mt-1 text-heading font-semibold">
                  {holder?.first_name} {holder?.last_name?.toUpperCase()}
                </dd>
              </div>
              <div>
                <dt className="type-meta text-grey">Pass</dt>
                <dd className="mt-1 font-semibold">{pass.name}</dd>
              </div>
              <div>
                <dt className="type-meta text-grey">Dates</dt>
                <dd className="mt-1 font-semibold">18—19.12.{EVENT.year}</dd>
              </div>
              <div>
                <dt className="type-meta text-grey">Ville</dt>
                <dd className="mt-1 font-semibold">{EVENT.city}</dd>
              </div>
              <div>
                <dt className="type-meta text-grey">Statut</dt>
                <dd className={`mt-1 font-semibold ${valid ? "" : "text-signal-text"}`}>{STATUS[ticket.status]}</dd>
              </div>
            </dl>
            <p className="text-small text-grey">{pass.access}.</p>
            {order?.is_test && <p className="border border-signal px-3 py-1 text-small">Billet de test — non valable à l’entrée.</p>}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 border-t border-dashed border-ink/40 p-6 md:border-t-0 md:border-l">
            <div
              role="img"
              aria-label="QR code du billet, à présenter à l’entrée"
              className={`w-full max-w-56 ${valid ? "" : "opacity-30"}`}
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <p className="type-meta text-center text-grey">À présenter à l’entrée</p>
          </div>
        </article>
      </div>
    </Section>
  );
}
