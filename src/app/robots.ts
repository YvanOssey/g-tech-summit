import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/systeme", "/admin", "/billet/", "/billetterie/inscription", "/billetterie/confirmation"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
