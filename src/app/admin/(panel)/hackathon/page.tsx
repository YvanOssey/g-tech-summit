import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader } from "@/components/admin/ui";
import { EVENT } from "@/config/event";
import { PASSES } from "@/config/passes";
import { HACKATHON, TRACKS } from "@/content/hackathon";
import { formatFCFA } from "@/lib/format";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { HackathonForm } from "./HackathonForm";

export const metadata: Metadata = { title: "Hackathon" };

export default async function HackathonAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const db = await createSessionClient();
  const { data: settings } = await db
    .from("event_settings")
    .select("registration_deadline, challenges_start, jury, team_size_min, team_size_max")
    .eq("id", 1)
    .maybeSingle();

  const fixed = [
    { k: "Thème", v: HACKATHON.theme },
    { k: "Thématiques", v: TRACKS.map((t) => t.name).join(" · ") },
    { k: "Taille des équipes", v: settings?.team_size_min && settings.team_size_max ? `${settings.team_size_min} à ${settings.team_size_max} personnes` : "—" },
    { k: "Pass", v: `${formatFCFA(PASSES.hackathon.price)} par équipe · ${PASSES.hackathon.capacity.total} équipes` },
    { k: "Finale", v: `${HACKATHON.finale.pitch.date} à ${HACKATHON.finale.pitch.time}` },
  ];

  return (
    <>
      <PageHeader title="Hackathon" description="Les informations du hackathon encore à annoncer. Elles s’affichent sur la page Hackathon du site." />
      {params.ok && <Notice>Informations enregistrées. Le site est mis à jour à la prochaine visite.</Notice>}

      {settings ? (
        <HackathonForm values={settings} lastDay={EVENT.days[EVENT.days.length - 1].iso} />
      ) : (
        <Notice tone="error">Les informations n’ont pas pu être chargées.</Notice>
      )}

      <section aria-labelledby="fixe" className="mt-10 max-w-2xl">
        <h2 id="fixe" className="font-semibold">
          Fixé dans le code
        </h2>
        <p className="mt-1 text-small text-grey">
          Ces éléments apparaissent à plusieurs endroits du site (pass, FAQ, règlement) : ils se changent dans le code pour rester cohérents
          partout.
        </p>
        <dl className="mt-3 divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
          {fixed.map((f) => (
            <div key={f.k} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[11rem_1fr]">
              <dt className="text-grey">{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-small text-grey">
          Les équipes inscrites apparaîtront dans{" "}
          <Link href="/admin/equipes" className="underline underline-offset-4">
            Équipes hackathon
          </Link>{" "}
          une fois les inscriptions en ligne ouvertes.
        </p>
      </section>
    </>
  );
}
