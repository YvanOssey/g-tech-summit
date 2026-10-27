"use client";

import { useDeferredValue, useId, useState } from "react";
import type { FaqItem } from "@/content/faq";
import { FaqList } from "@/components/ui/FaqList";
import { Search } from "@/components/ui/icons";

/** Accent-insensitive, case-insensitive text for matching. */
const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** FAQ with a live filter over questions and answers. Without JavaScript the full list shows. */
export function FaqSearch({ items }: { items: readonly FaqItem[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const q = norm(deferred.trim());
  const shown = q ? items.filter((i) => norm(`${i.q} ${i.a}`).includes(q)) : items;

  return (
    <div>
      <label htmlFor={id} className="type-label">
        Chercher une question
      </label>
      <div className="mt-3 flex items-center gap-3 rounded-input border border-rule-strong bg-surface px-4 transition-colors focus-within:border-mark">
        <Search className="size-5 shrink-0 text-muted" />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Billet, paiement, programme…"
          className="min-h-13 w-full bg-transparent py-3 text-body outline-none placeholder:text-muted"
        />
      </div>
      <p className="type-meta mt-3 text-muted" aria-live="polite">
        {shown.length} question{shown.length > 1 ? "s" : ""}
        {q ? ` pour « ${deferred.trim()} »` : ""}
      </p>
      <div className="mt-6">
        {shown.length ? (
          <FaqList items={shown} numbered />
        ) : (
          <p className="border-t border-rule-strong py-8 text-muted">
            Aucune question ne correspond. Écrivez-nous : l’équipe vous répond.
          </p>
        )}
      </div>
    </div>
  );
}
