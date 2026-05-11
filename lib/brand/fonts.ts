import type { FontKey } from "./types";

export const FONTS: Record<FontKey, { google: string; family: string; vibe: string; weightForWordmark: number }> = {
  "editorial-serif": {
    google: "Instrument+Serif:ital@0;1",
    family: "Instrument Serif",
    vibe: "editorial, magazine, contemplative — for ideas about craft, lifestyle, content",
    weightForWordmark: 400,
  },
  "modern-serif": {
    google: "Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700",
    family: "Fraunces",
    vibe: "warm, premium serif — for food, wellness, hospitality, high-trust",
    weightForWordmark: 700,
  },
  "clean-sans": {
    google: "Inter:wght@400;500;600;700",
    family: "Inter",
    vibe: "neutral software default — for B2B SaaS, productivity, fintech",
    weightForWordmark: 700,
  },
  "geometric-sans": {
    google: "DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700",
    family: "DM Sans",
    vibe: "geometric, friendly startup — for consumer apps, social, marketplaces",
    weightForWordmark: 700,
  },
  "playful-grotesk": {
    google: "Space+Grotesk:wght@400;500;700",
    family: "Space Grotesk",
    vibe: "playful, slightly technical — for creator tools, dev tools, indie",
    weightForWordmark: 700,
  },
  "warm-humanist": {
    google: "Work+Sans:wght@400;500;700",
    family: "Work Sans",
    vibe: "humanist, warm — for care, education, family, services",
    weightForWordmark: 600,
  },
  "tech-mono": {
    google: "JetBrains+Mono:wght@400;500;700",
    family: "JetBrains Mono",
    vibe: "technical, developer-precise — for dev tools, infra, AI/ML aimed at engineers",
    weightForWordmark: 700,
  },
  "bold-display": {
    google: "Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800",
    family: "Bricolage Grotesque",
    vibe: "bold, confident display — for fitness, finance, ambitious consumer brands",
    weightForWordmark: 800,
  },
};

export function googleFontUrl(key: FontKey) {
  return `https://fonts.googleapis.com/css2?family=${FONTS[key].google}&display=swap`;
}
