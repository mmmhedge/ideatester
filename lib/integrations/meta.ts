import { createHash } from "crypto";
import type { Adapter, TrackContext } from "./types";

function sha256(s: string) {
  return createHash("sha256").update(s.trim().toLowerCase()).digest("hex");
}

/**
 * Meta Conversions API adapter — covers Instagram + Facebook ads.
 * Uses the same eventId as the browser pixel for deduplication.
 */
export const meta: Adapter = {
  key: "meta",
  enabled: () => !!process.env.META_CAPI_TOKEN && !!process.env.META_CAPI_PIXEL_ID,
  async track(ctx: TrackContext) {
    const token = process.env.META_CAPI_TOKEN!;
    const pixelId = process.env.META_CAPI_PIXEL_ID!;
    const testCode = process.env.META_CAPI_TEST_CODE;

    const userData: Record<string, unknown> = {
      client_user_agent: ctx.userAgent,
      client_ip_address: ctx.ip,
    };
    if (ctx.user?.email) userData.em = sha256(ctx.user.email);
    if (ctx.user?.phone) userData.ph = sha256(ctx.user.phone);
    if (typeof ctx.props.fbclid === "string") userData.fbc = `fb.1.${Date.now()}.${ctx.props.fbclid}`;

    const value = typeof ctx.props.value === "number" ? ctx.props.value : undefined;

    const body = {
      data: [
        {
          event_name: ctx.event,
          event_time: Math.floor(Date.now() / 1000),
          event_id: ctx.eventId,
          action_source: "website",
          event_source_url: ctx.props.landing_path
            ? `${ctx.props.landing_path}`
            : ctx.path,
          user_data: userData,
          custom_data: {
            ...(value !== undefined ? { value, currency: "USD" } : {}),
            utm_source: ctx.props.utm_source,
            utm_campaign: ctx.props.utm_campaign,
            utm_medium: ctx.props.utm_medium,
          },
        },
      ],
      ...(testCode ? { test_event_code: testCode } : {}),
    };

    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[meta capi] failed:", res.status, text);
    }
  },
};
