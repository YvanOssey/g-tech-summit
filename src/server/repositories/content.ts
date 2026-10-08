import "server-only";
import { unstable_cache } from "next/cache";
import { PARTNERS, type Partner } from "@/config/partners";
import { FAQ, type FaqItem } from "@/content/faq";
import { DAYS, type Day, type Slot } from "@/content/programme";
import type { Speaker } from "@/content/speakers";
import { partnerLogoUrl } from "@/lib/partner-logo";
import { speakerPhotoUrl } from "@/lib/speaker-photo";
import { FAQ_TAG, PARTNERS_TAG, PROGRAMME_TAG, SPEAKERS_TAG } from "@/server/cache-tags";
import { createPublicClient } from "@/server/db/clients";
import { hasDatabase } from "@/server/db/env";

/**
 * Published partners, FAQ and programme slots for the public site, in the same shape as the
 * files they replace, so the components do not change. Read with the public
 * client (RLS: published rows only), cached and shared by every visitor,
 * refreshed when an admin saves (updateTag) and at most every 5 minutes.
 * If the database is missing or failing, the files are used instead.
 */

async function loadPartners(): Promise<readonly Partner[]> {
  if (!hasDatabase) return PARTNERS;
  try {
    const { data, error } = await createPublicClient()
      .from("partners")
      .select("name, logo_path, logo_width, logo_height")
      .eq("published", true)
      .order("position")
      .order("created_at");
    if (error || !data) {
      console.warn(`[content] partenaires indisponibles, fichier utilisé (${error?.code || error?.message || "aucune donnée"})`);
      return PARTNERS;
    }
    return data.map((p) => ({ name: p.name, logo: { src: partnerLogoUrl(p.logo_path), width: p.logo_width, height: p.logo_height } }));
  } catch (e) {
    console.warn(`[content] partenaires injoignables, fichier utilisé (${e instanceof Error ? e.name : "erreur"})`);
    return PARTNERS;
  }
}

async function loadFaq(): Promise<readonly FaqItem[]> {
  if (!hasDatabase) return FAQ;
  try {
    const { data, error } = await createPublicClient()
      .from("faq_items")
      .select("question, answer")
      .eq("published", true)
      .order("position")
      .order("created_at");
    if (error || !data) {
      console.warn(`[content] FAQ indisponible, fichier utilisé (${error?.code || error?.message || "aucune donnée"})`);
      return FAQ;
    }
    return data.map((f) => ({ q: f.question, a: f.answer }));
  } catch (e) {
    console.warn(`[content] FAQ injoignable, fichier utilisé (${e instanceof Error ? e.name : "erreur"})`);
    return FAQ;
  }
}

/**
 * The two days with their PUBLISHED slots, ordered by start time. Day names,
 * dates and themes stay in content/programme.ts. Rooms are never exposed
 * publicly (zone left empty). Speakers are shown once entered in the admin.
 */
async function loadProgramme(): Promise<readonly Day[]> {
  if (!hasDatabase) return DAYS;
  try {
    const { data, error } = await createPublicClient()
      .from("programme_slots")
      .select("day, start_time, end_time, type, title, subtitle, detail, speakers, ref")
      .eq("published", true)
      .order("day")
      .order("start_time")
      .order("position");
    if (error || !data) {
      console.warn(`[content] programme indisponible, fichier utilisé (${error?.code || error?.message || "aucune donnée"})`);
      return DAYS;
    }
    return DAYS.map((day) => ({
      ...day,
      slots: data
        .filter((s) => s.day === day.index)
        .map((s): Slot => ({
          start: s.start_time.slice(0, 5),
          ...(s.end_time ? { end: s.end_time.slice(0, 5) } : {}),
          type: s.type,
          title: s.title,
          ...(s.subtitle ? { subtitle: s.subtitle } : {}),
          ...(s.detail ? { detail: s.detail } : {}),
          zone: "",
          ...(s.ref ? { ref: s.ref } : {}),
          ...(s.speakers?.trim() ? { speakers: s.speakers.trim() } : {}),
        })),
    }));
  } catch (e) {
    console.warn(`[content] programme injoignable, fichier utilisé (${e instanceof Error ? e.name : "erreur"})`);
    return DAYS;
  }
}

/**
 * Published speakers, in the admin order. No file fallback: without the
 * database (or before migration 0008), the site shows "À confirmer".
 */
async function loadSpeakers(): Promise<readonly Speaker[]> {
  if (!hasDatabase) return [];
  try {
    const { data, error } = await createPublicClient()
      .from("speakers")
      .select("id, name, role, kind, session_ref, photo_path, photo_width, photo_height")
      .eq("published", true)
      .order("position")
      .order("created_at");
    if (error || !data) {
      console.warn(`[content] intervenants indisponibles (${error?.code || error?.message || "aucune donnée"})`);
      return [];
    }
    return data.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      kind: s.kind,
      sessionRef: s.session_ref,
      photo: s.photo_path && s.photo_width && s.photo_height ? { src: speakerPhotoUrl(s.photo_path), width: s.photo_width, height: s.photo_height } : null,
    }));
  } catch (e) {
    console.warn(`[content] intervenants injoignables (${e instanceof Error ? e.name : "erreur"})`);
    return [];
  }
}

export const getSpeakers = unstable_cache(loadSpeakers, ["speakers"], { tags: [SPEAKERS_TAG], revalidate: 300 });
export const getProgramme = unstable_cache(loadProgramme, ["programme"], { tags: [PROGRAMME_TAG], revalidate: 300 });
export const getPartners = unstable_cache(loadPartners, ["partners"], { tags: [PARTNERS_TAG], revalidate: 300 });
export const getFaq = unstable_cache(loadFaq, ["faq"], { tags: [FAQ_TAG], revalidate: 300 });
