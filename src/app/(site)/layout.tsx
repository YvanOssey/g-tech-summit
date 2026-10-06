import { IntroCurtain } from "@/components/layout/IntroCurtain";
import { MobileTicketBar } from "@/components/layout/MobileTicketBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
      <MobileTicketBar />
    </>
  );
}
