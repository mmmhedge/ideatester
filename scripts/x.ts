/**
 * Usage:
 *   npm run x -- drafts <slug>           # Generate post drafts with Claude
 *   npm run x -- auth                    # One-time OAuth setup (browser)
 *   npm run x -- send <slug> --thread    # Post the launch thread
 *   npm run x -- send <slug> --teaser N  # Post the Nth teaser (0-indexed)
 *   npm run x -- promote <slug>          # Print Promote inputs to paste
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import Anthropic from "@anthropic-ai/sdk";
import { getIdea } from "../ideas/index";
import { CRYPTO_STYLE_GUIDE } from "../lib/brand/crypto-style";
import { runAuthFlow } from "../lib/x/auth";
import { getClient, tokensExist } from "../lib/x/client";

type Post = { text: string; note?: string };

type XPlan = {
  launch_thread: Post[];
  teaser_posts: Post[];
  promote: {
    post: "launch_thread[0]" | string;
    goal: "website_clicks" | "engagements" | "followers";
    budget_usd: number;
    duration_days: number;
    audience: {
      interests: string[];
      locations: string[];
      languages: string[];
      keywords?: string[];
    };
    ad_copy: string;
    rationale: string;
  };
};

const PLAN_PATH = (slug: string) => join(process.cwd(), "ideas", `${slug}.x.json`);

async function generateDrafts(slug: string) {
  const idea = getIdea(slug);
  if (!idea) throw new Error(`No idea "${slug}"`);
  if (idea.kind !== "crypto") throw new Error("X drafts only for crypto ideas");
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not set");
  const c = idea.crypto!;

  const client = new Anthropic();
  console.log(`Drafting X posts for "${slug}"... (~20s)`);

  const res = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    system: [{ type: "text", text: CRYPTO_STYLE_GUIDE, cache_control: { type: "ephemeral" } }],
    tools: [
      {
        name: "x_plan",
        description: "Emit the full X plan: launch thread, teaser posts, and promote config.",
        input_schema: {
          type: "object",
          required: ["launch_thread", "teaser_posts", "promote"],
          properties: {
            launch_thread: {
              type: "array",
              minItems: 5,
              maxItems: 8,
              description: "Launch thread. First post hooks. Last post has the link (only ONE post in the thread should have a URL — the cheaper API tier).",
              items: {
                type: "object",
                required: ["text"],
                properties: {
                  text: { type: "string", description: "<=280 chars. No emojis unless meaningful (✓ for shipped). No banned words." },
                  note: { type: "string", description: "1-line internal note: why this post." },
                },
              },
            },
            teaser_posts: {
              type: "array",
              minItems: 4,
              maxItems: 8,
              description: "Standalone posts to drop over the launch week. No URLs (cheap API tier). Each makes ONE concrete technical claim.",
              items: {
                type: "object",
                required: ["text"],
                properties: {
                  text: { type: "string" },
                  note: { type: "string" },
                },
              },
            },
            promote: {
              type: "object",
              required: ["post", "goal", "budget_usd", "duration_days", "audience", "ad_copy", "rationale"],
              properties: {
                post: { type: "string", description: "Which post to promote, e.g. 'launch_thread[0]'." },
                goal: { type: "string", enum: ["website_clicks", "engagements", "followers"] },
                budget_usd: { type: "number" },
                duration_days: { type: "number" },
                audience: {
                  type: "object",
                  required: ["interests", "locations", "languages"],
                  properties: {
                    interests: { type: "array", items: { type: "string" }, description: "X-Ads interest taxonomy strings, e.g. 'Cryptocurrencies', 'Ethereum', 'Hardware engineering'." },
                    locations: { type: "array", items: { type: "string" }, description: "Country codes or names, e.g. 'United States', 'United Kingdom', 'Germany'." },
                    languages: { type: "array", items: { type: "string" }, description: "ISO codes, e.g. 'en'." },
                    keywords: { type: "array", items: { type: "string" }, description: "Optional keyword targeting." },
                  },
                },
                ad_copy: { type: "string", description: "Headline override for the promote modal." },
                rationale: { type: "string" },
              },
            },
          },
        },
      },
    ],
    tool_choice: { type: "tool", name: "x_plan" },
    messages: [
      {
        role: "user",
        content: `Generate the X launch plan for this crypto project.

Title: ${idea.title}
Headline: ${idea.hero.headline}
Sub: ${idea.hero.sub}

Problem: ${c.problem}
Solution: ${c.solution}
Key insight: ${c.keyInsight}

Architecture:
${c.architecture.overview}
${c.architecture.components.map((x) => `  - ${x.name}: ${x.role}`).join("\n")}

${c.status ? `Status: ${c.status}` : ""}
${idea.vibe ? `Tone: ${idea.vibe}` : ""}
${c.links?.x ? `Posting from: ${c.links.x}` : ""}

CRITICAL:
- API has a 13x price multiplier on posts with URLs. Put the landing-page link in ONLY ONE post of the launch thread (usually the last).
- No emojis except ✓ for shipped status.
- No banned phrases per the style guide.
- Each post stands alone — assume readers see one, not all.
- Specific technical claims with numbers > vague hype.
- Teaser posts: NO URLs at all. Make them quotable.`,
      },
    ],
  });

  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("No tool_use block in response");
  const plan = block.input as XPlan;

  writeFileSync(PLAN_PATH(slug), JSON.stringify(plan, null, 2) + "\n");
  console.log(`Wrote ${PLAN_PATH(slug)}\n`);
  console.log("Launch thread:");
  plan.launch_thread.forEach((p, i) => {
    console.log(`  [${i}] ${p.text}`);
    if (p.note) console.log(`      → ${p.note}`);
  });
  console.log("\nTeasers:");
  plan.teaser_posts.forEach((p, i) => {
    console.log(`  [${i}] ${p.text}`);
  });
  console.log(`\nReview ideas/${slug}.x.json, then: npm run x -- send ${slug} --thread`);
}

function loadPlan(slug: string): XPlan {
  const p = PLAN_PATH(slug);
  if (!existsSync(p)) throw new Error(`No plan at ${p}. Run: npm run x -- drafts ${slug}`);
  return JSON.parse(readFileSync(p, "utf8"));
}

async function sendThread(slug: string) {
  if (!tokensExist()) throw new Error("Not authorized. Run: npm run x -- auth");
  const plan = loadPlan(slug);
  const x = await getClient();

  console.log(`Posting ${plan.launch_thread.length}-tweet thread...`);
  let lastId: string | undefined;
  const urls: string[] = [];
  let me: { username?: string } = {};
  try {
    const meRes = await x.v2.me();
    me = meRes.data;
  } catch {}

  for (let i = 0; i < plan.launch_thread.length; i++) {
    const post = plan.launch_thread[i];
    const tweet = await x.v2.tweet({
      text: post.text,
      ...(lastId ? { reply: { in_reply_to_tweet_id: lastId } } : {}),
    });
    lastId = tweet.data.id;
    const url = `https://x.com/${me.username ?? "i"}/status/${tweet.data.id}`;
    urls.push(url);
    console.log(`  [${i}] ✓ ${url}`);
    // Light pacing so X doesn't shadow-rate.
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log("\nThread posted. Save the first URL — that's the one to Promote.");
  console.log(`First tweet: ${urls[0]}`);
}

async function sendTeaser(slug: string, index: number) {
  if (!tokensExist()) throw new Error("Not authorized. Run: npm run x -- auth");
  const plan = loadPlan(slug);
  const post = plan.teaser_posts[index];
  if (!post) throw new Error(`No teaser at index ${index}. Have ${plan.teaser_posts.length}.`);
  const x = await getClient();
  const tweet = await x.v2.tweet({ text: post.text });
  let username = "i";
  try { username = (await x.v2.me()).data.username ?? "i"; } catch {}
  console.log(`✓ https://x.com/${username}/status/${tweet.data.id}`);
}

function printPromote(slug: string) {
  const plan = loadPlan(slug);
  const idea = getIdea(slug);
  if (!idea) throw new Error(`No idea "${slug}"`);
  const p = plan.promote;

  console.log(`\n=== X Promote: ${idea.title} ===\n`);
  console.log("→ Open the post you want to promote in the X web app (the one from `send --thread`).");
  console.log("→ Click the three-dot menu on the post → 'Promote post'.");
  console.log("→ Or go directly to: https://ads.x.com/\n");
  console.log("Paste these values into the Promote modal:\n");
  console.log(`  Which post:       ${p.post}`);
  console.log(`  Goal:             ${p.goal.replace("_", " ")}`);
  console.log(`  Budget:           $${p.budget_usd} total`);
  console.log(`  Duration:         ${p.duration_days} days`);
  console.log(`  Languages:        ${p.audience.languages.join(", ")}`);
  console.log(`  Locations:        ${p.audience.locations.join(", ")}`);
  console.log(`  Interests:        ${p.audience.interests.join(", ")}`);
  if (p.audience.keywords?.length) console.log(`  Keywords:         ${p.audience.keywords.join(", ")}`);
  console.log(`\n  Headline copy:    ${p.ad_copy}`);
  console.log(`\n  Why: ${p.rationale}\n`);
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (!cmd) {
    console.error("Usage: npm run x -- <drafts|auth|send|promote> [args]");
    process.exit(1);
  }

  if (cmd === "auth") {
    await runAuthFlow();
    return;
  }

  if (cmd === "drafts") {
    const slug = rest[0];
    if (!slug) throw new Error("Usage: npm run x -- drafts <slug>");
    await generateDrafts(slug);
    return;
  }

  if (cmd === "send") {
    const slug = rest[0];
    if (!slug) throw new Error("Usage: npm run x -- send <slug> --thread | --teaser N");
    if (rest.includes("--thread")) {
      await sendThread(slug);
      return;
    }
    const teaserIdx = rest.indexOf("--teaser");
    if (teaserIdx !== -1) {
      const n = parseInt(rest[teaserIdx + 1] ?? "", 10);
      if (Number.isNaN(n)) throw new Error("Usage: --teaser <index>");
      await sendTeaser(slug, n);
      return;
    }
    throw new Error("Specify --thread or --teaser N");
  }

  if (cmd === "promote") {
    const slug = rest[0];
    if (!slug) throw new Error("Usage: npm run x -- promote <slug>");
    printPromote(slug);
    return;
  }

  throw new Error(`Unknown command: ${cmd}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
