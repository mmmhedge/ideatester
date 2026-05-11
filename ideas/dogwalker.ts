import type { Idea } from "./types";

export const dogwalker: Idea = {
  slug: "dogwalker",
  title: "On-demand dog walks in 15 min — Pawly",
  metaDescription: "Tap a button, get a vetted walker at your door in 15 minutes. Join the early access list.",
  hero: {
    eyebrow: "Early access",
    headline: "A vetted dog walker at your door in 15 minutes.",
    sub: "Tap once. We dispatch the closest insured walker. GPS-tracked, photo updates, no subscriptions.",
    primaryCta: "Get early access",
  },
  features: [
    { title: "15-min dispatch", body: "Average pickup time in pilot zip codes." },
    { title: "Background-checked", body: "Every walker verified, insured, and rated." },
    { title: "Live GPS + photos", body: "Watch the walk in real time. Get photos at drop-off." },
  ],
  socialProof: [
    { quote: "Saved my back-to-back-meetings days. Buster gets walked, I keep working.", name: "Anna K.", role: "Beta user, Brooklyn" },
  ],
  faq: [
    { q: "What cities are live?", a: "Pilot in NYC. Joining the list locks in launch pricing in your area." },
    { q: "How much will it cost?", a: "Targeting $18 for a 30-min walk. Early access list gets 50% off the first month." },
  ],
  form: {
    fields: [
      { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
      { name: "zip", label: "ZIP code", type: "text", required: true, placeholder: "10001" },
    ],
    submitLabel: "Reserve my spot",
    successHeadline: "You're on the list.",
    successBody: "We'll email you the moment Pawly opens in your ZIP.",
    conversionEvent: "Lead",
    conversionValue: 5,
  },
  theme: { accent: "emerald" },
  vibe: "feels like a neighborhood service run by people who own dogs, not a tech startup",
};
