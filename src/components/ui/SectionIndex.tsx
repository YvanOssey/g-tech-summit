interface SectionIndexProps {
  index: string;
  label: string;
  tone?: "light" | "dark";
}

/** Numbered section marker: "01 — Événement", set on a hairline like signage. */
export function SectionIndex({ index, label, tone = "light" }: SectionIndexProps) {
  const rule = tone === "light" ? "border-ink" : "border-paper/40";
  const muted = tone === "light" ? "text-grey-500" : "text-grey-400";
  return (
    <div className={`type-meta flex items-baseline gap-4 border-t pt-3 ${rule}`}>
      <span className={muted}>{index}</span>
      <span>{label}</span>
    </div>
  );
}
