import Image from "next/image";
import { PARTNERS } from "@/config/partners";

/**
 * Partner logos on one line, separated by hairlines — no cards.
 * Heights are balanced optically: very wide logos get less height than square ones,
 * so every logo carries a similar visual weight. Original colours are kept.
 */
function displayHeight(width: number, height: number) {
  return Math.round(56 / Math.pow(width / height, 0.35));
}

export function PartnerLogos() {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4">
      {PARTNERS.map((p, i) => {
        const h = displayHeight(p.logo.width, p.logo.height);
        return (
          <li
            key={p.name}
            className={`flex min-h-32 items-center justify-center px-6 py-8 md:min-h-40 ${i % 2 === 1 ? "border-l border-rule" : ""} ${
              i >= 2 ? "border-t border-rule md:border-t-0" : ""
            } ${i === 2 ? "md:border-l" : ""}`}
          >
            <Image
              src={p.logo.src}
              alt={p.name}
              width={p.logo.width}
              height={p.logo.height}
              style={{ height: h, width: "auto" }}
              className="max-w-full object-contain"
            />
          </li>
        );
      })}
    </ul>
  );
}
