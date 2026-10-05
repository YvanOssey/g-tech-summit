import Image from "next/image";

/**
 * Official Ghostech logo (2026 version: stacked mark, wordmark and motto;
 * PNG with transparent margins trimmed).
 * `light` is a variant for dark backgrounds where only the neutral greys
 * ("Ghos" and the motto) were lightened — the orange is untouched.
 * Source is 362×386 px: keep the rendered width ≤ 180 px until a vector master exists.
 */
export function GhostechLogo({
  width = 112,
  variant = "dark",
  className,
  preload,
}: {
  width?: number;
  variant?: "dark" | "light";
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={variant === "light" ? "/brand/ghostech-logo-2026-light.png" : "/brand/ghostech-logo-2026.png"}
      alt="Ghostech"
      width={width}
      height={Math.round((width * 386) / 362)}
      className={className}
      preload={preload}
    />
  );
}
