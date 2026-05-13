# Runbook: launching a crypto idea via X (Twitter)

Step-by-step. Every link, every button name, every value to paste — no searching.

This runbook assumes you've done the **one-time setup in `docs/RUNBOOK-saas.md` § 0** (Vercel, domain, Anthropic key). Only the X-specific bits are below.

---

## 0. One-time X setup (~20 min, do once forever)

### Create the project's X account
1. <https://x.com/i/flow/signup> — sign up. Use a project-dedicated email.
2. Pick a handle that matches your project (e.g. `@plumeproto`).
3. Profile setup (do this manually — automating it violates ToS and gets you banned):
   - **Display name:** project name.
   - **Bio:** one concrete sentence. The bio is your free ad slot.
   - **Profile photo:** wordmark from your landing page (screenshot the hero, crop).
   - **Header:** use `public/<slug>/hero.jpg` if you generated one.
   - **Pinned link in bio:** `https://yourumbrella.com/<slug>`
   - **Location:** leave blank or "Internet". (Empty = global Ads targeting works fine.)
4. **Verify your account** with a phone number — required for API access.

### Set up X Developer access (for API posting)
1. <https://developer.x.com/en/portal/dashboard> — log in with the project's X account.
2. Sign up for a developer account. You'll be asked for use case — say:
   > "Posting and managing scheduled content for a single project I own."
   Auto-approved most of the time.
3. **Project & App:**
   - Create new project → name it.
   - Create app inside it → name it.
   - **App settings → User authentication settings → Set up:**
     - **App permissions:** Read and write
     - **Type of App:** Web App, Automated App or Bot — pick **"Confidential client"**
     - **Callback URI:**
       ```
       http://127.0.0.1:8787/callback
       ```
     - **Website URL:** your landing page URL
     - Save.
   - **Keys and tokens tab → OAuth 2.0 Client ID and Client Secret → "Regenerate"** if not shown → **copy both**.
4. Paste into `.env.local`:
   ```
   X_CLIENT_ID=your_client_id
   X_CLIENT_SECRET=your_client_secret
   ```

### About X API costs
- As of Feb 2026, X uses **pay-per-use** billing. No free tier for new users.
- Posts without a URL: ~$0.015 each. Posts with a URL: ~$0.20 each.
- One launch (5–8 thread tweets + 5 teasers, one URL in the thread): ~$0.30–$0.50.
- Add a card: <https://developer.x.com/en/portal/products>

### Authorize the CLI to post
Run once:
```bash
npm run x -- auth
```
A URL prints. Open it. Click "Authorize app". Browser redirects to localhost showing "✓ Authorized". Tokens saved to `.x-tokens.json` (gitignored). Refresh handled automatically forever.

---

## 1. Build the idea (~10 min)

1. Copy `ideas/plume.ts` → `ideas/myidea.ts`. Edit the fields (set `kind: "crypto"`).
2. Register in `ideas/index.ts`.
3. Add the X handle inside `crypto.links.x` so the landing page footer links to it.

---

## 2. Generate the litepaper (~1 min, ~$0.02)

```bash
npm run litepaper -- myidea
```

- Writes `ideas/myidea.litepaper.md`.
- Live at `http://localhost:3000/myidea/litepaper` (or your deployed URL after pushing).
- **Read it.** Edit the markdown by hand wherever it lies. The Open Questions section especially — those should be genuine.
- For a PDF: open the page → browser print → "Save as PDF". Print CSS is already wired (white background, no nav).
- For a downloadable PDF on the site: print once, save to `public/<slug>/litepaper.pdf`, link to it from the page.

## 2b. (Optional) Generate a promo video (~3 min, ~$0.30–$1)

A short technical promo punches above its weight on X. The `crypto` preset is locked to a dark/monospace/single-green-accent look — feels like Anoma/Optimism announcement videos, not memecoin clips.

```bash
npm run promo -- myidea --dry-run        # preview prompt + overlays
npm run promo -- myidea                  # generate (~$0.30 via Luma)
# Premium with audio (Veo 3):
npm run promo -- myidea --model google/veo-3
```

Output: `public/myidea/promo-9x16.mp4` + `promo-1x1.mp4`. Attach to the launch thread (X allows one video per tweet; put it in the opening post — it dramatically lifts dwell time and the algorithm rewards it).

**The promo video tweet does NOT need a URL.** Keep the URL in a separate, later post in the thread to stay on the cheap API tier.

Add ambient music: drop an mp3 at `public/promo/music/crypto.mp3`. The renderer mixes it in.

---

## 3. Generate X post drafts (~30 s, ~$0.01)

