import { spawn } from "child_process";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import ffmpegPath from "ffmpeg-static";
import type { PromoAspect, PromoOverlay, PromoPreset } from "./types";

const FONT_DIR = join(process.cwd(), "data", "promo-fonts");

const FONT_URLS: Record<string, string> = {
  "JetBrains Mono":
    "https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@v2.304/fonts/ttf/JetBrainsMono-Bold.ttf",
  Inter: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf",
};

export async function ensureFont(family: string): Promise<string> {
  mkdirSync(FONT_DIR, { recursive: true });
  const safe = family.replace(/\s+/g, "-");
  const out = join(FONT_DIR, `${safe}.ttf`);
  if (existsSync(out)) return out;
  const url = FONT_URLS[family];
  if (!url) throw new Error(`No font URL for "${family}". Add to FONT_URLS.`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font download failed (${res.status}): ${url}`);
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  return out;
}

const ASPECT_DIMS: Record<PromoAspect, { w: number; h: number }> = {
  "9:16": { w: 1080, h: 1920 },
  "1:1": { w: 1080, h: 1080 },
  "16:9": { w: 1920, h: 1080 },
};

/**
 * Crop/letterbox the source video to the target aspect and compose text
 * overlays + optional music track. Output is web-optimized H.264 mp4.
 */
export async function renderPromo(opts: {
  sourceVideo: string;
  outputPath: string;
  aspect: PromoAspect;
  overlays: PromoOverlay[];
  preset: PromoPreset;
  musicPath?: string;
}): Promise<void> {
  if (!ffmpegPath) throw new Error("ffmpeg-static did not provide a binary path.");
  const fontPath = await ensureFont(opts.preset.font.family);
  const { w, h } = ASPECT_DIMS[opts.aspect];

  // Build filter chain: scale + crop to target, optional tint, then drawtext per overlay.
  const fontescape = fontPath.replace(/\\/g, "\\\\").replace(/:/g, "\\:");
  const drawTexts = opts.overlays.map((o) => buildDrawText(o, fontescape, opts.preset, w, h));

  const videoFilter = [
    `scale=${w}:${h}:force_original_aspect_ratio=increase`,
    `crop=${w}:${h}`,
    ...(opts.preset.bgTint
      ? [`drawbox=x=0:y=0:w=${w}:h=${h}:color=${opts.preset.bgTint.replace("#", "0x")}:t=fill`]
      : []),
    ...drawTexts,
  ].join(",");

  const args = [
    "-y",
    "-i", opts.sourceVideo,
    ...(opts.musicPath ? ["-stream_loop", "-1", "-i", opts.musicPath] : []),
    "-vf", videoFilter,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "medium",
    "-crf", "20",
    "-movflags", "+faststart",
    ...(opts.musicPath
      ? [
          "-filter_complex",
          "[0:a:0]aresample=44100,volume=1.0[a0];[1:a:0]aresample=44100,volume=0.5[a1];[a0][a1]amix=inputs=2:duration=first[aout]",
          "-map", "0:v:0",
          "-map", "[aout]",
        ]
      : ["-c:a", "aac", "-b:a", "128k"]),
    "-shortest",
    opts.outputPath,
  ];

  await runFfmpeg(args);
}

function buildDrawText(o: PromoOverlay, fontPath: string, preset: PromoPreset, w: number, h: number): string {
  const text = o.text.replace(/'/g, "’").replace(/:/g, "\\:");
  const fontsize = Math.round(w * 0.055);
  const pos = o.position ?? "center";
  const xy =
    pos === "center" ? "x=(w-text_w)/2:y=(h-text_h)/2"
    : pos === "bottom" ? `x=(w-text_w)/2:y=h-${Math.round(h * 0.18)}`
    : `x=${Math.round(w * 0.06)}:y=${Math.round(h * 0.06)}`;
  const color = preset.accent.replace("#", "0x");
  return [
    `drawtext=fontfile='${fontPath}'`,
    `text='${text}'`,
    `fontsize=${fontsize}`,
    `fontcolor=${color}`,
    `shadowcolor=0x000000aa:shadowx=2:shadowy=2`,
    `enable='between(t,${o.start},${o.start + o.duration})'`,
    xy,
  ].join(":");
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath as string, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });
    proc.on("close", (code: number | null) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}\n${stderr.slice(-2000)}`));
    });
  });
}
