import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SpotlightGroup } from "@/components/motion/Spotlight";
import { Tilt } from "@/components/motion/Tilt";
import { SPEAKER_KIND_LABEL, SPEAKER_SESSIONS, type Speaker } from "@/content/speakers";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/**
 * Speakers wall, built like the partners wall: identical cards that flip in
 * on scroll, tilt and light up under the pointer; SpeakerMarquee adds the
 * scrolling band of names. Ordered by session (programme order), then by the
 * admin order.
 */
function bySession(speakers: readonly Speaker[]) {
  return SPEAKER_SESSIONS.flatMap((s) => speakers.filter((x) => x.sessionRef === s.ref).map((x) => ({ speaker: x, session: s.kind })));
}

export function SpeakerGrid({ speakers }: { speakers: readonly Speaker[] }) {
  return (
    <SpotlightGroup>
      <RevealGroup as="ul" className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
        {bySession(speakers).map(({ speaker, session }) => (
          <RevealItem as="li" effect="flip" key={speaker.id}>
            <Tilt max={6}>
              <figure className="panel card-interactive spotlight flex h-full flex-col overflow-hidden bg-paper! p-3 sm:p-4">
                <div className="relative aspect-square overflow-hidden rounded-input bg-ink/5">
                  {speaker.photo ? (
                    <Image
                      src={speaker.photo.src}
                      alt={`Photo de ${speaker.name}`}
                      fill
                      sizes="(min-width: 1024px) 320px, (min-width: 768px) 30vw, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <span aria-hidden="true" className="type-condensed absolute inset-0 flex items-center justify-center text-display text-ink/20">
                      {initials(speaker.name)}
                    </span>
                  )}
                </div>
                {/* Fixed room for every line (2 for the name, 2 for the job, 1 + 1 for the part): all cards keep the same height. */}
                <figcaption className="flex flex-col items-center gap-1 px-1 pt-4 pb-1 text-center">
                  <span className="line-clamp-2 min-h-[2lh] text-body leading-tight font-semibold sm:text-heading">{speaker.name}</span>
                  <span className="line-clamp-2 min-h-[2lh] text-small text-muted">{speaker.role}</span>
                  <span className="type-meta mt-2 block truncate text-accent">{SPEAKER_KIND_LABEL[speaker.kind]}</span>
                  <span className="type-meta block truncate text-muted">{session}</span>
                </figcaption>
              </figure>
            </Tilt>
          </RevealItem>
        ))}
      </RevealGroup>
    </SpotlightGroup>
  );
}

/** Full-width band of names, placed after the grid outside the page shell. */
export function SpeakerMarquee({ speakers }: { speakers: readonly Speaker[] }) {
  return (
    <Marquee
      duration={26}
      className="mt-16 border-y border-rule py-5"
      items={bySession(speakers).map(({ speaker }) => (
        <span key={speaker.id} className="type-condensed flex items-center gap-8 px-8 text-title text-ink/15">
          {speaker.name} <span className="size-3 rotate-45 bg-signal" />
        </span>
      ))}
    />
  );
}

/** "Awa Koné, Jean Yao (modération)" for a session, or null when nobody is confirmed. */
export function speakerNames(speakers: readonly Speaker[], ref: string): string | null {
  const list = speakers.filter((s) => s.sessionRef === ref);
  if (list.length === 0) return null;
  return list.map((s) => (s.kind === "moderator" ? `${s.name} (modération)` : s.name)).join(", ");
}
