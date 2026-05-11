export type FontKey =
  | "editorial-serif"
  | "modern-serif"
  | "clean-sans"
  | "geometric-sans"
  | "playful-grotesk"
  | "warm-humanist"
  | "tech-mono"
  | "bold-display";

export type PaletteKey =
  | "bone-ink"
  | "forest"
  | "terracotta"
  | "electric"
  | "arctic"
  | "bordeaux"
  | "sage"
  | "digital"
  | "sunset";

export type Brand = {
  name: string;
  tagline: string;
  font: FontKey;
  palette: PaletteKey;
  heroImage?: string;
  monogram?: string;
  /** Stored for debugging / regeneration. */
  heroPrompt?: string;
  generatedAt?: string;
};
