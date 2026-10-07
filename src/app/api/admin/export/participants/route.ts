import { PASSES } from "@/config/passes";
import { TRACKS } from "@/content/hackathon";
import { ORDER_STATUS_LABEL } from "@/components/admin/status";
import { logAction } from "@/server/audit";
import { getAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { filterParticipants, loadRegistrations, participantStatus, readParticipantFilters } from "@/server/repositories/registrations";

/**
 * CSV export of the participants, with the same filters as the list.
 * Admins only; every export is written to the audit log. Semicolons and a
 * BOM so it opens correctly in Excel set to French.
 */
export async function GET(request: Request) {
  const admin = await getAdmin();
  if (!admin) return new Response("Non autorisé", { status: 401 });

  const params = Object.fromEntries(new URL(request.url).searchParams);
  const filters = readParticipantFilters(params);
  const db = await createSessionClient();
  const data = await loadRegistrations(db);
  const rows = filterParticipants(data, filters);

  // A cell starting with = + - @ (or tab/CR) would run as a formula in Excel.
  const cell = (value: string | null | undefined) => {
    let v = (value ?? "").replace(/\r?\n/g, " ");
    if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
    return `"${v.replace(/"/g, '""')}"`;
  };
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Abidjan" });

  const header = ["Prénom", "Nom", "E-mail", "Téléphone", "Pass", "Statut", "Équipe", "Thématique", "Référence commande", "Inscription", "Test"];
  const lines = rows.map((p) => {
    const passes = [...new Set([...p.tickets.map((t) => t.passId), ...p.orders.flatMap((o) => o.passes)])];
    const orderIds = [...p.orders.map((o) => o.id), ...(p.team ? [p.team.orderId] : []), ...p.tickets.map((t) => t.orderId)];
    const reference = data.orders.find((o) => orderIds.includes(o.id))?.reference;
    return [
      p.firstName,
      p.lastName,
      p.email,
      p.phone,
      passes.map((id) => PASSES[id].name).join(" + "),
      ORDER_STATUS_LABEL[participantStatus(p, data)],
      p.team?.name,
      TRACKS.find((t) => t.code === p.team?.trackCode)?.name,
      reference,
      date.format(new Date(p.createdAt)),
      p.isTest ? "oui" : "non",
    ]
      .map(cell)
      .join(";");
  });

  await logAction(db, admin.id, "export", "participants", null, { rows: rows.length, filters: { ...filters, q: filters.q ? "…" : undefined } });

  const csv = `﻿${[header.map(cell).join(";"), ...lines].join("\r\n")}\r\n`;
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="participants-gtech-summit-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
