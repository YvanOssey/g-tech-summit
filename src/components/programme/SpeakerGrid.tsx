import Image from "next/image";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SPEAKER_KIND_LABEL, SPEAKER_SESSIONS, type Speaker } from "@/content/speakers";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <figure className="panel flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square bg-ink/5">
        {speaker.photo ? (
          <Image
            src={speaker.photo.src}
            alt={`Photo de ${speaker.name}`}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span aria-hidden="true" className="type-condensed absolute inset-0 flex items-center justify-center text-display text-ink/25">
            {initials(speaker.name)}
          </span>
        )}
      </div>
      <figcaption className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
        <span className="type-meta text-accent">{SPEAKER_KIND_LABEL[speaker.kind]}</span>
        <span className="text-heading leading-tight font-semibold">{speaker.name}</span>
        {speaker.role && <span className="text-small text-muted">{speaker.role}</span>}
      </figcaption>
    </figure>
  );
}

/**
 * The speakers entered in the admin, session by session in the order of the
 * programme. Each heading links to the session's description.
 */
export function SpeakerGrid({ speakers }: { speakers: readonly Speaker[] }) {
  const sessions = SPEAKER_SESSIONS.map((s) => ({ ...s, speakers: speakers.filter((x) => x.sessionRef === s.ref) })).filter((s) => s.speakers.length > 0);

  return (
    <div className="space-y-14">
      {sessions.map((s) => (
        <div key={s.ref}>
          <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-rule-strong pt-4">
            <span className="type-label">{s.kind}</span>
            {s.title && (
              <Link
                href={`#${s.ref.startsWith("form-") ? "formations" : s.ref}`}
                className="text-heading font-semibold hover:underline hover:decoration-mark hover:underline-offset-4"
              >
                {s.title}
              </Link>
            )}
          </h3>
          <RevealGroup as="ul" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {s.speakers.map((speaker) => (
              <RevealItem as="li" key={speaker.id}>
                <SpeakerCard speaker={speaker} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      ))}
    </div>
  );
}

/** "Awa Koné, Jean Yao (modération)" for a session, or null when nobody is confirmed. */
export function speakerNames(speakers: readonly Speaker[], ref: string): string | null {
  const list = speakers.filter((s) => s.sessionRef === ref);
  if (list.length === 0) return null;
  return list.map((s) => (s.kind === "moderator" ? `${s.name} (modération)` : s.name)).join(", ");
}
