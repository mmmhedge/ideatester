# ideatester

Modular landing pages for testing ideas / PMF cheap and fast. One config file = one landing page. Two launch tracks:

- **SaaS / consumer** — Instagram ads, hero image + lead form. → **`docs/RUNBOOK-saas.md`**
- **Crypto / technical** — X thread + litepaper + Promote post. → **`docs/RUNBOOK-crypto.md`**

Server-side conversion tracking (Meta CAPI, GA4, PostHog), one-command brand generation, automatic litepaper generation, X posting via API. Stack: Next.js (App Router) + TypeScript + Tailwind on Vercel free tier. Cost per validated/killed idea: $20–110 depending on ad spend.

## Quickstart

```bash
npm install
cp .env.example .env.local   # fill in only what you use
npm run dev
```

- Home page lists ideas: `http://localhost:3000`
- Example ideas: `/dogwalker`, `/aicoach`

## Auto-generate the brand

```bash
# After registering an idea in ideas/index.ts:
npm run brand -- dogwalker

# Skip image gen (text only — useful for iterating quickly):
npm run brand -- dogwalker --no-image
```

What you get:

- `ideas/<slug>.brand.json` — name, tagline, font key, palette key, monogram, image prompt
- `public/<slug>/hero.jpg` — editorial-style hero image
- The page at `/<slug>` automatically picks up the brand: chosen Google Font, palette as background + accent, wordmark in the header, hero image above the CTA

How it stays out of cringe territory:

- **Curated choices, not free-form.** Claude picks from 8 hand-selected fonts and 9 hand-selected palettes. No invented hex codes, no AI logo generation.
- **Hard style guide.** A list of banned phrases (`leverage`, `unlock`, `revolutionize`, etc.) and voice rules is enforced as the system prompt for every generation. See `lib/brand/style.ts` — edit it to taste.
- **Editorial-photo hero, never illustration.** Image prompts are wrapped in a fixed style suffix (`35mm film, natural daylight, shallow DoF, no text, no logos, no faces at camera`) so output reads as real, not AI.
- **Wordmark, not logo.** The name renders in the chosen font as a typographic mark — looks intentional, not generated.

Cost per idea: ~$0.05 (Claude call ~$0.01 + one image ~$0.04). Time: ~30s.

### Customizing

- Don't like a name? Re-run the script, or hand-edit `ideas/<slug>.brand.json`.
- Add a vibe steer in the idea config: `vibe: "feels like a neighborhood diner, not a startup"`. The generator reads it.
- Want more fonts/palettes? Add to `lib/brand/fonts.ts` / `lib/brand/palettes.ts`.
- Tighten the voice? Edit `lib/brand/style.ts` — the style guide is data, not code.

### Image provider

Set ONE of:

- `OPENAI_API_KEY` → uses `gpt-image-1` (needs OpenAI org verification, but easy once verified)
- `REPLICATE_API_TOKEN` → uses Flux 1.1 Pro on Replicate (simpler signup)

If neither is set, the script generates text only and skips the hero image.

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
