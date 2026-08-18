import type { Idea } from "./types";

export const secondunit: Idea = {
  slug: "secondunit",
  title: "A second location, priced off your real numbers — Cairn",
  metaDescription:
    "Send a year of POS and bank data from your first franchise unit. Get a straight readiness score and real financing options for unit two — before you talk to a broker.",
  hero: {
    eyebrow: "For existing single-unit franchise owners",
    headline: "A second location, priced off your first.",
    sub: "Send us a year of POS and bank data from unit one. We tell you what unit two actually costs, what a lender will say, and whether you're ready — before you talk to a broker.",
    primaryCta: "Get my readiness score",
  },
  features: [
    { title: "Underwritten from your real numbers", body: "Not a projection. Your actual P&L, labor cost, and comp sales feed the model." },
    { title: "A straight readiness score", body: "Ready, not yet, or here's what's missing — with the reasons shown, not a black box." },
    { title: "Financing laid out side by side", body: "Term loan, revenue-based financing, franchisor co-invest, or debt against unit one. Cost and collateral compared plainly." },
  ],
  faq: [
    { q: "Is this free money for a second location?", a: "No. Every option — a loan, a royalty override, franchisor capital — is real financing with a real cost. We show the cost next to each option, not just the pitch." },
    { q: "What do you need from me?", a: "About a year of POS and bank statements from your current unit, plus your franchise agreement. Nothing else to start." },
    { q: "Does this work for any brand?", a: "We're starting with a small group of service-based franchises in one metro while we build out the model. Tell us your brand and we'll let you know." },
    { q: "Do you sell my data or push me toward one lender?", a: "No brand or lender pays us more to be ranked higher. If your numbers don't support a second unit yet, we'll tell you that too." },
    { q: "Are you a lender?", a: "No. We're not a lender and we don't decide who gets approved. We hand your information to matched lenders for a flat fee and step back — rate and term talks happen directly with them, not through us." },
    { q: "Does the franchisor's disclosure document still apply here?", a: "Yes. Nothing here replaces your FDD. By law you get it at least 14 days before signing anything or paying anything — we work around that window, not around the law." },
  ],
  form: {
    fields: [
      { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      { name: "brand", label: "Which franchise brand do you operate?", type: "text", required: true, placeholder: "e.g. brand name" },
      { name: "context", label: "What's making you consider a second location?", type: "textarea", placeholder: "A sentence or two is plenty." },
    ],
    submitLabel: "Get my readiness score",
    successHeadline: "You're on the list.",
    successBody: "We'll reach out to collect a year of POS/bank data and walk you through your readiness score.",
    conversionEvent: "Lead",
    conversionValue: 25,
  },
  theme: { accent: "teal" },
  vibe: "reads like an underwriter wrote it, not a growth marketer. Confident, specific, no hype about 'free' expansion capital.",
};
