import type { Metadata } from "next";
import Link from "next/link";
import { ActionButton } from "@/components/admin/forms";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { deleteFaq, moveFaq, toggleFaq } from "./actions";

export const metadata: Metadata = { title: "FAQ" };

const OK: Record<string, string> = { enregistre: "Question enregistrée.", supprime: "Question supprimée." };
const ERR: Record<string, string> = {
  suppression: "La question n’a pas pu être supprimée.",
  enregistrement: "La modification n’a pas pu être enregistrée.",
};

export default async function FaqAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const db = await createSessionClient();
  const { data: items, error } = await db.from("faq_items").select("id, question, published, position").order("position").order("created_at");

  return (
    <>
      <PageHeader
        title="FAQ"
        description="Les questions fréquentes de la page Infos pratiques, dans l’ordre d’affichage."
        actions={
          <Link href="/admin/faq/nouveau" className="inline-flex min-h-10 items-center rounded-input bg-ink px-4 text-small font-semibold text-paper hover:bg-ink/85">
            Ajouter une question
          </Link>
        }
      />
      {params.ok && OK[params.ok] && <Notice>{OK[params.ok]}</Notice>}
      {params.erreur && ERR[params.erreur] && <Notice tone="error">{ERR[params.erreur]}</Notice>}
      {error && <Notice tone="error">Les questions n’ont pas pu être chargées.</Notice>}

      {items && items.length === 0 ? (
        <EmptyState title="Aucune question">
          <p>Ajoutez une première question.</p>
        </EmptyState>
      ) : (
        <ol className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {items?.map((item, i) => (
            <li key={item.id} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
              <span className="w-6 shrink-0 font-mono text-small text-grey">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/faq/${item.id}`} className="font-medium hover:underline">
                  {item.question}
                </Link>
                <p className="text-small text-grey">{item.published ? "Publiée" : "Masquée — non visible sur le site"}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <form action={moveFaq}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="direction" value="up" />
                  <ActionButton disabled={i === 0} aria-label={`Monter « ${item.question} »`}>
                    Monter
                  </ActionButton>
                </form>
                <form action={moveFaq}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="direction" value="down" />
                  <ActionButton disabled={i === items.length - 1} aria-label={`Descendre « ${item.question} »`}>
                    Descendre
                  </ActionButton>
                </form>
                <form action={toggleFaq}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="published" value={item.published ? "false" : "true"} />
                  <ActionButton>{item.published ? "Masquer" : "Publier"}</ActionButton>
                </form>
                <Link href={`/admin/faq/${item.id}`} className="inline-flex min-h-9 items-center rounded-input border border-ink/20 px-2.5 text-small font-medium hover:border-ink">
                  Modifier
                </Link>
                <form action={deleteFaq}>
                  <input type="hidden" name="id" value={item.id} />
                  <ActionButton danger confirm={`Supprimer définitivement la question « ${item.question} » ?`}>
                    Supprimer
                  </ActionButton>
                </form>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
