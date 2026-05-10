import type { Idea } from "./types";

export const aicoach: Idea = {
  slug: "aicoach",
  title: "Your pocket running coach — Stride",
  metaDescription: "An AI coach that adapts your training plan every day based on how you actually feel.",
  hero: {
    eyebrow: "Beta — 200 spots",
    headline: "A running coach that actually listens.",
    sub: "Stride adapts your plan every morning based on sleep, soreness, and yesterday's run. No more rigid PDFs.",
    primaryCta: "Join the beta",
  },
  features: [
    { title: "Daily-adapting plans", body: "Tomorrow's workout updates after today's run." },
    { title: "Voice check-ins", body: "30 seconds of voice → adjusted volume and intensity." },
    { title: "Race-ready", body: "Plans for 5K to marathon, with taper and peak weeks." },
  ],
  faq: [
    { q: "Cost?", a: "$9/mo after beta. First 200 testers get 6 months free." },
    { q: "Watch support?", a: "Garmin and Apple Watch on day one. Strava sync included." },
  ],
  form: {
    fields: [
      { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      { name: "goal", label: "What are you training for?", type: "text", placeholder: "Marathon, 5K, just fitness…" },
    ],
    submitLabel: "Reserve a beta spot",
    successHeadline: "You're in the queue.",
    successBody: "Beta invites roll out weekly. Watch your inbox.",
    conversionEvent: "Lead",
    conversionValue: 10,
  },
  theme: { accent: "indigo" },
};
