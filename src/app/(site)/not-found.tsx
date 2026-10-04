import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function NotFound() {
  return (
    <Section tone="ink">
      <div className="shell flex min-h-[70svh] flex-col justify-center py-20">
        <SectionLabel>Erreur 404</SectionLabel>
        <h1 className="type-headline text-hero mt-6">Page introuvable</h1>
        <p className="mt-6 max-w-md text-muted">Cette page n’existe pas ou a été déplacée.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" arrow>
            Retour à l’accueil
          </ButtonLink>
          <ButtonLink href="/programme" variant="secondary">
            Programme
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
