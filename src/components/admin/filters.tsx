import type { ReactNode } from "react";

/**
 * Filter bar submitted with GET: filters live in the address, so a filtered
 * view can be reloaded, shared between admins or exported as is.
 */
export function FilterBar({ children, resetHref }: { children: ReactNode; resetHref: string }) {
  return (
    <form method="get" className="mb-5 flex flex-wrap items-end gap-3 border border-ink/10 bg-paper p-4" role="search">
      {children}
      <button type="submit" className="min-h-10 rounded-input bg-ink px-4 text-small font-semibold text-paper hover:bg-ink/85">
        Filtrer
      </button>
      <a href={resetHref} className="min-h-10 content-center text-small underline underline-offset-4">
        Réinitialiser
      </a>
    </form>
  );
}

const control =
  "mt-1 block min-h-10 rounded-input border border-ink/25 bg-paper px-3 text-small focus:outline-2 focus:outline-offset-2 focus:outline-signal";

export function FilterSearch({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <label className="min-w-56 flex-1 text-small font-semibold">
      {label}
      <input type="search" name={name} defaultValue={defaultValue} placeholder={placeholder} className={`${control} w-full font-normal`} />
    </label>
  );
}

export function FilterSelect({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="text-small font-semibold">
      {label}
      <select name={name} defaultValue={defaultValue ?? ""} className={`${control} font-normal`}>
        <option value="">Tous</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterCheckbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-10 items-center gap-2 text-small">
      <input type="checkbox" name={name} value="1" defaultChecked={defaultChecked} className="size-4 accent-ink" />
      {label}
    </label>
  );
}

export function TestBadge() {
  return <span className="ml-1.5 inline-flex border border-signal/50 px-1.5 text-[0.75rem] font-medium text-[#7a4300]">test</span>;
}
