import { NextRequest, NextResponse } from "next/server";
import { fanout } from "@/lib/integrations";
import { logEvent } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.event || !body?.eventId) {
    return NextResponse.json({ error: "missing event" }, { status: 400 });
  }
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const ctx = {
    event: String(body.event),
    eventId: String(body.eventId),
    props: (body.props ?? {}) as Record<string, unknown>,
    path: typeof body.path === "string" ? body.path : undefined,
    ip,
    userAgent,
  };

  await Promise.allSettled([logEvent(ctx), fanout(ctx, body.integrations)]);
  return NextResponse.json({ ok: true });
}
