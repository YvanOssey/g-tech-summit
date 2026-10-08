// Content Security Policy, shared by next.config.mjs (HTTP header) and the
// root layout (<meta> tag). Plain JavaScript so the config can import it on
// hosts without the native Next.js compiler (see docs/mise-en-ligne.md).
//
// Why both: Hostinger's CDN replaces the Content-Security-Policy header with
// its own ("upgrade-insecure-requests"), so the header alone never reaches
// visitors (audit F-06). A <meta> policy is part of the page and survives.
// frame-ancestors only works as a header: framing stays blocked by
// X-Frame-Options: DENY, which the CDN keeps.
//
// - forms only post to this site or to the Genius Pay checkout;
// - no plugin content, no <base> hijacking;
// (upgrade-insecure-requests is added by Hostinger's CDN; not set here so
// http://localhost keeps working.)
// Scripts are not restricted yet: Next.js and the intro curtain use inline
// scripts, which would need nonces.

const PAGE_DIRECTIVES = ["base-uri 'self'", "object-src 'none'", "form-action 'self' https://geniuspay.ci"];

export const CSP_HEADER = ["frame-ancestors 'none'", ...PAGE_DIRECTIVES].join("; ");

export const CSP_META = PAGE_DIRECTIVES.join("; ");
