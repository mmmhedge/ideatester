# Runbook: launching a SaaS idea via Instagram / Meta ads

Step-by-step. Every link you need is here — no searching.

---

## 0. One-time setup (~30 min total, do once forever)

### Hosting (Vercel)
1. Sign up: <https://vercel.com/signup> (use GitHub login).
2. Install CLI locally: `npm install -g vercel`
3. From the project folder: `vercel link` → follow prompts, pick "create new project."
4. `vercel env pull .env.local` later if you want to mirror prod env locally.

### Domain (optional but recommended)
- Buy a single umbrella domain — every idea lives at `umbrella.com/<slug>`. **Don't buy a domain per idea.**
- Cheapest at: <https://porkbun.com> or <https://www.cloudflare.com/products/registrar/> (at-cost pricing).
- TLD suggestions: `.xyz`, `.fun`, `.click`, `.online` (~$2–10/yr).
- In Vercel: Project → Settings → Domains → add domain → paste the two DNS records Porkbun/Cloudflare shows back. ~5 min.

### Tracking accounts (all free)

**PostHog** (funnels + heatmaps — most useful single tool)
1. Sign up: <https://posthog.com/signup>
2. Project Settings → "Project API Key" → copy.
3. Paste into `.env.local`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```

**Meta Pixel + Conversions API** (Instagram + Facebook ads)
1. Go to <https://business.facebook.com> → create Business Manager if none.
2. Events Manager: <https://business.facebook.com/events_manager>
3. Connect Data Sources → Web → name it → grab the **Pixel ID** (15-digit number).
4. Same Pixel → Settings → Conversions API → "Generate access token" → copy.
5. Paste into `.env.local`:
   ```
   NEXT_PUBLIC_META_PIXEL_ID=123456789012345
   META_CAPI_PIXEL_ID=123456789012345
   META_CAPI_TOKEN=EAA...long-string
   META_CAPI_TEST_CODE=TEST12345   # remove after validating
   ```
6. Validate: deploy, submit a test lead, watch Events Manager → "Test Events" tab show your event live. Once you see both browser + server events with matching IDs (deduped), remove `META_CAPI_TEST_CODE`.

**Lead notifications (Resend)**
1. Sign up: <https://resend.com/signup>
2. API Keys → Create → copy.
3. `.env.local`:
   ```
   RESEND_API_KEY=re_xxx
   LEAD_NOTIFY_EMAIL=you@example.com
   ```

### Brand generator keys

1. Anthropic: <https://console.anthropic.com/settings/keys> → create key → `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxx
   ```
2. Image gen — pick one:
   - **OpenAI gpt-image-1**: <https://platform.openai.com/api-keys> → create key. Requires org verification (one-time, takes a few minutes). Then:
     ```
     OPENAI_API_KEY=sk-xxx
     ```
   - **Replicate Flux** (simpler signup): <https://replicate.com/account/api-tokens> → create token:
     ```
     REPLICATE_API_TOKEN=r8_xxx
     ```

---

## 1. Ship an idea (~5 min)

1. Open `ideas/`. Copy `dogwalker.ts` → `myidea.ts`. Edit the fields.
2. Register in `ideas/index.ts`: import + add to the map.
3. (Optional) Generate brand:
   ```
   npm run brand -- myidea
   ```
   Writes `ideas/myidea.brand.json` and `public/myidea/hero.jpg`. Edit the JSON if you want to tweak.
4. Deploy: `git push` if connected to Vercel via GitHub, or `vercel --prod`.
5. Live at `https://yourumbrella.com/myidea` (or `yourproject.vercel.app/myidea`).

---

## 1b. (Optional) Generate a promo video (~3 min, ~$0.30–$1)

For Instagram Reels / Stories, a short promo video usually beats a static image.

```bash
npm run promo -- myidea --dry-run        # preview the plan + overlay text
npm run promo -- myidea                  # actually generate (~$0.30 via Luma)
# Premium with audio (Veo 3):
npm run promo -- myidea --model google/veo-3
```

Output: `public/myidea/promo-9x16.mp4` (Reels/Story) + `public/myidea/promo-1x1.mp4` (feed).

