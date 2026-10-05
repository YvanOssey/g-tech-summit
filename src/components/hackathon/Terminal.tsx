"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export interface TerminalLine {
  /** "cmd" lines are typed after a prompt, "out" lines are printed. */
  kind: "cmd" | "out";
  text: string;
}

const TYPE_MS = 32;
const PAUSE_MS = 260;

/**
 * A terminal window that types its lines on first paint. The server renders
 * every line (readable without JavaScript); the typing replays them on the
 * client. Reduced motion: printed at once.
 */
export function Terminal({ title, lines }: { title: string; lines: readonly TerminalLine[] }) {
  const reduce = useReducedMotion();
  // [line index, characters shown in that line]; null = everything shown
  const [cursor, setCursor] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (reduce) return;
    let line = 0;
    let char = 0;
    let timer = 0;
    const step = () => {
      if (line >= lines.length) {
        setCursor(null);
        return;
      }
      const target = lines[line];
      if (target.kind === "out") {
        // Output lines appear whole after a short pause.
        line += 1;
        char = 0;
        setCursor([line, 0]);
        timer = window.setTimeout(step, PAUSE_MS);
        return;
      }
      char += 1;
      if (char > target.text.length) {
        line += 1;
        char = 0;
        setCursor([line, 0]);
        timer = window.setTimeout(step, PAUSE_MS * 1.6);
        return;
      }
      setCursor([line, char]);
      timer = window.setTimeout(step, TYPE_MS);
    };
    // Hide the lines on the first frame, then start typing.
    const raf = window.requestAnimationFrame(() => setCursor([0, 0]));
    timer = window.setTimeout(step, 600);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [lines, reduce]);

  return (
    <div className="overflow-hidden rounded-object border border-graphite bg-ink shadow-[0_30px_80px_-30px_rgb(242_140_24/0.35)]">
      <div className="flex items-center gap-2 border-b border-graphite px-4 py-3">
        <span className="size-3 rounded-pill bg-signal" />
        <span className="size-3 rounded-pill bg-graphite" />
        <span className="size-3 rounded-pill bg-graphite" />
        <p className="type-meta ml-3 truncate text-mist">{title}</p>
      </div>

      <div className="space-y-2 p-5 font-mono text-small leading-relaxed sm:p-7">
        {lines.map((l, i) => {
          let text: string | null = l.text;
          let active = false;
          if (cursor) {
            const [li, ci] = cursor;
            if (i > li) text = null;
            else if (i === li) {
              text = l.kind === "cmd" ? l.text.slice(0, ci) : null;
              active = l.kind === "cmd";
            }
          }
          if (text === null) return <p key={i} aria-hidden="true" className="invisible">{l.kind === "cmd" ? `$ ${l.text}` : l.text}</p>;
          return (
            <p key={i} className={l.kind === "cmd" ? "text-paper" : "text-mist"}>
              {l.kind === "cmd" ? <span className="text-signal">$ </span> : <span className="text-signal">› </span>}
              {text}
              {active && <span className="caret ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-signal" />}
            </p>
          );
        })}
        {!cursor && (
          <p className="text-paper">
            <span className="text-signal">$ </span>
            <span className="caret inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-signal" />
          </p>
        )}
      </div>
    </div>
  );
}
