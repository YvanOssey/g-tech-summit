"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface BoardRow {
  time: string;
  label: string;
}

export interface BoardGroup {
  day: string;
  rows: readonly BoardRow[];
}

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#·:";
const LABEL_CELLS = 21;
const TICK = 45; // ms per flap

/** Pseudo-random but stable flap character (same on every render of a frame). */
const flap = (frame: number, seed: number) => CHARSET[(frame * 7 + seed * 13) % CHARSET.length];

/**
 * Split-flap departure board: every character flips through the alphabet and
 * settles one after the other, row after row, the first time the board is seen.
 * The server renders the final text (readable without JavaScript); with
 * reduced motion nothing flips. The visual grid is aria-hidden, a plain list
 * carries the same content for assistive technology.
 */
export function DepartureBoard({ groups, caption }: { groups: readonly BoardGroup[]; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduce) return;
    let f = 0;
    const id = window.setInterval(() => {
      f += 1;
      setFrame(f);
      if (f > 140) window.clearInterval(id);
    }, TICK);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  let rowIndex = 0;

  return (
    <div ref={ref} className="rounded-object border border-graphite bg-ink p-4 shadow-[0_30px_80px_-30px_rgb(242_140_24/0.35)] sm:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-graphite pb-3">
        <p className="type-meta text-signal">{caption}</p>
        <p className="type-meta text-mist">Heure · Session</p>
      </div>

      <ul className="sr-only">
        {groups.map((g) =>
          g.rows.map((r) => (
            <li key={g.day + r.time}>
              {g.day}, {r.time} : {r.label}
            </li>
          )),
        )}
      </ul>

      <div aria-hidden="true" className="mt-3 space-y-4 font-mono text-[clamp(0.5rem,2.2vw,0.95rem)] leading-none uppercase">
        {groups.map((g) => (
          <div key={g.day}>
            <p className="type-meta mb-2 text-mist">{g.day}</p>
            <div className="space-y-1.5">
              {g.rows.map((r) => {
                const row = rowIndex++;
                const chars = [...r.time, " ", ...r.label.padEnd(LABEL_CELLS).slice(0, LABEL_CELLS)];
                return (
                  <div key={r.time + r.label} className="flex gap-[0.12em]">
                    {chars.map((ch, i) => {
                      const settleAt = row * 6 + i * 1.6 + 6;
                      const shown = frame === null || frame >= settleAt || ch === " " ? ch : flap(frame, i + row * 31);
                      const isTime = i < 5;
                      return (
                        <span
                          key={i}
                          className={`relative flex h-[1.8em] w-[1.2em] items-center justify-center overflow-hidden rounded-[0.2em] bg-graphite/60 ${
                            isTime ? "text-signal" : "text-paper"
                          } ${ch === " " && i === 5 ? "bg-transparent" : ""}`}
                        >
                          {shown}
                          {/* hinge line of the flap */}
                          <span className="absolute inset-x-0 top-1/2 h-px bg-ink/80" />
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
