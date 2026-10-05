"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Leans its content towards the mouse in 3D (max `max` degrees) — used for the
 * pass tickets. Inactive for touch and with reduced motion.
 */
export function Tilt({ children, max = 6, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), SPRING);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), SPRING);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className={`[perspective:1200px] ${className}`} onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div className="h-full [transform-style:preserve-3d]" style={{ rotateX, rotateY }}>
        {children}
      </motion.div>
    </div>
  );
}
