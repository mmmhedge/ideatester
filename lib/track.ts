"use client";

const ATTR_KEY = "ideatester:attribution";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_path?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  first_seen?: string;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const existing = getStoredAttribution();
  const next: Attribution = {
    ...existing,
    utm_source: params.get("utm_source") ?? existing.utm_source,
    utm_medium: params.get("utm_medium") ?? existing.utm_medium,
    utm_campaign: params.get("utm_campaign") ?? existing.utm_campaign,
    utm_content: params.get("utm_content") ?? existing.utm_content,
    utm_term: params.get("utm_term") ?? existing.utm_term,
    fbclid: params.get("fbclid") ?? existing.fbclid,
    gclid: params.get("gclid") ?? existing.gclid,
    ttclid: params.get("ttclid") ?? existing.ttclid,
    referrer: existing.referrer ?? document.referrer ?? undefined,
    landing_path: existing.landing_path ?? url.pathname,
    first_seen: existing.first_seen ?? new Date().toISOString(),
  };
  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify(next));
  } catch {}
}

export function getStoredAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(ATTR_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function newEventId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Fire an event. Sends to all configured client analytics, then forwards
 * server-side via /api/track for adapters that need a server (Meta CAPI, GA4 MP).
 */
export function track(
  event: string,
  props: Record<string, unknown> = {},
  eventId: string = newEventId(),
) {
  if (typeof window === "undefined") return;
  const attribution = getStoredAttribution();
  const enriched = { ...props, ...attribution };

  // Client-side fan-out (best-effort, non-blocking).
  try { window.fbq?.("trackCustom", event, enriched, { eventID: eventId }); } catch {}
  try { window.posthog?.capture(event, enriched); } catch {}
  try { window.plausible?.(event, { props: stringifyProps(enriched) }); } catch {}
  try { window.gtag?.("event", event, enriched); } catch {}

  // Server-side fan-out.
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event,
        eventId,
        props: enriched,
        path: window.location.pathname,
      }),
      keepalive: true,
    });
  } catch {}
}

function stringifyProps(p: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v == null) continue;
    out[k] = typeof v === "string" ? v : JSON.stringify(v);
  }
  return out;
}
