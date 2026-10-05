"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Clock, MapPin, TicketIcon, Wallet } from "@/components/ui/icons";

const ICONS = { pin: MapPin, clock: Clock, ticket: TicketIcon, wallet: Wallet } as const;

export interface InfoCard {
  icon: keyof typeof ICONS;
  k: string;
  v: string;
  note: ReactNode;
}

/** How much of each card peeks out from behind the one in front, in px. */
const PEEK = 36;

/**
 * Practical-info cards that unfold horizontally with the scroll.
 *
 * Large screens: the band is pinned while the page scrolls. The cards start
 * stacked on the right with a slight horizontal offset — the last card in
 * front, each previous one peeking out a little further behind. As the page
 * scrolls, they slide left one after the other to their place in a row,
 * still overlapping the next one while they travel.
 * Phones, short screens or reduced motion: a plain grid with a simple entrance.
 */
export function InfoDeck({ header, cards }: { header: ReactNode; cards: readonly InfoCard[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [offsets, setOffsets] = useState<number[] | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem) and (min-height: 40rem)");
    const update = () => setEnabled(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  // Horizontal distance from each card's place in the row to its place in the
  // stack (offsetLeft ignores transforms, so it is the final position).
  useEffect(() => {
    const el = row.current;
    if (!enabled || !el) return;
    const measure = () => {
      const items = [...el.children] as HTMLElement[];
      const last = items[items.length - 1];
      if (!last) return;
      setOffsets(items.map((c, i) => last.offsetLeft - c.offsetLeft - (items.length - 1 - i) * PEEK));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });

  return (
    <div ref={outer} style={enabled ? { height: "260svh" } : undefined}>
      <div className={enabled ? "sticky top-0 flex h-svh flex-col justify-center" : "pt-(--section-standard)"}>
        <div className="shell">
          {header}
          <ul ref={row} className="relative mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
            {cards.map((card, i) => (
              <DeckCard
                key={`${card.k}-${enabled ? "deck" : "plain"}`}
                card={card}
                index={i}
                count={cards.length}
                progress={progress}
                offset={enabled && offsets ? offsets[i] : null}
                plain={!enabled}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DeckCard({
  card,
  index,
  count,
  progress,
  offset,
  plain,
}: {
  card: InfoCard;
  index: number;
  count: number;
  progress: MotionValue<number>;
  offset: number | null;
  plain: boolean;
}) {
  const Icon = ICONS[card.icon];
  const depth = count - 1 - index; // 0 = front card (the last one)

  // The back card leaves first. Each slice overlaps the next, so a card is
  // still travelling (and overlapping) when the following one starts.
  const moving = count - 1;
  const slot = moving > 0 ? 0.7 / moving : 0;
  const start = 0.08 + Math.min(index, moving - 1) * slot * 0.75;
  const end = depth === 0 ? 1 : start + slot * 1.4;
  const x = useTransform(progress, [start, end], [offset ?? 0, 0]);
  const scale = useTransform(progress, [start, end], [1 - depth * 0.035, 1]);
  const shadow = useTransform(
    progress,
    [start, end],
    ["0 24px 50px -20px rgb(23 23 23 / 0.35)", "0 10px 30px -18px rgb(23 23 23 / 0.2)"],
  );

  const face = (
    <div className="panel card-interactive flex h-full min-h-60 flex-col rounded-object p-6">
      <span className="flex size-12 items-center justify-center rounded-pill bg-signal text-ink">
        <Icon className="size-6" />
      </span>
      <p className="type-label mt-8">{card.k}</p>
      <p className="type-headline mt-2 text-heading leading-tight">{card.v}</p>
      <p className="mt-2 text-small text-muted">{card.note}</p>
    </div>
  );

  if (plain || offset === null) {
    return (
      <motion.li
        className="relative"
        initial={plain ? { opacity: 0, y: 40 } : false}
        whileInView={plain ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
      >
        {face}
      </motion.li>
    );
  }

  return (
    <motion.li
      className="relative rounded-object"
      style={{ x, scale, boxShadow: shadow, zIndex: index + 1, transformOrigin: "100% 50%" }}
    >
      {face}
    </motion.li>
  );
}