The consumer preset uses your brand hero image as the starting frame (image-to-video) when `PUBLIC_BASE_URL` is set — gives visual continuity with the landing page.

**Add background music (optional):** drop an mp3 at `public/promo/music/consumer.mp3` and rerun. The renderer mixes it in at 50% under whatever audio the model produced.

**AI video is imperfect:** expect to re-roll ~1 in 3. Bad clips usually = the visual prompt was too abstract. The script prints the plan; edit `lib/promo/presets.ts` if you want to tighten the style globally.

In Ads Manager, upload the 9:16 version for Reels/Stories placements and the 1:1 for feed.

---

## 2. Launch the Instagram ad (~10 min)

Go to: <https://adsmanager.facebook.com/adsmanager/manage/campaigns>

1. **Create campaign** → Objective: **"Leads"** (not Traffic — Leads optimizes against your CAPI Lead event).
2. **Buying type:** Auction. **Campaign budget optimization:** off (control per-ad-set).
3. **Ad set:**
   - **Conversion location:** Website
   - **Performance goal:** Maximize number of conversions
   - **Pixel:** select the one you set up
   - **Conversion event:** `Lead`
   - **Budget:** start at $20/day, 3-day duration. Total: $60. Enough signal to read.
   - **Audience:** Advantage+ Audience (let Meta target). Add 1 interest as a hint (`Dog walking`, etc.). Locations: 2–3 countries max.
   - **Placements:** Manual. Tick Instagram Feed, Instagram Stories, Instagram Reels. Untick everything else for a pure IG test.
4. **Ad:**
   - **Identity:** your IG account
   - **Creative:** upload `public/myidea/hero.jpg` (the brand generator made this). Single image or carousel.
   - **Primary text:** one of the AI-generated ad copy variants (or hand-write)
   - **Headline:** the idea's tagline
   - **Website URL:**
     ```
     https://yourumbrella.com/myidea?utm_source=ig&utm_medium=paid&utm_campaign=myidea_v1&utm_content=hero1
     ```
   - **Call to action:** "Learn more" or "Sign up"
5. **Publish.** Meta will review for ~30 min then start serving.

---

## 3. Watch the result (~24–48 h after launch)

**Meta Ads Manager** — overall numbers:
- Cost per result (CPL). Anything < $3 is a strong signal for a $0–10 LTV B2C product. < $10 for higher-value.
- CTR. > 1% is good for cold traffic.

**PostHog funnel** — where people drop:
1. Open <https://us.posthog.com> → Insights → New → Funnel.
2. Add steps: `page_view` → `cta_click` → `Lead`.
3. Conversion at each step tells you the leak:
   - Low page_view → cta_click: headline isn't landing. Iterate copy.
   - Low cta_click → Lead: form friction. Reduce fields.

**Leads themselves**:
- Local: `data/leads.jsonl`
- Vercel: `/tmp/leads.jsonl` (ephemeral) — set `LEAD_WEBHOOK_URL` to a Google Sheet via Apps Script for durable storage:
  - Apps Script tutorial: <https://developers.google.com/apps-script/guides/web> (copy-paste a `doPost` that appends to a sheet, deploy as Web App, paste the URL into `LEAD_WEBHOOK_URL`).
- Or your inbox: `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` already wired.

---

## 4. Decide (~5 min)

Rules of thumb after spending $60–100:
- **CPL < $5 and >20 leads:** real signal. Kill the ad, talk to the leads, build the MVP.
- **CPL $5–15:** maybe. Iterate the headline + hero — generate a new variant slug (`myidea-v2`), split traffic 50/50 in Ads Manager.
- **CPL > $20 or < 5 leads:** kill it. The idea or the messaging is wrong. Don't burn more money optimizing a no.

---

## Cost summary
- Vercel: free tier
- Domain: $2–10/yr (one umbrella, all ideas)
- PostHog / Meta / Resend: free
- Brand gen: ~$0.05 per idea (one-time)
- Instagram ad budget: $60–100 per test (you control)
- **Total per validated/killed idea: $60–110**
