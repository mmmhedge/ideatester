import type { PaletteKey } from "./types";

/**
 * Curated palettes. All light-mode (bg light, fg dark) for consistent
 * component rendering. Accent is a Tailwind color name so existing
 * components keep working with bg-${accent}-600 etc.
 */
export const PALETTES: Record<
  PaletteKey,
  { bg: string; fg: string; muted: string; accent: string; vibe: string }
> = {
  "bone-ink":   { bg: "#faf7f2", fg: "#0f0f0f", muted: "#6b6b6b", accent: "neutral",  vibe: "editorial, restrained, premium — luxury or content-led" },
  "forest":     { bg: "#f5f3eb", fg: "#1a2e1a", muted: "#5a6a5a", accent: "emerald",  vibe: "outdoor, natural, calm — pets, gardening, sustainability" },
  "terracotta": { bg: "#faf4ec", fg: "#2a1810", muted: "#6a4a3a", accent: "orange",   vibe: "warm, crafted, hand-made — food, home, ceramics, artisan" },
  "electric":   { bg: "#ffffff", fg: "#0a0a0a", muted: "#525252", accent: "sky",      vibe: "crisp, tech, alert — productivity, B2B, dashboards" },
  "arctic":     { bg: "#f4f7fa", fg: "#0f1a2a", muted: "#4a5a6a", accent: "sky",      vibe: "clean, clinical, trustworthy — health, fintech, insurance" },
  "bordeaux":   { bg: "#faf6f0", fg: "#1a0a0a", muted: "#6a3a3a", accent: "rose",     vibe: "rich, indulgent, elevated — beauty, hospitality, wine" },
  "sage":       { bg: "#f5f3ea", fg: "#1f2a1a", muted: "#5a6a4a", accent: "teal",     vibe: "wellness, balanced, grounded — fitness, mental health, mindful" },
  "digital":    { bg: "#fafafa", fg: "#18181b", muted: "#52525b", accent: "violet",   vibe: "software, modern, focused — AI tools, creator apps" },
  "sunset":     { bg: "#fdf9f3", fg: "#1a1010", muted: "#6a4a4a", accent: "rose",     vibe: "warm, optimistic, social — community, dating, events" },
};
