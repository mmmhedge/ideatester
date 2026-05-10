# ideatester

Modular landing pages for testing ideas / PMF cheap and fast. One config file = one landing page. Server-side conversion tracking that works with Instagram + Facebook ads (Meta CAPI), GA4, PostHog, Plausible, plus pluggable lead forwarders (webhook, Resend).

Stack: Next.js 15 (App Router) + TypeScript + Tailwind. Deploys to Vercel free tier. Cost: ~$0/mo + ~$10/yr domain.

## Quickstart

```bash
npm install
cp .env.example .env.local   # fill in only what you use
npm run dev
```

- Home page lists ideas: `http://localhost:3000`
- Example ideas: `/dogwalker`, `/aicoach`

## Add a new idea

1. Create `ideas/myidea.ts` exporting an `Idea` (see `ideas/types.ts`).
2. Register it in `ideas/index.ts`.
3. Push. It's live at `/myidea`.

A minimal idea:

```ts
import type { Idea } from "./types";

export const myidea: Idea = {
  slug: "myidea",
  title: "Headline — Brand",
  hero: { headline: "Big claim.", sub: "One-liner.", primaryCta: "Join waitlist" },
  form: {
    fields: [{ name: "email", label: "Email", type: "email", required: true }],
    submitLabel: "Get early access",
    successHeadline: "You're in.",
    successBody: "We'll be in touch.",
    conversionEvent: "Lead",
    conversionValue: 5,
  },
};
```

## Tracking — what fires when

Every page sends:
- `page_view` on mount
- `cta_click` when the hero CTA is clicked
- A conversion event (default `Lead`) on form submit, with the same `event_id` on both browser pixel and server-side CAPI for **deduplication** — so Meta only counts the conversion once.

UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`), `fbclid`, `gclid`, `ttclid`, `referrer`, and the landing path are captured on first visit and stored in localStorage. They ride along with every subsequent event and lead, so you can attribute Instagram → conversion end-to-end.

## Integrations — set the env var, it lights up

| Adapter   | Env vars                                                           | What it does                                          |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| Meta      | `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN`, `META_CAPI_PIXEL_ID` | Pixel + Conversions API (Instagram + Facebook ads)    |
| GA4       | `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `GA4_API_SECRET`                 | Server-side Measurement Protocol                      |
| PostHog   | `NEXT_PUBLIC_POSTHOG_KEY` (+ `NEXT_PUBLIC_POSTHOG_HOST`)           | Funnels, heatmaps, replays — generous free tier       |
| Plausible | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`                                     | Privacy-friendly analytics (paid, but light)          |
| Webhook   | `LEAD_WEBHOOK_URL`                                                 | POSTs each lead — great for Zapier / Apps Script      |
| Resend    | `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`                              | Emails you each new lead                              |

Skip any you don't want — the adapter is a no-op if its env isn't set. To add a new integration: drop a file in `lib/integrations/`, implement `Adapter`, register it in `lib/integrations/index.ts`.

## Running an Instagram ad test (the full loop)

1. **Set up Meta CAPI** in Events Manager, create a "Lead" custom event. Paste the pixel id and CAPI token into env. While testing, set `META_CAPI_TEST_CODE` to validate events live.
2. **Deploy**: `vercel deploy` (or push to a Vercel-connected repo).
3. **Ship a landing page** for the idea (one config file).
4. **Create the ad** in Meta Ads Manager. Pick "Leads" objective. Point the ad URL at `https://yoursite.com/myidea?utm_source=ig&utm_medium=paid&utm_campaign=myidea_v1`.
5. **Spend $20–50** over 24–48h. Look at:
   - Meta Ads Manager: cost-per-lead (CAPI keeps this accurate even when iOS / ad blockers nuke the pixel).
   - PostHog funnel: `page_view` → `cta_click` → `Lead`. Find the leak.
   - `data/leads.jsonl` (or your webhook destination): the actual people.
6. **Iterate**: change headline → new variant slug (`myidea-v2`) → split traffic in Ads Manager. Kill or scale based on CPL + funnel rates.

## Lead storage

By default, leads are appended to `data/leads.jsonl` locally and `/tmp/leads.jsonl` on serverless. For a durable store add a webhook (`LEAD_WEBHOOK_URL`) pointing at:
- A Google Apps Script Web App appending to a Sheet (free, 5 min setup)
- Zapier / Make → anywhere
- Your own DB

This keeps the codebase free of vendor lock-in.

## Project layout

```
app/
  [slug]/page.tsx       # generic idea renderer
  api/track/route.ts    # server-side analytics fan-out
  api/lead/route.ts     # lead capture + forwarders + conversion fan-out
components/             # Hero, Features, FAQ, WaitlistForm, MetaPixel, etc.
ideas/                  # one file per idea + index.ts
lib/
  track.ts              # client tracker + UTM persistence
  integrations/         # one adapter per platform
  store.ts              # JSONL log
  notify.ts             # webhook / email forwarders
```

## Things you can do next (still cheap)

- Wildcard subdomains (`idea1.test.com`) by adding a `host` rewrite — pricier than path-based but each idea looks like its own product.
- A/B test variants per idea by adding a `variants` array and a cookie-based picker.
- Replace JSONL with Turso / Vercel KV / Upstash (free tiers) for queryable leads.
- Add a `/admin` page (basic auth) listing leads + funnel counts, instead of opening JSONL.
