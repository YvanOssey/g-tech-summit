import "server-only";
import { unstable_cache } from "next/cache";
import { PARTNERS, type Partner } from "@/config/partners";
import { FAQ, type FaqItem } from "@/content/faq";
import { partnerLogoUrl } from "@/lib/partner-logo";
import { FAQ_TAG, PARTNERS_TAG } from "@/server/cache-tags";
import { createPublicClient } from "@/server/db/clients";
import { hasDatabase } from "@/server/db/env";

/**
 * Published partners and FAQ for the public site, in the same shape as the
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

export const getPartners = unstable_cache(loadPartners, ["partners"], { tags: [PARTNERS_TAG], revalidate: 300 });
export const getFaq = unstable_cache(loadFaq, ["faq"], { tags: [FAQ_TAG], revalidate: 300 });
