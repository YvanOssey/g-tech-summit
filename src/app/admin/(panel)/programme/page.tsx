import type { Metadata } from "next";
import Link from "next/link";
import { ActionButton } from "@/components/admin/forms";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { EVENT } from "@/config/event";
import { SESSION_TYPE_LABEL } from "@/content/programme";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { deleteSlot, toggleSlot } from "./actions";

export const metadata: Metadata = { title: "Programme" };

const OK: Record<string, string> = { enregistre: "Créneau enregistré.", supprime: "Créneau supprimé." };
const ERR: Record<string, string> = {
  suppression: "Le créneau n’a pas pu être supprimé.",
  enregistrement: "La modification n’a pas pu être enregistrée.",
};

export default async function ProgrammeAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const db = await createSessionClient();
  const { data: slots, error } = await db
    .from("programme_slots")
    .select("id, day, start_time, end_time, type, title, subtitle, speakers, published")
    .order("day")
    .order("start_time")
    .order("position");

  return (
    <>
      <PageHeader
        title="Programme"
        description="Les créneaux des deux jours, dans l’ordre des horaires : pour déplacer un créneau, changez son heure."
      />
      {params.ok && OK[params.ok] && <Notice>{OK[params.ok]}</Notice>}
      {params.erreur && ERR[params.erreur] && <Notice tone="error">{ERR[params.erreur]}</Notice>}
      {error && <Notice tone="error">Le programme n’a pas pu être chargé.</Notice>}

      <div className="space-y-10">
        {EVENT.days.map((d, i) => {
          const day = (i + 1) as 1 | 2;
          const daySlots = (slots ?? []).filter((s) => s.day === day);
          return (
            <section key={d.iso} id={`jour-${day}`} aria-labelledby={`titre-jour-${day}`} className="scroll-mt-20">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                <h2 id={`titre-jour-${day}`} className="font-semibold">
                  Jour {day} · {d.label}
                </h2>
                <Link href={`/admin/programme/nouveau?jour=${day}`} className="inline-flex min-h-10 items-center rounded-input bg-ink px-4 text-small font-semibold text-paper hover:bg-ink/85">
                  Ajouter un créneau
                </Link>
              </div>
              {daySlots.length === 0 ? (
                <EmptyState title="Aucun créneau ce jour-là" />
              ) : (
                <ol className="divide-y divide-ink/10 border border-ink/10 bg-paper">
                  {daySlots.map((s) => (
                    <li key={s.id} className={`flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center ${s.published ? "" : "bg-stone/50"}`}>
                      <span className="w-24 shrink-0 font-mono text-small tabular-nums">
                        {s.start_time.slice(0, 5)}
                        {s.end_time && <span className="text-grey"> → {s.end_time.slice(0, 5)}</span>}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/programme/${s.id}`} className="font-medium hover:underline">
                          {s.title}
                        </Link>
                        {s.subtitle && <span className="text-grey"> — {s.subtitle}</span>}
                        <p className="text-small text-grey">
                          {SESSION_TYPE_LABEL[s.type]}
                          {s.speakers && ` · ${s.speakers}`}
                          {!s.published && " · Masqué — non visible sur le site"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <form action={toggleSlot}>
                          <input type="hidden" name="id" value={s.id} />
                          <input type="hidden" name="published" value={s.published ? "false" : "true"} />
                          <ActionButton aria-label={`${s.published ? "Masquer" : "Publier"} ${s.title}`}>{s.published ? "Masquer" : "Publier"}</ActionButton>
                        </form>
                        <Link href={`/admin/programme/${s.id}`} className="inline-flex min-h-9 items-center rounded-input border border-ink/20 px-2.5 text-small font-medium hover:border-ink">
                          Modifier
                        </Link>
                        <form action={deleteSlot}>
                          <input type="hidden" name="id" value={s.id} />
                          <ActionButton danger confirm={`Supprimer définitivement le créneau « ${s.title} » de ${s.start_time.slice(0, 5)} ?`} aria-label={`Supprimer ${s.title}`}>
                            Supprimer
                          </ActionButton>
                        </form>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
