export type TrackContext = {
  event: string;
  eventId: string;
  props: Record<string, unknown>;
  path?: string;
  ip?: string;
  userAgent?: string;
  /** Hashed/raw user info for ad-platform attribution. */
  user?: { email?: string; phone?: string };
};

export type Adapter = {
  key: string;
  /** Whether env is configured. If false, fan-out skips it. */
  enabled: () => boolean;
  track: (ctx: TrackContext) => Promise<void>;
};
