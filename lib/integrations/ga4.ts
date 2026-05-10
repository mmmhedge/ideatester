import type { Adapter, TrackContext } from "./types";

/**
 * GA4 Measurement Protocol — server-side. Generates a persistent
 * client_id from a hash of UA + landing_path so basic sessionization works.
 */
export const ga4: Adapter = {
  key: "ga4",
  enabled: () => !!process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && !!process.env.GA4_API_SECRET,
  async track(ctx: TrackContext) {
    const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID!;
    const apiSecret = process.env.GA4_API_SECRET!;
    const clientId = String(ctx.props.client_id ?? `${Date.now()}.${Math.random().toString(36).slice(2)}`);

    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        client_id: clientId,
        events: [{ name: sanitizeEventName(ctx.event), params: sanitizeParams(ctx.props) }],
      }),
    });
    if (!res.ok) {
      console.error("[ga4 mp] failed:", res.status, await res.text());
    }
  },
};

function sanitizeEventName(e: string) {
  return e.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 40);
}

function sanitizeParams(p: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v == null) continue;
    out[k.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 40)] = typeof v === "object" ? JSON.stringify(v) : v;
  }
  return out;
}
