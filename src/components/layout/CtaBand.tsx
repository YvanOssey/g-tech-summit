import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

interface CtaBandProps {
  title: string;
  href?: string;
  cta?: string;
}

/** Short orange band that closes an inner page with the main action. */
export function CtaBand({ title, href = "/billetterie", cta = "Prendre mon pass" }: CtaBandProps) {
  return (
    <Section tone="signal" aria-label={title}>
      <div className="shell flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <p className="type-headline text-heading max-w-2xl">{title}</p>
        <ButtonLink href={href} arrow className="self-start md:self-auto">
          {cta}
        </ButtonLink>
      </div>
    </Section>
  );
}
