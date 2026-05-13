export type PromoPresetKey = "crypto" | "consumer";

export type PromoAspect = "9:16" | "1:1" | "16:9";

export type PromoOverlay = {
  /** Body text — keep short, fits in one line at large size. */
  text: string;
  /** Seconds from start. */
  start: number;
  /** Duration in seconds. */
  duration: number;
  /** Position. Default: center. */
  position?: "center" | "bottom" | "top-left";
};

export type PromoPreset = {
  key: PromoPresetKey;
  /** Locked suffix appended to every AI video prompt. Controls look. */
  visualSuffix: string;
  /** AI-prompt instructions for what the scene should be. */
  promptGuidance: string;
  /** Default video model on Replicate. */
  defaultModel: string;
  /** Use the brand hero image as a starting frame if available. */
  useImagePrime: boolean;
  /** Font for overlay text. Loaded from Google Fonts on first run. */
  font: { family: string; weight: number };
  /** Accent color for overlay text (hex). */
  accent: string;
  /** Background tint applied as a subtle filter (hex with alpha) — optional. */
  bgTint?: string;
  /** Default duration of generated clip in seconds. */
  duration: number;
  /** Whether the model produces audio (Veo 3 yes, Luma no). */
  modelHasAudio: boolean;
};

export type PromoPlan = {
  visualPrompt: string;
  overlays: PromoOverlay[];
};
