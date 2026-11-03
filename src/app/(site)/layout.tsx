import { IntroCurtain } from "@/components/layout/IntroCurtain";
import { MobileTicketBar } from "@/components/layout/MobileTicketBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PASSES, passesOnSale } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { formatFCFA } from "@/lib/format";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const onSale = passesOnSale((await getEventSettings()).sold);
  // "Entrée gratuite · 10 places", then "Pass Entrée · 2 500 FCFA".
  const priceLine =
    onSale[0] === "free"
      ? `Entrée gratuite · ${PASSES.free.capacity.total} places`
      : `${PASSES[onSale[0]].name} · ${formatFCFA(PASSES[onSale[0]].price)}`;
  return (
    <>
      <IntroCurtain />
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--z-skip) focus:bg-signal focus:px-4 focus:py-3 focus:font-semibold"
      >
        Aller au contenu
      </a>
      <SiteHeader />
      <main id="contenu" className="overflow-x-clip">{children}</main>
      <SiteFooter />
      <MobileTicketBar priceLine={priceLine} />
    </>
  );
}
