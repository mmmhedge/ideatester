type Lead = {
  slug: string;
  fields: Record<string, string>;
  attribution?: Record<string, unknown>;
};

export async function forwardLead(lead: Lead) {
  await Promise.allSettled([sendWebhook(lead), sendResendEmail(lead)]);
}

async function sendWebhook(lead: Lead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
  }).catch((e) => console.error("[webhook]", e));
}

async function sendResendEmail(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL ?? "onboarding@resend.dev";
  if (!apiKey || !to) return;

  const lines = [
    `New lead on /${lead.slug}`,
    "",
    ...Object.entries(lead.fields).map(([k, v]) => `${k}: ${v}`),
    "",
    "Attribution:",
    JSON.stringify(lead.attribution ?? {}, null, 2),
  ].join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject: `[ideatester] Lead — ${lead.slug}`,
      text: lines,
    }),
  }).catch((e) => console.error("[resend]", e));
}
