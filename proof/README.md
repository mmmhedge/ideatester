# PROOF

Not generated — printed, by hand, on paper.

A running record of things people actually made: photography, music, design,
writing, film, craft — and whatever else it grows into. Two ways in:

- **Submit a work** — something you actually made.
- **Propose a topic** — a prompt for someone else to make something.

Every accepted submission gets written or printed onto one physical sheet of
paper by hand, photographed, and pinned to the roll on the site. It's not a
24/7 livestream — the "live" light only turns on while something is actively
being added, and the roll itself is always browsable, filterable by cluster
(topic/discipline), whether it's on or off.

## Run it

```bash
npm install
cp .env.example .env.local   # optional — sets the admin passphrase
npm run dev
```

- `/` — the paper roll (feed), filterable by cluster, with the live/resting status
- `/submit` — the two-way submission form
- `/admin` — the desk: review the queue, attach a photo of the physical paper,
  publish to the roll, toggle live status (default passphrase: `letmein`)

## How it's wired

- `lib/store.ts` — flat JSON-file store (`data/db.json`, gitignored, seeded on
  first run). Good enough for one person running one paper; swap for a real
  DB if this grows past that.
- `app/api/upload` — accepts an image (the photo of the paper) and writes it
  to `public/uploads/`.
- `app/api/submissions` — public submission intake, lands in a pending queue.
- `app/api/admin/*` — passphrase-gated: publish a pending submission to the
  roll (with the photo + optional caption), decline one, toggle live status.
  The passphrase check is intentionally simple (a shared secret in an env
  var) — fine for one admin running this by hand, not meant to scale beyond
  that without real auth.

## Design intent

Newsprint/zine, not app-chrome: cream paper background with grain, one ink
color plus a single red "stamp" accent, monospace for metadata for that
typewritten-label feel, serif for headlines. Each roll entry sits slightly
rotated, like it was actually pinned up crooked.
