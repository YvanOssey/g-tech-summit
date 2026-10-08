import { CONFERENCES, FORMATIONS, PANELS } from "./programme";

/**
 * Sessions a speaker can be attached to, in the order of /programme. Their
 * ids are the anchors of the detailed descriptions (content/programme.ts).
 */
export interface SpeakerSession {
  ref: string;
  /** "Panel 1", "Formation 2"… */
  kind: string;
  title: string | null;
}

export const SPEAKER_SESSIONS: readonly SpeakerSession[] = [
  ...CONFERENCES.map((t) => ({ ref: t.id, kind: t.kind, title: t.title })),
  ...PANELS.map((t) => ({ ref: t.id, kind: t.kind, title: t.title })),
  ...FORMATIONS.map((f, i) => ({ ref: f.id, kind: `Formation ${i + 1}`, title: f.title })),
];

export const SPEAKER_SESSION_REFS = SPEAKER_SESSIONS.map((s) => s.ref) as [string, ...string[]];

export function sessionLabel(ref: string): string {
  const s = SPEAKER_SESSIONS.find((x) => x.ref === ref);
  return s ? (s.title ? `${s.kind} — ${s.title}` : s.kind) : ref;
}

/** Part a speaker plays in their session. */
export type SpeakerKind = "speaker" | "panelist" | "moderator" | "trainer";

export const SPEAKER_KINDS = ["speaker", "panelist", "moderator", "trainer"] as const satisfies readonly SpeakerKind[];

export const SPEAKER_KIND_LABEL: Record<SpeakerKind, string> = {
  speaker: "Intervenant",
  panelist: "Panéliste",
  moderator: "Modération",
  trainer: "Formateur",
};

/** A published speaker, as the public site shows it. */
export interface Speaker {
  id: string;
  name: string;
  role: string | null;
  kind: SpeakerKind;
  sessionRef: string;
  photo: { src: string; width: number; height: number } | null;
}
