/**
 * Usage:
 *   npm run brand -- <slug>
 *   npm run brand -- <slug> --no-image   # text only, skip image gen
 *
 * Reads ideas/<slug>.ts, asks Claude for name/tagline/font/palette/image-prompt
 * under the anti-cringe style guide, then renders a hero image via OpenAI
 * gpt-image-1 or Replicate Flux (whichever API key is set).
 *
 * Writes:
 *   ideas/<slug>.brand.json
 *   public/<slug>/hero.jpg
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import Anthropic from "@anthropic-ai/sdk";
import { getIdea } from "../ideas/index";
import { FONTS } from "../lib/brand/fonts";
import { PALETTES } from "../lib/brand/palettes";
import { STYLE_GUIDE } from "../lib/brand/style";
import type { Brand, FontKey, PaletteKey } from "../lib/brand/types";

type BrandSpec = {
  name: string;
  tagline: string;
  font: FontKey;
  palette: PaletteKey;
  monogram: string;
  heroPrompt: string;
};

const FONT_KEYS = Object.keys(FONTS) as FontKey[];
const PALETTE_KEYS = Object.keys(PALETTES) as PaletteKey[];

async function generateSpec(idea: ReturnType<typeof getIdea>): Promise<BrandSpec> {
  if (!idea) throw new Error("missing idea");
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not set in .env.local");
  }

  const client = new Anthropic();
  const fontMenu = FONT_KEYS.map((k) => `  - ${k}: ${FONTS[k].vibe}`).join("\n");
  const paletteMenu = PALETTE_KEYS.map((k) => `  - ${k}: ${PALETTES[k].vibe}`).join("\n");

  const userPrompt = `Generate brand assets for this idea:

Slug:           ${idea.slug}
Current title:  ${idea.title}
Headline:       ${idea.hero.headline}
Sub:            ${idea.hero.sub}
${idea.vibe ? `Vibe note:      ${idea.vibe}\n` : ""}
Pick ONE font from this menu (key only):
${fontMenu}

Pick ONE palette from this menu (key only):
${paletteMenu}

Return JSON via the brand tool. Be specific. Refuse anything generic.`;

  const res = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: STYLE_GUIDE,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [
      {
        name: "brand",
        description: "Emit a brand spec.",
        input_schema: {
          type: "object",
          required: ["name", "tagline", "font", "palette", "monogram", "heroPrompt"],
          properties: {
            name: { type: "string", description: "Brand name. 1-2 syllables. No banned suffixes." },
            tagline: { type: "string", description: "4-8 words. Outcome, concrete noun." },
            font: { type: "string", enum: FONT_KEYS },
            palette: { type: "string", enum: PALETTE_KEYS },
            monogram: { type: "string", description: "One letter for wordmark fallback. Usually first letter of name." },
            heroPrompt: {
              type: "string",
              description: "6-15 words. Specific scene. Editorial-photo style. No people facing camera, no text/logos.",
            },
          },
        },
      },
    ],
    tool_choice: { type: "tool", name: "brand" },
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("No tool_use block in response");
  return block.input as BrandSpec;
}

async function generateHeroImage(slug: string, spec: BrandSpec): Promise<string | undefined> {
  const palette = PALETTES[spec.palette];
  const fullPrompt = [
    spec.heroPrompt,
    "editorial photography, 35mm film aesthetic, natural daylight, shallow depth of field",
    `palette mood: ${palette.vibe}`,
    "no text, no logos, no watermarks, no faces directly at camera",
  ].join(". ");

  const outDir = join(process.cwd(), "public", slug);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "hero.jpg");

  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: fullPrompt,
        size: "1024x1024",
        n: 1,
      }),
    });
    if (!res.ok) {
      console.error("[gpt-image-1]", res.status, await res.text());
      return undefined;
    }
    const data = (await res.json()) as { data: { b64_json?: string; url?: string }[] };
    const first = data.data[0];
    if (first.b64_json) {
      writeFileSync(outPath, Buffer.from(first.b64_json, "base64"));
    } else if (first.url) {
      const img = await fetch(first.url);
      writeFileSync(outPath, Buffer.from(await img.arrayBuffer()));
    }
    return `/${slug}/hero.jpg`;
  }

  if (process.env.REPLICATE_API_TOKEN) {
    // Flux 1.1 Pro via Replicate. Synchronous endpoint, returns when ready.
    const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        prefer: "wait",
      },
      body: JSON.stringify({
        input: { prompt: fullPrompt, aspect_ratio: "1:1", output_format: "jpg", output_quality: 90 },
      }),
    });
    if (!res.ok) {
      console.error("[replicate flux]", res.status, await res.text());
      return undefined;
    }
    const data = (await res.json()) as { output?: string; status: string; error?: string };
    if (!data.output) {
      console.error("[replicate flux] no output:", data.status, data.error);
      return undefined;
    }
    const img = await fetch(data.output);
    writeFileSync(outPath, Buffer.from(await img.arrayBuffer()));
    return `/${slug}/hero.jpg`;
  }

  console.warn("No image API key set (OPENAI_API_KEY or REPLICATE_API_TOKEN). Skipping hero image.");
  return undefined;
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args.find((a) => !a.startsWith("--"));
  const skipImage = args.includes("--no-image");
  if (!slug) {
    console.error("Usage: npm run brand -- <slug> [--no-image]");
    process.exit(1);
  }
  const idea = getIdea(slug);
  if (!idea) {
    console.error(`No idea registered with slug "${slug}". Add it to ideas/index.ts first.`);
    process.exit(1);
  }

  console.log(`Generating brand for "${slug}"...`);
  const spec = await generateSpec(idea);
  console.log(`  name:    ${spec.name}`);
  console.log(`  tagline: ${spec.tagline}`);
  console.log(`  font:    ${spec.font}`);
  console.log(`  palette: ${spec.palette}`);
  console.log(`  hero:    ${spec.heroPrompt}`);

  let heroImage: string | undefined;
  if (!skipImage) {
    console.log("Generating hero image (this takes ~15-30s)...");
    heroImage = await generateHeroImage(slug, spec);
    if (heroImage) console.log(`  saved:  public${heroImage}`);
  }

  const brand: Brand = {
    ...spec,
    heroImage,
    generatedAt: new Date().toISOString(),
  };
  const outPath = join(process.cwd(), "ideas", `${slug}.brand.json`);
  writeFileSync(outPath, JSON.stringify(brand, null, 2) + "\n");
  console.log(`\nWrote ${outPath}`);
  console.log(`View locally: http://localhost:3000/${slug}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
