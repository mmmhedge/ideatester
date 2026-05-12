/**
 * Usage: npm run litepaper -- <slug>
 *
 * Generates a technical litepaper for a crypto idea. Output is Markdown,
 * rendered at /<slug>/litepaper with academic-style CSS. Print → Save as PDF
 * gives a clean PDF (no extra dependencies needed).
 */
import { writeFileSync } from "fs";
import { join } from "path";
import Anthropic from "@anthropic-ai/sdk";
import { getIdea } from "../ideas/index";
import { CRYPTO_STYLE_GUIDE } from "../lib/brand/crypto-style";

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npm run litepaper -- <slug>");
    process.exit(1);
  }
  const idea = getIdea(slug);
  if (!idea) {
    console.error(`No idea with slug "${slug}". Add it to ideas/index.ts.`);
    process.exit(1);
  }
  if (idea.kind !== "crypto" || !idea.crypto) {
    console.error(`Idea "${slug}" is not kind: "crypto". Litepaper generator only runs on crypto ideas.`);
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set in .env.local");
    process.exit(1);
  }

  const c = idea.crypto;
  const client = new Anthropic();

  console.log(`Drafting litepaper for "${slug}"... (~30-60s)`);
  const res = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 8192,
    system: [
      { type: "text", text: CRYPTO_STYLE_GUIDE, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      {
        role: "user",
        content: `Write a litepaper for the following crypto project. 7-9 pages worth (~2500-3500 words).

Project: ${idea.title}
${c.chain ? `Chain: ${c.chain}` : ""}
${c.category ? `Category: ${c.category}` : ""}
${c.status ? `Status: ${c.status}` : ""}

Problem: ${c.problem}

Solution: ${c.solution}

Key insight: ${c.keyInsight}

Architecture overview: ${c.architecture.overview}

Components:
${c.architecture.components.map((x) => `- ${x.name}: ${x.role}`).join("\n")}

${c.tokenomics ? `Tokenomics:
- Symbol: ${c.tokenomics.symbol}
- Total supply: ${c.tokenomics.totalSupply}
- Utility: ${c.tokenomics.utility}
- Allocations:
${c.tokenomics.allocations.map((a) => `  - ${a.name}: ${a.pct}%${a.vesting ? ` (${a.vesting})` : ""}`).join("\n")}
` : "No token."}

${idea.vibe ? `Tone steer: ${idea.vibe}` : ""}

REQUIREMENTS:
- Markdown format. Output ONLY the markdown, no preamble, no "Here's your litepaper:".
- Use H2 (##) for top-level sections. H3 (###) for sub-sections. No H1.
- Required sections, in order:
  ## Abstract
  ## Motivation
  ## Background
  ## Architecture
  ## Protocol / Mechanism
  ${c.tokenomics ? "## Tokenomics" : ""}
  ## Security Considerations
  ## Open Questions
  ## References
- The Abstract is 4-6 sentences. State the problem, the approach, the result.
- Background cites at least 2 real prior works/specs by name (papers, EIPs, RFCs that actually exist).
- Architecture explains the components in concrete detail. Name the data structures.
- Protocol section walks through one end-to-end flow with specifics.
- Security Considerations names at least 3 concrete threat models and how each is handled.
- Open Questions lists 3-5 things you genuinely don't know yet. This is the credibility section — if you can't list real open questions, your project is fake.
- References is a list of real things. No fabricated citations.

VOICE: technical, restrained, specific. Read the style guide in the system prompt. If a sentence could appear on a generic Web3 launchpad, rewrite it.`,
      },
    ],
  });

  const md = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  if (!md) {
    console.error("Empty response from Claude");
    process.exit(1);
  }

  const outPath = join(process.cwd(), "ideas", `${slug}.litepaper.md`);
  writeFileSync(outPath, md + "\n");
  console.log(`Wrote ${outPath}`);
  console.log(`Preview at: http://localhost:3000/${slug}/litepaper`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
