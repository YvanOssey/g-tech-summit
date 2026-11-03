import { EVENT } from "@/config/event";
import { PASSES, passesOnSale } from "@/config/passes";
import type { EventSettings } from "@/config/settings";
import { SITE_URL } from "@/config/site";

/**
 * schema.org "Event" description for search engines (Google can show the
 * dates and the place next to the result). Only confirmed facts: no time of
 * end, no address beyond what the admin entered.
 */
export function EventJsonLd({ settings }: { settings: EventSettings }) {
  const place = {
    "@type": "Place",
    name: settings.venue?.name ?? EVENT.city,
    address: {
      "@type": "PostalAddress",
      // Street only when a real address was entered (not just the city).
      ...(settings.venue?.address && settings.venue.address.trim().toLowerCase() !== EVENT.city.toLowerCase() ? { streetAddress: settings.venue.address } : {}),
      addressLocality: EVENT.city,
      addressCountry: "CI",
    },
  };

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${EVENT.name} ${EVENT.year}`,
    description: EVENT.summary,
    startDate: EVENT.doorsOpen.iso,
    endDate: EVENT.days[EVENT.days.length - 1].iso,
    eventStatus: "https://schema.org/EventScheduled",
    // On site only (no online pass this edition).
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: place,
    image: [`${SITE_URL}/opengraph-image`],
    url: SITE_URL,
    organizer: { "@type": "Organization", name: EVENT.organiser.name, email: EVENT.contact.email, url: SITE_URL },
    offers: passesOnSale(settings.sold).map((id) => ({
      "@type": "Offer",
      name: PASSES[id].name,
      price: PASSES[id].price,
      priceCurrency: "XOF",
      url: `${SITE_URL}/billetterie?pass=${id}`,
      ...(settings.registrationOpen ? { availability: "https://schema.org/InStock" } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      // JSON only, "<" escaped so the content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
