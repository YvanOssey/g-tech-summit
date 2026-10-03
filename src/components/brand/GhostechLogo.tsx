import Image from "next/image";

/**
 * Official Ghostech logo (original PNG, transparent margins trimmed).
 * Source is 250×174 px — keep the rendered width ≤ 125 px to stay sharp on 2× screens
 * until a vector master is supplied.
 */
export function GhostechLogo({ width = 112, className }: { width?: number; className?: string }) {
  return (
    <Image
      src="/brand/ghostech-logo.png"
      alt="Ghostech"
      width={width}
      height={Math.round((width * 174) / 250)}
      className={className}
    />
  );
}
