import { NextRequest, NextResponse } from "next/server";
import { fanout } from "@/lib/integrations";
import { logLead } from "@/lib/store";
import { forwardLead } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.fields || !body?.eventId) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    undefined;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const fields = body.fields as Record<string, string>;
  const attribution = (body.attribution ?? {}) as Record<string, unknown>;
  const eventName = String(body.eventName ?? "Lead");

  const lead = {
    slug: String(body.slug),
    eventId: String(body.eventId),
    eventName,
    value: typeof body.value === "number" ? body.value : undefined,
    fields,
    attribution,
    ip,
    userAgent,
  };

  await Promise.allSettled([
    logLead(lead),
    forwardLead({ slug: lead.slug, fields, attribution }),
    fanout(
      {
        event: eventName,
        eventId: lead.eventId,
        props: { ...attribution, value: lead.value, slug: lead.slug },
        path: typeof attribution.landing_path === "string" ? attribution.landing_path : undefined,
        ip,
        userAgent,
        user: { email: fields.email, phone: fields.phone },
      },
      body.integrations,
    ),
  ]);

  return NextResponse.json({ ok: true });
}
