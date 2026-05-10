import type { Adapter, TrackContext } from "./types";

/**
 * PostHog server-side capture. We mostly track from the client, but server
 * fan-out gives us belt-and-suspenders coverage for ad blockers.
 */
export const posthog: Adapter = {
  key: "posthog",
  enabled: () => !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
  async track(ctx: TrackContext) {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY!;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
    const distinctId =
      (typeof ctx.props.distinct_id === "string" && ctx.props.distinct_id) ||
      (typeof ctx.user?.email === "string" && ctx.user.email) ||
      `anon-${ctx.eventId}`;

    const res = await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event: ctx.event,
        distinct_id: distinctId,
        properties: { ...ctx.props, $current_url: ctx.path, $ip: ctx.ip },
        timestamp: new Date().toISOString(),
      }),
    });
    if (!res.ok) console.error("[posthog] failed:", res.status, await res.text());
  },
};
