import type { Metadata } from "next";
import Link from "next/link";
import { ActionButton } from "@/components/admin/forms";
import { Notice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { ROLE_LABEL } from "@/server/auth/roles";
import { createSessionClient } from "@/server/auth/session";
import { disableMfa } from "./actions";
import { MfaSetup } from "./MfaSetup";

export const metadata: Metadata = { title: "Sécurité du compte" };

const OK: Record<string, string> = {
  active: "Double authentification activée : le code vous sera demandé à chaque connexion.",
  desactive: "Double authentification désactivée.",
};

export default async function SecurityPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);
  const supabase = await createSessionClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp?.[0];

  return (
    <>
      <PageHeader title="Sécurité du compte" description={`${admin.email} · ${ROLE_LABEL[admin.role]}`} />
      {params.ok && OK[params.ok] && <Notice>{OK[params.ok]}</Notice>}
      {params.erreur && <Notice tone="error">La modification n’a pas pu être enregistrée.</Notice>}

      <div className="max-w-2xl space-y-8">
        <section aria-labelledby="mdp" className="border border-ink/10 bg-paper p-6">
          <h2 id="mdp" className="font-semibold">
            Mot de passe
          </h2>
          <p className="mt-1 text-small text-grey">12 caractères minimum. Une phrase de plusieurs mots est plus sûre et plus facile à retenir.</p>
          <Link href="/admin/mot-de-passe" className="mt-3 inline-block text-small font-medium underline underline-offset-4">
            Changer mon mot de passe
          </Link>
        </section>

        <section aria-labelledby="mfa" className="border border-ink/10 bg-paper p-6">
          <h2 id="mfa" className="font-semibold">
            Double authentification
          </h2>
          <p className="mt-1 mb-4 text-small text-grey">
            En plus du mot de passe, un code à 6 chiffres donné par une application sur votre téléphone. Même si votre mot de passe était
            volé, votre compte resterait protégé. Facultative, mais conseillée pour les super administrateurs.
          </p>
          {factor ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-small">
                <span className="font-semibold text-[#155230]">Activée</span>
                <span className="text-grey"> · depuis le {new Date(factor.created_at).toLocaleDateString("fr-FR")}</span>
              </p>
              <form action={disableMfa}>
                <input type="hidden" name="factor_id" value={factor.id} />
                <ActionButton danger confirm="Désactiver la double authentification ? Seul le mot de passe protégera votre compte.">
                  Désactiver
                </ActionButton>
              </form>
            </div>
          ) : (
            <MfaSetup />
          )}
          <p className="mt-4 text-small text-grey">
            Téléphone perdu ? Un super administrateur peut réinitialiser votre double authentification depuis la page Administrateurs.
          </p>
        </section>
      </div>
    </>
  );
}
