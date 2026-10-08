import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/admin/forms";
import { Notice, PageHeader } from "@/components/admin/ui";
import { SPEAKER_KIND_LABEL, SPEAKER_SESSIONS } from "@/content/speakers";
import { speakerPhotoUrl } from "@/lib/speaker-photo";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { deleteSpeaker, moveSpeaker, toggleSpeaker } from "./actions";

export const metadata: Metadata = { title: "Intervenants" };

const OK: Record<string, string> = { enregistre: "Intervenant enregistré.", supprime: "Intervenant supprimé." };
const ERR: Record<string, string> = {
  suppression: "L’intervenant n’a pas pu être supprimé.",
  enregistrement: "La modification n’a pas pu être enregistrée.",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export default async function SpeakersAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const db = await createSessionClient();
  const { data: speakers, error } = await db
    .from("speakers")
    .select("id, name, role, kind, session_ref, photo_path, photo_width, photo_height, published")
    .order("position")
    .order("created_at");

  return (
    <>
      <PageHeader
        title="Intervenants"
        description="Conférenciers, panélistes, modérateurs et formateurs, avec leur photo. Ils apparaissent sur la page Programme, session par session."
        actions={
          <Link href="/admin/intervenants/nouveau" className="inline-flex min-h-10 items-center rounded-input bg-ink px-4 text-small font-semibold text-paper hover:bg-ink/85">
            Ajouter un intervenant
          </Link>
        }
      />
      {params.ok && OK[params.ok] && <Notice>{OK[params.ok]}</Notice>}
      {params.erreur && ERR[params.erreur] && <Notice tone="error">{ERR[params.erreur]}</Notice>}
      {error && (
        <Notice tone="error">
          Les intervenants n’ont pas pu être chargés. Si c’est la première fois, exécutez d’abord le script supabase/migrations/0008_speakers.sql dans Supabase.
        </Notice>
      )}

      <div className="space-y-8">
        {SPEAKER_SESSIONS.map((session) => {
          const list = (speakers ?? []).filter((s) => s.session_ref === session.ref);
          return (
            <section key={session.ref} aria-labelledby={`s-${session.ref}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id={`s-${session.ref}`} className="font-semibold">
                  {session.kind}
                  {session.title && <span className="font-normal text-grey"> — {session.title}</span>}
                </h2>
                <Link href={`/admin/intervenants/nouveau?session=${session.ref}`} className="text-small underline underline-offset-4">
                  Ajouter à cette session
                </Link>
              </div>
              {list.length === 0 ? (
                <p className="mt-2 border border-dashed border-ink/15 px-4 py-3 text-small text-grey">Aucun intervenant : le site affiche « À confirmer ».</p>
              ) : (
                <ol className="mt-2 divide-y divide-ink/10 border border-ink/10 bg-paper">
                  {list.map((s, i) => (
                    <li key={s.id} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
                      {s.photo_path && s.photo_width && s.photo_height ? (
                        <Image src={speakerPhotoUrl(s.photo_path)} alt="" width={s.photo_width} height={s.photo_height} className="size-12 shrink-0 object-cover" />
                      ) : (
                        <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center bg-ink/5 font-mono text-small text-grey">
                          {initials(s.name)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/intervenants/${s.id}`} className="font-medium hover:underline">
                          {s.name}
                        </Link>
                        <p className="text-small text-grey">
                          {SPEAKER_KIND_LABEL[s.kind]}
                          {s.role && ` · ${s.role}`}
                          {" · "}
                          {s.published ? "Publié" : "Masqué — non visible sur le site"}
                          {!s.photo_path && " · sans photo"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <form action={moveSpeaker}>
                          <input type="hidden" name="id" value={s.id} />
                          <input type="hidden" name="direction" value="up" />
                          <ActionButton disabled={i === 0} aria-label={`Monter ${s.name}`}>
                            Monter
                          </ActionButton>
                        </form>
                        <form action={moveSpeaker}>
                          <input type="hidden" name="id" value={s.id} />
                          <input type="hidden" name="direction" value="down" />
                          <ActionButton disabled={i === list.length - 1} aria-label={`Descendre ${s.name}`}>
                            Descendre
                          </ActionButton>
                        </form>
                        <form action={toggleSpeaker}>
                          <input type="hidden" name="id" value={s.id} />
                          <input type="hidden" name="published" value={s.published ? "false" : "true"} />
                          <ActionButton aria-label={`${s.published ? "Masquer" : "Publier"} ${s.name}`}>{s.published ? "Masquer" : "Publier"}</ActionButton>
                        </form>
                        <Link href={`/admin/intervenants/${s.id}`} className="inline-flex min-h-9 items-center rounded-input border border-ink/20 px-2.5 text-small font-medium hover:border-ink">
                          Modifier
                        </Link>
                        <form action={deleteSpeaker}>
                          <input type="hidden" name="id" value={s.id} />
                          <ActionButton danger confirm={`Supprimer définitivement ${s.name} ?`} aria-label={`Supprimer ${s.name}`}>
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
