"use client";

import { useEffect, useRef, type MutableRefObject } from "react";

/** Pointer position in [-0.5, 0.5] and hero scroll progress in [0, 1], written by the hero. */
export interface SceneInput {
  px: number;
  py: number;
  scroll: number;
}

const SIGNAL = "242,140,24";
/** Depth levels used to batch draw calls. */
const LEVELS = 6;
const TAIL = 8;
const PAPER = "255,253,248";

type Vec = [number, number, number];

function rotate([x, y, z]: Vec, ax: number, ay: number, az = 0): Vec {
  // Z, then X, then Y
  let cx = x * Math.cos(az) - y * Math.sin(az);
  let cy = x * Math.sin(az) + y * Math.cos(az);
  x = cx;
  y = cy;
  cy = y * Math.cos(ax) - z * Math.sin(ax);
  let cz = y * Math.sin(ax) + z * Math.cos(ax);
  y = cy;
  z = cz;
  cx = x * Math.cos(ay) + z * Math.sin(ay);
  cz = -x * Math.sin(ay) + z * Math.cos(ay);
  return [cx, y, cz];
}

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
function sphere(n: number): Vec[] {
  const pts: Vec[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    pts.push([Math.cos(golden * i) * r, y, Math.sin(golden * i) * r]);
  }
  return pts;
}

const RINGS = [
  { radius: 1.42, tiltX: 1.2, tiltZ: 0.35, wave: 3, amp: 0.05, speed: 0.5, width: 1.6 },
  { radius: 1.7, tiltX: 1.42, tiltZ: -0.5, wave: 4, amp: 0.07, speed: -0.35, width: 1.1 },
  { radius: 1.22, tiltX: 0.5, tiltZ: 1.1, wave: 2, amp: 0.04, speed: 0.7, width: 0.9 },
] as const;

/**
 * Real-time 3D scene on a 2D canvas — no WebGL library:
 * a rotating sphere of points, three wavy neon orbits with sparks travelling
 * along them, and dust drifting in depth. Everything is orange or paper.
 *
 * Follows the pointer (tilt) and the scroll (zoom + spin). Pauses off-screen
 * and in background tabs; draws a single still frame with reduced motion.
 */
