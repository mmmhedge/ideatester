import type { PromoPreset, PromoPresetKey } from "./types";

export const PRESETS: Record<PromoPresetKey, PromoPreset> = {
  crypto: {
    key: "crypto",
    visualSuffix:
      "cinematic, dark monochrome, single emerald-green accent, slow steady camera move, shallow depth of field, 35mm anamorphic, ambient mood, no people, no faces, no text on screen, no logos, no UI mockups, no watermarks",
    promptGuidance:
      "Abstract technical visuals: macro shots of circuit boards, embedded hardware, terminal/code reflected in glass, ambient server-room lighting, sync-committee-style data viz. Concrete physical scene, not concept art.",
    defaultModel: "luma/ray-flash-2-540p",
    useImagePrime: false,
    font: { family: "JetBrains Mono", weight: 600 },
    accent: "#4ade80",
    bgTint: "#0a0a0a40",
    duration: 8,
    modelHasAudio: false,
  },
  consumer: {
    key: "consumer",
    visualSuffix:
      "editorial photography style, natural daylight, 35mm film aesthetic, shallow depth of field, warm tones, single subject in frame, no text on screen, no logos, no watermarks, no faces directly at camera",
    promptGuidance:
      "A specific real-world moment from the idea's world. Object or hands, not concept. Suggests outcome not mechanism.",
    defaultModel: "luma/ray-flash-2-540p",
    useImagePrime: true,
    font: { family: "Inter", weight: 700 },
    accent: "#ffffff",
    duration: 6,
    modelHasAudio: false,
  },
};
