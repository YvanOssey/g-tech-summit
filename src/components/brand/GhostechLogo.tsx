import Image from "next/image";

/**
 * Official Ghostech logo (original PNG, transparent margins trimmed).
 * `light` is a variant for dark backgrounds where only the neutral greys
 * ("Ghos", circuit lines, motto) were lightened — the orange is untouched.
 * Source is 250×174 px: keep the rendered width ≤ 125 px until a vector master exists.
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
      src={variant === "light" ? "/brand/ghostech-logo-light.png" : "/brand/ghostech-logo.png"}
      alt="Ghostech"
      width={width}
      height={Math.round((width * 174) / 250)}
      className={className}
      preload={preload}
    />
  );
}