```bash
npm run x -- drafts myidea
```

- Writes `ideas/myidea.x.json`: a launch thread (5–8 tweets) + 4–8 standalone teasers + a Promote config.
- **Open the file and edit.** This is the one step you should never skip — the LLM gets the technical claims approximately right but you'll often spot a stretch or a banal opener. Rewrite freely.
- Style guardrails (banned phrases, no emojis, etc.) are in `lib/brand/crypto-style.ts` — edit there to tune output across all future generations.

## 4. Deploy the landing page

```bash
git push    # if Vercel is git-connected
# or
vercel --prod
```

Confirm `https://yourumbrella.com/myidea` and `/myidea/litepaper` look right.

---

## 5. Post the launch thread (~30 s, ~$0.30)

```bash
npm run x -- send myidea --thread
```

- Posts each tweet of the thread, threaded as replies.
- Prints URLs as it goes. **Save the URL of the first tweet** — that's the one you'll promote.

## 6. Drop teasers over the week (~$0.02 each)

```bash
npm run x -- send myidea --teaser 0
npm run x -- send myidea --teaser 1
# etc.
```

Spread them across a few days. Each is a quotable standalone post (no URL, cheap API price).

---

## 7. Promote a post (~30 s, $20–50)

The X Ads API is partner-gated and not available for indie devs. The "Promote post" web flow is 30 seconds though, and the CLI prints the exact inputs:

```bash
npm run x -- promote myidea
```

Output looks like:
```
=== X Promote: ... ===
Which post:    launch_thread[0]
Goal:          website clicks
Budget:        $30 total
Duration:      3 days
Languages:     en
Locations:     United States, United Kingdom, Germany
Interests:     Cryptocurrencies, Ethereum, Hardware engineering
Headline:      ...
```

Now in the browser:
1. Open the first thread tweet (URL from step 5).
2. On X **web** (not mobile — promote isn't always in the mobile app): click the **three-dot menu** on the tweet → **"Promote post"**.
   - If that option is missing, go to <https://ads.x.com/> → "Create new campaign" → "Quick promote" → pick the tweet.
3. Paste the values from the CLI output into the modal.
4. Add payment method if first time.
5. **Launch.**

You'll see impressions/engagements within ~1 hour. X Ads dashboard: <https://ads.x.com/>

---

## 8. Watch the result (~3 days)

Three places to look:

**X Analytics** — engagement on the promoted post:
- <https://x.com/i/account_analytics> (organic + paid combined)
- Look at: impressions, link clicks, profile visits, follows.
- Healthy benchmark for a small technical project: > 2% link click rate on promoted post.

**X Ads dashboard** — paid metrics:
- <https://ads.x.com/>
- Cost per link click (CPLC). < $1 is great for crypto/dev. $1–3 is okay. > $5 means the targeting or hook is wrong.

**Your landing-page funnel** — leads + funnel drop-off:
- PostHog funnel: `page_view` → `cta_click` → `Lead` (same as the SaaS runbook).
- Leads stored in `data/leads.jsonl` / your webhook / Resend emails.

---

## 9. Decide

- **>50 high-quality testnet-access signups + meaningful follows:** real interest. Talk to 5 leads, schedule calls, validate the technical premise.
- **High clicks, low signups:** landing isn't converting. Iterate hero copy / form friction.
- **Low clicks, low signups:** the hook isn't landing. Iterate the launch-thread first tweet — that's 80% of click-through. Re-promote with the new opening.
- **Crickets after $50 ad spend:** the audience doesn't care. Either re-target (different interests, broader geo) or kill.

---

## Cost summary

| Item                          | Cost                          |
|-------------------------------|-------------------------------|
| Vercel hosting                | $0                            |
| Domain                        | $2–10/yr (one umbrella)       |
| Anthropic (litepaper + posts) | ~$0.03 / idea                 |
| Brand image (optional)        | ~$0.05 / idea                 |
| X API (post a launch)         | ~$0.30 / launch               |
| X Ads (promote)               | $20–50 / launch (your choice) |
| **Total per launch**          | **~$20–50**                   |

---

## What's NOT automated (by design, not laziness)

These are X ToS violations / scammy patterns. Don't.

- **Automated account creation** — instant ban.
- **Fake follows or engagement bots** — instant ban, also makes you read as a scam to the actual builders you're trying to reach.
- **Multiple sock-puppet accounts** — same.
- **Automated promote campaigns** — X Ads API is partner-only; the web flow is 30 seconds.

If you want true multi-channel automation, **Reddit Ads API** is the closest equivalent that's self-serve and crypto-friendly. Not wired in this repo but doable in ~50 lines if you want it later.
