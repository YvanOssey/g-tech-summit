"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Cloudflare Turnstile widget. Inside a <form>, it adds the hidden field
 * "cf-turnstile-response" checked by the server. A token works once: the
 * widget is reset whenever `resetKey` changes (after each submission).
 */
export function Turnstile({ siteKey, resetKey }: { siteKey: string; resetKey: unknown }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [ready, setReady] = useState(() => typeof window !== "undefined" && Boolean(window.turnstile));

  useEffect(() => {
    if (!ready || !box.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(box.current, {
      sitekey: siteKey,
      action: "checkout",
      language: "fr",
      theme: "light",
      size: "flexible",
      appearance: "interaction-only",
    });
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [ready, siteKey]);

  useEffect(() => {
    if (widget.current) window.turnstile?.reset(widget.current);
  }, [resetKey]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} />
      <div ref={box} />
    </>
  );
}
