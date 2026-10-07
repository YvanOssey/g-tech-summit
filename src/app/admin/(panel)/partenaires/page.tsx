import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/admin/forms";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { partnerLogoUrl } from "@/lib/partner-logo";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { deletePartner, movePartner, togglePartner } from "./actions";

export const metadata: Metadata = { title: "Partenaires" };

const OK: Record<string, string> = { enregistre: "Partenaire enregistré.", supprime: "Partenaire supprimé." };
const ERR: Record<string, string> = {
  suppression: "Le partenaire n’a pas pu être supprimé.",
  enregistrement: "La modification n’a pas pu être enregistrée.",
};

export default async function PartnersAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const db = await createSessionClient();
  const { data: partners, error } = await db
    .from("partners")
    .select("id, name, logo_path, logo_width, logo_height, website_url, category, published")
    .order("position")
    .order("created_at");

  return (
    <>
      <PageHeader
        title="Partenaires"
        description="Les partenaires affichés sur le site, dans l’ordre d’affichage."
        actions={
          <Link href="/admin/partenaires/nouveau" className="inline-flex min-h-10 items-center rounded-input bg-ink px-4 text-small font-semibold text-paper hover:bg-ink/85">
            Ajouter un partenaire
          </Link>
        }
      />
      {params.ok && OK[params.ok] && <Notice>{OK[params.ok]}</Notice>}
      {params.erreur && ERR[params.erreur] && <Notice tone="error">{ERR[params.erreur]}</Notice>}
      {error && <Notice tone="error">Les partenaires n’ont pas pu être chargés.</Notice>}

      {partners && partners.length === 0 ? (
        <EmptyState title="Aucun partenaire">
          <p>Ajoutez un partenaire confirmé par les organisateurs.</p>
        </EmptyState>
      ) : (
        <ol className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {partners?.map((p, i) => (
            <li key={p.id} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
              <span className="w-6 shrink-0 font-mono text-small text-grey">{i + 1}</span>
              <div className="flex h-12 w-28 shrink-0 items-center justify-center">
                <Image src={partnerLogoUrl(p.logo_path)} alt="" width={p.logo_width} height={p.logo_height} className="max-h-12 w-auto object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/partenaires/${p.id}`} className="font-medium hover:underline">
                  {p.name}
                </Link>
                <p className="text-small text-grey">
                  {p.published ? "Publié" : "Masqué — non visible sur le site"}
                  {p.category && ` · ${p.category}`}
                  {p.website_url && ` · ${new URL(p.website_url).hostname}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <form action={movePartner}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="direction" value="up" />
                  <ActionButton disabled={i === 0} aria-label={`Monter ${p.name}`}>
                    Monter
                  </ActionButton>
                </form>
                <form action={movePartner}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="direction" value="down" />
                  <ActionButton disabled={i === partners.length - 1} aria-label={`Descendre ${p.name}`}>
                    Descendre
                  </ActionButton>
                </form>
                <form action={togglePartner}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="published" value={p.published ? "false" : "true"} />
                  <ActionButton aria-label={`${p.published ? "Masquer" : "Publier"} ${p.name}`}>{p.published ? "Masquer" : "Publier"}</ActionButton>
                </form>
                <Link href={`/admin/partenaires/${p.id}`} className="inline-flex min-h-9 items-center rounded-input border border-ink/20 px-2.5 text-small font-medium hover:border-ink">
                  Modifier
                </Link>
                <form action={deletePartner}>
                  <input type="hidden" name="id" value={p.id} />
                  <ActionButton danger confirm={`Supprimer définitivement le partenaire ${p.name} ?`} aria-label={`Supprimer ${p.name}`}>
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
