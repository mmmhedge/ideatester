/**
 * Usage:
 *   npm run promo -- <slug>                       # both aspects, default preset
 *   npm run promo -- <slug> --preset consumer
 *   npm run promo -- <slug> --aspect 9:16         # one aspect only
 *   npm run promo -- <slug> --model google/veo-3  # override model (premium w/ audio)
 *   npm run promo -- <slug> --dry-run             # print plan, skip gen
 *
 * Auto-picks preset from idea kind: crypto idea -> crypto preset, else consumer.
 *
 * Music: optional. Drop an mp3 at public/promo/music/<preset>.mp3 (or set
 * MUSIC env var) and it gets mixed in. Without a file, video plays whatever
 * audio the model produced (silence for Luma; ambient for Veo 3).
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import Anthropic from "@anthropic-ai/sdk";
import { getIdea } from "../ideas/index";
import { getBrand } from "../lib/brand/load";
import { PRESETS } from "../lib/promo/presets";
import { renderPromo } from "../lib/promo/render";
import type { PromoAspect, PromoPlan, PromoPresetKey } from "../lib/promo/types";

const ASPECTS: PromoAspect[] = ["9:16", "1:1"];

function parseArgs() {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--"));
  const pick = (name: string) => {
    const i = args.indexOf(`--${name}`);
    return i === -1 ? undefined : args[i + 1];
  };
  return {
    slug,
    preset: pick("preset") as PromoPresetKey | undefined,
    aspect: pick("aspect") as PromoAspect | undefined,
    model: pick("model"),
    dryRun: args.includes("--dry-run"),
  };
}

async function generatePlan(slug: string, presetKey: PromoPresetKey): Promise<PromoPlan> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not set");
  const idea = getIdea(slug);
  if (!idea) throw new Error(`No idea "${slug}"`);
  const preset = PRESETS[presetKey];
  const client = new Anthropic();

  const isCrypto = idea.kind === "crypto" && idea.crypto;
  const summary = isCrypto
    ? `Project: ${idea.title}
Problem: ${idea.crypto!.problem}
Solution: ${idea.crypto!.solution}
Key insight: ${idea.crypto!.keyInsight}`
    : `Idea: ${idea.title}
Headline: ${idea.hero.headline}
Sub: ${idea.hero.sub}`;

  const res = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: `You design 6-8 second promo videos. Two rules:
1. The AI video model fails at: legible text, logos, accurate products, faces, hands holding specific objects, multiple cuts. So your visual prompt describes ONE coherent shot of ONE thing, no text on screen, no people facing camera. Concrete physical scene, not concept art.
2. Text overlays are added by ffmpeg afterward (legible, on-brand). Pick 1-3 short overlays max. Each <=5 words. Specific, not generic.

Style guidance for this preset:
${preset.promptGuidance}

Locked visual look (always appended): ${preset.visualSuffix}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [
      {
        name: "promo_plan",
        description: "Emit the promo plan.",
        input_schema: {
          type: "object",
          required: ["visualPrompt", "overlays"],
          properties: {
            visualPrompt: {
              type: "string",
              description: "Single coherent shot. 15-30 words. No text/logos/people-facing-camera.",
            },
            overlays: {
              type: "array",
              minItems: 1,
              maxItems: 3,
              items: {
                type: "object",
                required: ["text", "start", "duration"],
                properties: {
                  text: { type: "string", description: "<=5 words. Specific. No banned hype phrases." },
                  start: { type: "number", description: "Seconds from start (0 to clip duration - 1)." },
                  duration: { type: "number", description: "Seconds to display." },
                  position: { type: "string", enum: ["center", "bottom", "top-left"] },
                },
              },
            },
          },
        },
      },
    ],
    tool_choice: { type: "tool", name: "promo_plan" },
    messages: [{ role: "user", content: `${summary}\n\nDesign the promo plan.` }],
  });

  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("No tool_use block in response");
  const plan = block.input as PromoPlan;
  plan.visualPrompt = `${plan.visualPrompt}. ${preset.visualSuffix}`;
  return plan;
}

async function generateVideo(model: string, prompt: string, duration: number, aspect: PromoAspect, imagePrime?: string): Promise<Buffer> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN not set. Get one at https://replicate.com/account/api-tokens");
  }
  const input: Record<string, unknown> = {
    prompt,
    aspect_ratio: aspect,
    duration,
  };
  if (imagePrime) input.start_image_url = imagePrime;

  const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      prefer: "wait=120",
    },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { output?: string | string[]; status: string; error?: string; urls?: { get?: string } };
  let url: string | undefined = Array.isArray(data.output) ? data.output[0] : data.output;

  // Some models need polling even with prefer:wait.
  if (!url && data.urls?.get) {
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      const poll = await fetch(data.urls.get, {
        headers: { authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
      });
      const j = (await poll.json()) as typeof data;
      if (j.status === "succeeded") {
        url = Array.isArray(j.output) ? j.output[0] : j.output;
        break;
      }
      if (j.status === "failed" || j.status === "canceled") {
        throw new Error(`Replicate ${j.status}: ${j.error}`);
      }
    }
  }
  if (!url) throw new Error(`Replicate produced no output. Status: ${data.status} ${data.error || ""}`);

  const dl = await fetch(url);
  if (!dl.ok) throw new Error(`Video download failed: ${dl.status}`);
  return Buffer.from(await dl.arrayBuffer());
}

async function main() {
  const { slug, preset: presetArg, aspect, model, dryRun } = parseArgs();
  if (!slug) {
    console.error("Usage: npm run promo -- <slug> [--preset crypto|consumer] [--aspect 9:16|1:1] [--model name] [--dry-run]");
    process.exit(1);
  }
  const idea = getIdea(slug);
  if (!idea) {
    console.error(`No idea "${slug}". Register it in ideas/index.ts.`);
    process.exit(1);
  }
  const presetKey: PromoPresetKey = presetArg ?? (idea.kind === "crypto" ? "crypto" : "consumer");
  const preset = PRESETS[presetKey];
  const aspects = aspect ? [aspect] : ASPECTS;
  const chosenModel = model ?? preset.defaultModel;

  console.log(`Drafting promo plan for "${slug}" (${presetKey} preset)...`);
  const plan = await generatePlan(slug, presetKey);
  console.log(`\nVisual prompt:\n  ${plan.visualPrompt}\n`);
  console.log("Overlays:");
  plan.overlays.forEach((o, i) => console.log(`  [${i}] @${o.start}s for ${o.duration}s: "${o.text}"`));

  if (dryRun) {
    console.log("\n--dry-run: exiting before video gen.");
    return;
  }

  const brand = getBrand(slug);
  const imagePrime =
    preset.useImagePrime && brand?.heroImage && process.env.PUBLIC_BASE_URL
      ? `${process.env.PUBLIC_BASE_URL.replace(/\/$/, "")}${brand.heroImage}`
      : undefined;
  if (preset.useImagePrime && !imagePrime) {
    console.log("(no PUBLIC_BASE_URL set; running text-to-video instead of image-prime)");
  }

  const outDir = join(process.cwd(), "public", slug);
  mkdirSync(outDir, { recursive: true });

  // Generate ONE base clip, render to each requested aspect.
  console.log(`\nGenerating clip via ${chosenModel} (~30-90s)...`);
  const sourcePath = join(outDir, "promo-source.mp4");
  const buf = await generateVideo(chosenModel, plan.visualPrompt, preset.duration, aspects[0], imagePrime);
  writeFileSync(sourcePath, buf);
  console.log(`  saved: public/${slug}/promo-source.mp4`);

  const musicEnv = process.env.PROMO_MUSIC;
  const musicDefault = join(process.cwd(), "public", "promo", "music", `${presetKey}.mp3`);
  const musicPath = musicEnv && existsSync(musicEnv)
    ? musicEnv
    : existsSync(musicDefault) ? musicDefault : undefined;
  if (musicPath) console.log(`  music: ${musicPath}`);

  for (const a of aspects) {
    const outPath = join(outDir, `promo-${a.replace(":", "x")}.mp4`);
    console.log(`Rendering ${a} -> public/${slug}/promo-${a.replace(":", "x")}.mp4`);
    await renderPromo({
      sourceVideo: sourcePath,
      outputPath: outPath,
      aspect: a,
      overlays: plan.overlays,
      preset,
      musicPath,
    });
  }

  console.log("\n✓ Done.");
  console.log("Upload to Instagram Reels / X video / wherever you launch.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
