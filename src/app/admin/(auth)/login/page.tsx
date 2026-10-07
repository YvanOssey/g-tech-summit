import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin, isMfaPending } from "@/server/auth/require-admin";
import { safeNext } from "@/server/auth/safe-next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

const NOTICES: Record<string, string> = {
  lien: "Ce lien a expiré ou a déjà été utilisé. Demandez-en un nouveau avec « Mot de passe oublié ».",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, admin] = await Promise.all([searchParams, getAdmin()]);
  const suite = typeof params.suite === "string" ? safeNext(params.suite) : undefined;
  if (admin) redirect(suite ?? "/admin");
  if (await isMfaPending()) redirect(`/admin/verification${suite ? `?suite=${encodeURIComponent(suite)}` : ""}`);

  const notice = typeof params.erreur === "string" ? NOTICES[params.erreur] : undefined;

  return (
    <>
      <h1 className="text-heading font-semibold leading-tight">Connexion</h1>
      <p className="mt-2 text-small text-grey">Réservé à l’équipe Ghostech.</p>
      {notice && (
        <p role="alert" className="mt-5 border-l-2 border-[#b42318] bg-[#b42318]/8 px-3 py-2 text-small text-[#7a1a12]">
          {notice}
        </p>
      )}
      {params.deconnecte && <p className="mt-5 border-l-2 border-ink bg-stone px-3 py-2 text-small">Vous êtes déconnecté.</p>}
      <div className="mt-6">
        <LoginForm suite={suite} />
      </div>
    </>
  );
}
