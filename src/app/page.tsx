import Link from "next/link";
import { EVENT } from "@/config/event";

// Temporary home page — replaced by the real homepage in the next step.
export default function Home() {
  return (
    <main className="shell flex min-h-svh flex-col justify-between py-6">
      <p className="type-meta text-grey-500">Site en construction</p>
      <div>
        <h1 className="type-condensed text-poster">
          {EVENT.name.split(" ")[0]}
          <br />
          {EVENT.name.split(" ")[1]} {EVENT.year}
        </h1>
        <p className="type-meta mt-6">18—19.12.2026 · {EVENT.city}</p>
      </div>
      <Link href="/systeme" className="type-meta underline underline-offset-4 hover:decoration-signal">
        Système de design →
      </Link>
    </main>
  );
}
