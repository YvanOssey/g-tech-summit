import { ImageResponse } from "next/og";
import { EVENT } from "@/config/event";

export const alt = `${EVENT.name} ${EVENT.year} — 18 & 19 décembre, ${EVENT.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share preview (WhatsApp, LinkedIn…) in the event identity: ink, paper, one orange signal. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#171717",
          color: "#FFFDF8",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#9C9A94", letterSpacing: 2 }}>
          <span>ORGANISÉ PAR GHOSTECH</span>
          <span>{EVENT.city.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 800, lineHeight: 0.9, letterSpacing: -4 }}>
          <span>G-TECH</span>
          <span>SUMMIT 2026</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 34 }}>
          <div style={{ width: 22, height: 22, background: "#F28C18" }} />
          <span>18 — 19 décembre 2026</span>
        </div>
      </div>
    ),
    size,
  );
}
