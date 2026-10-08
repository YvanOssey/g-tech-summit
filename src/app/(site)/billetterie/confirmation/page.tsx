import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HOLD_MINUTES, PASSES } from "@/config/passes";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ButtonLink } from "@/components/ui/Button";
import { formatFCFA } from "@/lib/format";
import { createServiceClient } from "@/server/db/clients";
import { PaymentWatcher } from "./PaymentWatcher";

export const metadata: Metadata = {
  title: "Confirmation",
  robots: { index: false, follow: false },
};

/**
 * Where Genius Pay sends the buyer back. The secret token in the link is the
 * only key: it shows the order and, once paid, the links to every ticket.
 */
export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const token = (await searchParams).c;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) notFound();

  const db = createServiceClient();
  const { data: order } = await db
    .from("orders")
    .select("id, reference, status, total, expires_at, refund_required, is_test")
    .eq("access_token", token)
    .maybeSingle();
  if (!order) notFound();

  const [{ data: items }, { data: payment }, { data: tickets }] = await Promise.all([
    db.from("order_items").select("pass_id").eq("order_id", order.id),
    db.from("payments").select("checkout_url").eq("order_id", order.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    db.from("tickets").select("token, pass_id, participant_id").eq("order_id", order.id),
  ]);
  const holderIds = [...new Set((tickets ?? []).map((t) => t.participant_id))];
  const { data: holders } = holderIds.length
    ? await db.from("participants").select("id, first_name, last_name").in("id", holderIds)
    : { data: [] };
  const holderName = (id: string) => {
    const p = holders?.find((h) => h.id === id);
    return p ? `${p.first_name} ${p.last_name}` : "";
  };

  const passes = (items ?? []).map((i) => PASSES[i.pass_id].name).join(" + ");
  const holdOver = order.expires_at ? new Date(order.expires_at) < new Date() : true;
  const retryHref = `/billetterie?pass=${items?.[0]?.pass_id ?? "event"}`;

  let label = "Paiement en attente";
  let title = "Nous attendons la confirmation de votre paiement";
  if (order.status === "PAID") {
    label = "Paiement confirmé";
    title = "C’est confirmé, à très vite !";
  } else if (order.refund_required) {
    label = "Paiement reçu";
    title = "Il n’y avait plus de place";
  } else if (order.status !== "PENDING") {
    label = "Paiement non abouti";
    title = "Le paiement n’a pas abouti";
  }

  return (
    <Section tone="paper" className="pt-14 pb-24 md:pt-20 md:pb-32">
      <div className="shell max-w-3xl">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="type-headline text-title mt-6">{title}</h1>
        {order.is_test && (
          <p className="mt-4 inline-block border border-signal px-3 py-1 text-small">Commande de test (paiement simulé) — aucun billet réel.</p>
        )}

        <dl className="mt-8 grid gap-4 border-y border-rule-strong py-5 sm:grid-cols-3">
          <div>
            <dt className="type-meta text-muted">Référence</dt>
            <dd className="mt-1 font-mono">{order.reference}</dd>
          </div>
          <div>
            <dt className="type-meta text-muted">Pass</dt>
            <dd className="mt-1">{passes}</dd>
          </div>
          <div>
            <dt className="type-meta text-muted">Montant</dt>
            <dd className="mt-1 tabular-nums">{formatFCFA(order.total)}</dd>
          </div>
        </dl>

        {order.status === "PAID" && (
          <div className="mt-10">
            <h2 className="type-headline text-heading">Vos billets</h2>
            <p className="mt-2 text-muted">
              Un billet nominatif par personne. Ouvrez chaque billet et gardez-le : son QR code est scanné à l’entrée. Conservez aussi cette
              page, elle reste accessible avec le même lien.
            </p>
            <ul className="mt-6 divide-y divide-rule border-y border-rule">
              {(tickets ?? []).map((t) => (
                <li key={t.token} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <span>
                    <span className="font-semibold">{holderName(t.participant_id)}</span>
                    <span className="block text-small text-muted">{PASSES[t.pass_id].name}</span>
                  </span>
                  <Link href={`/billet/${t.token}`} className="underline underline-offset-4">
                    Voir le billet
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {order.status === "PENDING" && !holdOver && (
          <div className="mt-10">
            <p className="text-muted">
              Si vous avez déjà payé, la confirmation arrive en quelques secondes. Sinon, vous pouvez reprendre le paiement : vos places restent
              réservées jusqu’à {new Intl.DateTimeFormat("fr-FR", { timeStyle: "short", timeZone: "Africa/Abidjan" }).format(new Date(order.expires_at!))}.
            </p>
            <PaymentWatcher token={token} />
            {payment?.checkout_url && (
              <div className="mt-6">
                <ButtonLink href={payment.checkout_url}>Reprendre le paiement</ButtonLink>
              </div>
            )}
          </div>
        )}

        {order.status === "PENDING" && holdOver && (
          <div className="mt-10">
            <p className="text-muted">
              Le délai de réservation de {HOLD_MINUTES} minutes est passé. Si vous avez payé, la confirmation peut encore arriver : cette page se met à jour.
              Sinon, recommencez votre inscription.
            </p>
            <PaymentWatcher token={token} />
            <div className="mt-6">
              <ButtonLink href={retryHref}>Recommencer</ButtonLink>
            </div>
          </div>
        )}

        {order.refund_required && (
          <p className="mt-10 text-muted">
            Votre paiement est arrivé après la fin de la réservation et toutes les places avaient été prises entre-temps. Vous serez remboursé :
            l’équipe Ghostech vous contacte. Gardez la référence ci-dessus.
          </p>
        )}

        {["FAILED", "CANCELLED", "EXPIRED"].includes(order.status) && !order.refund_required && (
          <div className="mt-10">
            <p className="text-muted">Aucun montant n’a été prélevé pour cette commande. Vous pouvez recommencer votre inscription.</p>
            <div className="mt-6">
              <ButtonLink href={retryHref}>Recommencer</ButtonLink>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
