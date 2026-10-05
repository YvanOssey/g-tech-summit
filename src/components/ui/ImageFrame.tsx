"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Photo } from "@/config/media";

const EASE = [0.76, 0, 0.24, 1] as const;

interface ImageFrameProps {
  photo: Photo;
  /** Tailwind aspect class, e.g. "aspect-[4/3]". */
  aspect?: string;
  sizes?: string;
  className?: string;
  /** Vertical drift of the picture inside its frame while scrolling, in % of the frame. */
  parallax?: number;
}

/**
 * Rounded image frame with a one-time curtain reveal (the frame opens from the
 * bottom while the picture settles from a slight zoom), then a slow parallax
 * drift of the picture inside the frame as the page scrolls.
 */
export function ImageFrame({
  photo,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 45vw, 100vw",
  className = "",
  parallax = 8,
}: ImageFrameProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);

  return (
    <motion.figure
      ref={ref}
      className={`relative overflow-hidden rounded-object bg-ink ${aspect} ${className}`}
      initial={{ clipPath: "inset(18% 0% 0% 0% round 1.25rem)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.25rem)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <motion.div className="absolute inset-x-0" style={{ top: `-${parallax}%`, bottom: `-${parallax}%`, y: reduce ? 0 : y }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            className="object-cover"
            style={{ objectPosition: photo.focus ?? "center" }}
          />
        </motion.div>
      </motion.div>
    </motion.figure>
  );
}
