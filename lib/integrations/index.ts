import type { Adapter, TrackContext } from "./types";
import { meta } from "./meta";
import { ga4 } from "./ga4";
import { posthog } from "./posthog";

export const adapters: Adapter[] = [meta, ga4, posthog];

export async function fanout(ctx: TrackContext, allowed?: string[]) {
  const enabled = adapters.filter((a) => a.enabled() && (!allowed?.length || allowed.includes(a.key)));
  await Promise.allSettled(enabled.map((a) => a.track(ctx).catch((e) => console.error(`[${a.key}]`, e))));
}

export type { TrackContext };
