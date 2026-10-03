import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70svh] flex-col justify-center py-20">
      <p className="type-meta text-grey-500">Erreur 404</p>
      <h1 className="type-condensed text-display mt-6">Page introuvable</h1>
      <p className="mt-6 max-w-md text-grey-500">Cette page n’existe pas ou a été déplacée.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/" arrow>
          Retour à l’accueil
        </ButtonLink>
        <ButtonLink href="/programme" variant="secondary">
          Programme
        </ButtonLink>
      </div>
    </div>
  );
}
