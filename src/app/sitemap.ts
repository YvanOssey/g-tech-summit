import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const ROUTES = ["", "/programme", "/hackathon", "/infos-pratiques", "/billetterie", "/partenaires"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
