import "server-only";
import { EVENT } from "@/config/event";
import { PASSES, type PassId } from "@/config/passes";
import { SITE_URL } from "@/config/site";
import { formatFCFA } from "@/lib/format";
import { createServiceClient } from "@/server/db/clients";
import { isMailConfigured, sendMail } from "./mailer";

/** Text typed by buyers ends up in HTML: always escaped. */
function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const DATES = "18 et 19 décembre 2026";

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f6f4ef;font-family:Arial,Helvetica,sans-serif;color:#171717">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
<p style="margin:0 0 24px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b">${esc(EVENT.name)} ${EVENT.year} · ${esc(EVENT.city)}</p>
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${esc(title)}</h1>
${body}
<p style="margin:32px 0 0;font-size:13px;color:#6b6b6b">${esc(EVENT.organiser.name)} · ${esc(EVENT.contact.email)} · ${esc(EVENT.contact.phoneDisplay)}</p>
</div></body></html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:20px 0"><a href="${esc(href)}" style="display:inline-block;background:#171717;color:#fffdf8;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:8px">${esc(label)}</a></p>`;
}

type TicketInfo = { id: string; token: string; passId: PassId; holderId: string };
type Person = { id: string; first_name: string; last_name: string; email: string };

/** One e-mail per ticket holder, with their own ticket(s) only. */
function holderMail(person: Person, tickets: TicketInfo[], reference: string, isTest: boolean) {
  const lines = tickets.map((t) => ({ pass: PASSES[t.passId].name, url: `${SITE_URL}/billet/${t.token}` }));
  const testNote = isTest ? "Billet de TEST (paiement simulé) : non valable à l’entrée.\n\n" : "";
  const text = `${testNote}Bonjour ${person.first_name},

Votre billet nominatif pour ${EVENT.name} ${EVENT.year} (${DATES}, ${EVENT.city}) est prêt.

${lines.map((l) => `${l.pass} : ${l.url}`).join("\n")}

Ouvrez le lien le jour J : son QR code est scanné à l’entrée. Ce lien est personnel, ne le partagez pas.
Référence de commande : ${reference}

${EVENT.organiser.name} — ${EVENT.contact.email}`;
  const html = layout(
    `Votre billet, ${person.first_name}`,
    `${isTest ? `<p style="padding:8px 12px;border:1px solid #f28c18">Billet de test (paiement simulé) : non valable à l’entrée.</p>` : ""}
<p>Votre billet nominatif pour <strong>${esc(EVENT.name)} ${EVENT.year}</strong>, les ${DATES} à ${esc(EVENT.city)}, est prêt.</p>
${lines.map((l) => `<p style="margin:16px 0 0"><strong>${esc(l.pass)}</strong></p>${button(l.url, "Ouvrir mon billet")}`).join("")}
<p>Gardez ce lien : le jour J, le QR code du billet est scanné à l’entrée. Il est personnel, ne le partagez pas.</p>
<p style="color:#6b6b6b">Référence de commande : ${esc(reference)}</p>`,
  );
  return { to: person.email, subject: `${isTest ? "[TEST] " : ""}Votre billet — ${EVENT.name} ${EVENT.year}`, text, html };
}

