import { EVENT } from "@/config/event";

/**
 * Opening curtain, played once per visit (session) on the first full page load:
 * the event name rises letter by letter while an orange rule and a 00 → 100
 * counter fill, then the curtain lifts off the page.
 *
 * Pure CSS (see `.intro` in globals.css): it never waits for JavaScript, hides
 * itself even when scripts fail, lets clicks through, and is skipped with
 * reduced motion. The inline script only marks a repeat visit in the session
 * so the curtain does not replay on every reload.
 */
const SEEN_SCRIPT =
  "try{var k='gts-intro';if(sessionStorage.getItem(k))document.documentElement.classList.add('intro-seen');else sessionStorage.setItem(k,'1')}catch(e){}";

const WORD = `${EVENT.name}`;

export function IntroCurtain() {
  let letter = 0;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SEEN_SCRIPT }} />
      <div aria-hidden="true" className="intro theme-ink">
        <div className="intro-inner shell flex h-full flex-col justify-between py-8 md:py-10">
          <p className="type-meta flex justify-between text-mist">
            <span>{EVENT.edition}</span>
            <span>
              18—19.12.{EVENT.year} · {EVENT.city}
            </span>
          </p>

          <p className="type-condensed text-center text-[clamp(3rem,13vw,12rem)] leading-[0.85] whitespace-nowrap text-paper">
            {WORD.split(" ").map((word, wi) => (
              <span key={word} className={`inline-block overflow-hidden pb-[0.05em] align-top ${wi > 0 ? "ml-[0.25em] text-signal" : ""}`}>
                {[...word].map((ch) => (
                  <span key={letter} className="intro-char inline-block" style={{ animationDelay: `${0.1 + letter++ * 0.045}s` }}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </p>

          <div>
            <div className="h-px bg-graphite">
              <div className="intro-bar h-full bg-signal" />
            </div>
            <p className="mt-3 flex items-baseline justify-between">
              <span className="type-meta text-mist">Chargement</span>
              <span className="intro-count type-condensed text-heading leading-none text-paper" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
