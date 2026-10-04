"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Photo } from "@/config/media";

const EASE = [0.76, 0, 0.24, 1] as const;

interface ImageFrameProps {
  photo: Photo;
  /** Tailwind aspect class, e.g. "aspect-[4/3]". */
  aspect?: string;
  sizes?: string;
  className?: string;
}

/**
 * Rounded image frame with a one-time curtain reveal: the frame opens from the
 * bottom while the picture settles from a slight zoom. Test visuals get a badge.
 */
export function ImageFrame({ photo, aspect = "aspect-[4/3]", sizes = "(min-width: 1024px) 45vw, 100vw", className = "" }: ImageFrameProps) {
  return (
    <motion.figure
      className={`relative overflow-hidden rounded-object bg-ink ${aspect} ${className}`}
      initial={{ clipPath: "inset(18% 0% 0% 0% round 1.25rem)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.25rem)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
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
      {photo.placeholder && <TestBadge />}
    </motion.figure>
  );
}

export function TestBadge({ className = "absolute top-4 left-4" }: { className?: string }) {
  return (
    <span className={`type-meta bg-ink/75 px-3 py-1.5 text-caption text-paper ${className}`}>
      Visuel test
    </span>
  );
}