/** The buyer's receipt: what was paid and every ticket of the order. */
function buyerMail(buyer: Person, all: (TicketInfo & { holder: string })[], reference: string, total: number, passes: PassId[], confirmUrl: string, isTest: boolean) {
  const text = `${isTest ? "Commande de TEST (paiement simulé).\n\n" : ""}Bonjour ${buyer.first_name},

Votre paiement de ${formatFCFA(total)} est confirmé. Merci !
Commande ${reference} : ${passes.map((p) => PASSES[p].name).join(" + ")}

Billets émis :
${all.map((t) => `- ${t.holder} — ${PASSES[t.passId].name}`).join("\n")}

Chaque titulaire reçoit son billet par e-mail. Tous les billets restent accessibles ici : ${confirmUrl}

${EVENT.organiser.name} — ${EVENT.contact.email}`;
  const html = layout(
    "Paiement confirmé",
    `${isTest ? `<p style="padding:8px 12px;border:1px solid #f28c18">Commande de test (paiement simulé).</p>` : ""}
<p>Bonjour ${esc(buyer.first_name)}, votre paiement de <strong>${esc(formatFCFA(total))}</strong> est confirmé. Merci !</p>
<p>Commande <strong>${esc(reference)}</strong> : ${esc(passes.map((p) => PASSES[p].name).join(" + "))}</p>
<ul style="padding-left:18px">${all.map((t) => `<li>${esc(t.holder)} — ${esc(PASSES[t.passId].name)}</li>`).join("")}</ul>
<p>Chaque titulaire reçoit son billet par e-mail. Tous les billets restent accessibles sur la page de votre commande :</p>
${button(confirmUrl, "Voir ma commande")}`,
  );
  return { to: buyer.email, subject: `${isTest ? "[TEST] " : ""}Paiement confirmé — ${EVENT.name} ${EVENT.year}`, text, html };
}

/**
 * Sends the tickets of a paid order: one e-mail per holder (only tickets not
 * sent yet, unless `force`), plus the buyer's receipt on the first sending.
 * Marks tickets as sent. Returns how many e-mails went out.
 */
export async function sendOrderEmails(
  orderId: string,
  /** `to`: send everything to this address instead (test sends); tickets are then not marked as sent. */
  options: { force?: boolean; ticketIds?: string[]; to?: string } = {},
): Promise<number> {
  if (!isMailConfigured()) return 0;
  const db = createServiceClient();

  const { data: order } = await db.from("orders").select("id, reference, status, total, participant_id, access_token, is_test").eq("id", orderId).maybeSingle();
  if (!order || order.status !== "PAID") return 0;

  const [{ data: rows }, { data: items }] = await Promise.all([
    db.from("tickets").select("id, token, pass_id, participant_id, status, emailed_at").eq("order_id", orderId).eq("status", "VALID"),
    db.from("order_items").select("pass_id").eq("order_id", orderId),
  ]);
  const tickets = (rows ?? []).filter((t) => (!options.ticketIds || options.ticketIds.includes(t.id)) && (options.force || !t.emailed_at));
  if (tickets.length === 0) return 0;

  const ids = [...new Set([order.participant_id, ...(rows ?? []).map((t) => t.participant_id)])];
  const { data: people } = await db.from("participants").select("id, first_name, last_name, email").in("id", ids);
  const byId = new Map((people ?? []).map((p) => [p.id, p]));

  let sent = 0;
  const holders = [...new Set(tickets.map((t) => t.participant_id))];
  for (const holderId of holders) {
    const person = byId.get(holderId);
    if (!person) continue;
    const own = tickets.filter((t) => t.participant_id === holderId).map((t) => ({ id: t.id, token: t.token, passId: t.pass_id, holderId }));
    await sendMail({ ...holderMail(person, own, order.reference, order.is_test), ...(options.to ? { to: options.to } : {}), replyTo: EVENT.contact.email });
    if (!options.to) await db.from("tickets").update({ emailed_at: new Date().toISOString() }).in("id", own.map((t) => t.id));
    sent += 1;
  }

  // Receipt to the buyer the first time the order is sent (not on a single re-send).
  const firstSending = !options.ticketIds && (rows ?? []).every((t) => !t.emailed_at || tickets.some((x) => x.id === t.id));
  const buyer = byId.get(order.participant_id);
  if (firstSending && buyer && order.access_token) {
    const all = (rows ?? []).map((t) => {
      const p = byId.get(t.participant_id);
      return { id: t.id, token: t.token, passId: t.pass_id, holderId: t.participant_id, holder: p ? `${p.first_name} ${p.last_name}` : "" };
    });
    await sendMail({
      ...buyerMail(buyer, all, order.reference, order.total, (items ?? []).map((i) => i.pass_id), `${SITE_URL}/billetterie/confirmation?c=${order.access_token}`, order.is_test),
      ...(options.to ? { to: options.to } : {}),
      replyTo: EVENT.contact.email,
    });
    sent += 1;
  }
  return sent;
}