export function OrbScene({
  input,
  size = 0.3,
  className = "",
}: {
  input: MutableRefObject<SceneInput>;
  /** Sphere radius as a fraction of the canvas' smaller side. */
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 64rem)").matches;
    const points = sphere(small ? 360 : 720);
    const dust: Vec[] = Array.from({ length: small ? 40 : 90 }, () => [
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
    ]);

    const buckets: number[][] = Array.from({ length: LEVELS * 2 }, () => []);

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);

    // Smoothed pointer
    let sx = 0;
    let sy = 0;

    function draw(t: number) {
      if (!ctx) return;
      const { px, py, scroll } = input.current;
      sx += (px - sx) * 0.06;
      sy += (py - sy) * 0.06;

      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * size * (1 + scroll * 0.35);
      const cx = w / 2 + sx * 30;
      const cy = h / 2 + sy * 30;
      const f = R * 3.2; // camera distance
      const ay = t * 0.00016 + sx * 0.9 + scroll * 1.6;
      const ax = -0.32 + sy * 0.6;

      const project = (v: Vec): [number, number, number, number] => {
        const s = f / (f + v[2] * R);
        return [cx + v[0] * R * s, cy + v[1] * R * s, s, v[2]];
      };

      // Core light (only the area it covers)
      const coreR = R * 1.25;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      core.addColorStop(0, `rgba(${SIGNAL},0.32)`);
      core.addColorStop(0.45, `rgba(${SIGNAL},0.08)`);
      core.addColorStop(1, `rgba(${SIGNAL},0)`);
      ctx.fillStyle = core;
      ctx.fillRect(cx - coreR, cy - coreR, coreR * 2, coreR * 2);

      ctx.globalCompositeOperation = "lighter";

      // Sphere of points — back faint, front bright; one in seven is orange.
      // Points are sorted into a few opacity levels so each level is one fill call.
      for (const b of buckets) b.length = 0;
      for (let i = 0; i < points.length; i++) {
        const [x, y, s, z] = project(rotate(points[i], ax, ay));
        const front = (1 - z) / 2; // 0 back → 1 front
        const size = (0.6 + front * 1.4) * s * (1 + Math.sin(t * 0.0012 + i) * 0.15);
        const level = Math.min(LEVELS - 1, Math.floor(front * LEVELS));
        buckets[(i % 7 === 0 ? LEVELS : 0) + level].push(x - size / 2, y - size / 2, size);
      }
      for (let k = 0; k < buckets.length; k++) {
        const list = buckets[k];
        if (!list.length) continue;
        const orange = k >= LEVELS;
        const front = ((k % LEVELS) + 0.5) / LEVELS;
        ctx.globalAlpha = orange ? 0.25 + front * 0.75 : 0.06 + front * 0.5;
        ctx.fillStyle = orange ? `rgb(${SIGNAL})` : `rgb(${PAPER})`;
        ctx.beginPath();
        for (let j = 0; j < list.length; j += 3) ctx.rect(list[j], list[j + 1], list[j + 2], list[j + 2]);
        ctx.fill();
      }

      // Neon orbits — segments grouped by depth level, one stroke per level.
      ctx.lineCap = "round";
      ctx.strokeStyle = `rgb(${SIGNAL})`;
      RINGS.forEach((ring, ri) => {
        const steps = 120;
        const phase = t * 0.0006 * ring.speed;
        const at = (a: number): Vec => {
          const rr = ring.radius * (1 + Math.sin(a * ring.wave + phase * 3) * ring.amp);
          return rotate(rotate([Math.cos(a) * rr, Math.sin(a) * rr, 0], ring.tiltX, 0, ring.tiltZ), ax, ay);
        };

        const pts = [];
        for (let k = 0; k <= steps; k++) pts.push(project(at((k / steps) * Math.PI * 2)));
        for (let level = 0; level < LEVELS; level++) {
          const front = (level + 0.5) / LEVELS;
          ctx.globalAlpha = 0.12 + front * 0.7;
          ctx.lineWidth = ring.width * (0.6 + front) * (0.85 + front * 0.3);
          ctx.beginPath();
          for (let k = 0; k < steps; k++) {
            const p0 = pts[k];
            const p1 = pts[k + 1];
            const f01 = (1 - (p0[3] + p1[3]) / 2 / ring.radius) / 2;
            if (Math.min(LEVELS - 1, Math.max(0, Math.floor(f01 * LEVELS))) !== level) continue;
            ctx.moveTo(p0[0], p0[1]);
            ctx.lineTo(p1[0], p1[1]);
          }
          ctx.stroke();
        }

        // Sparks with short comet tails
        for (let sIdx = 0; sIdx < 3; sIdx++) {
          const head = phase * 6 + (sIdx * Math.PI * 2) / 3 + ri;
          for (let tail = 0; tail < TAIL; tail++) {
            const p = project(at(head - tail * 0.04 * Math.sign(ring.speed)));
            ctx.globalAlpha = (1 - tail / TAIL) * (0.35 + ((1 - p[3] / ring.radius) / 2) * 0.65);
            ctx.fillStyle = tail === 0 ? `rgb(${PAPER})` : `rgb(${SIGNAL})`;
            const size = Math.max((3.2 - tail * 0.3) * p[2], 0.4);
            ctx.beginPath();
            ctx.arc(p[0], p[1], size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      ctx.globalAlpha = 1;

      // Drifting dust in depth (parallax: nearer moves more with the pointer)
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        const y = ((((d[1] - t * 0.00004 * (1 + (i % 3))) % 4) + 6) % 4) - 2;
        const s = f / (f + d[2] * R);
        const x = cx + (d[0] + sx * d[2] * 0.3) * R * s * 0.9;
        const yy = cy + (y + sy * d[2] * 0.3) * R * s * 0.9;
        const size = 1.4 * s;
        ctx.fillStyle = i % 4 === 0 ? `rgba(${SIGNAL},${0.5 * s})` : `rgba(${PAPER},${0.25 * s})`;
        ctx.fillRect(x, yy, size, size);
      }

      ctx.globalCompositeOperation = "source-over";
    }

    if (reduce) {
      draw(0);
      return () => ro.disconnect();
    }

    let raf = 0;
    let visible = true;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [input, size]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block size-full ${className}`} />;
}
