# 08 — Reference Material

Curated links. Each entry is here because it pays off in <30 min of reading.

## Courses & walkthroughs

- [Hugging Face LLM Course](https://huggingface.co/learn/llm-course) — chapters 1, 5, 7 are highest value
- [Karpathy "Let's build GPT" (YT)](https://www.youtube.com/watch?v=kCc8FmEb1nY) — 2hr, watch at 1.5×
- [Karpathy "Let's reproduce GPT-2 (124M)"](https://www.youtube.com/watch?v=l8pRSuU81PU) — 4hr, more advanced
- [ARENA curriculum](https://www.arena.education/) — open-source MATS-adjacent curriculum; their "Transformer from Scratch" and "Mechanistic Interpretability" sections are gold
- [PyTorch 60-minute Blitz](https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html) — only if you're rusty
- [Anthropic's "Building effective agents"](https://www.anthropic.com/research/building-effective-agents) — read once before Day 3

## Blogs and writeups to keep open in tabs

- [Anthropic Engineering](https://www.anthropic.com/engineering)
- [Transformer Circuits Thread](https://transformer-circuits.pub/)
- [Lil'Log (Lilian Weng)](https://lilianweng.github.io/) — deeply researched survey-style posts
- [Simon Willison's blog](https://simonwillison.net/) — practical LLM engineering
- [Eleuther blog](https://blog.eleuther.ai/)
- [METR blog](https://metr.org/blog/) — eval research done right
- [Apollo Research blog](https://www.apolloresearch.ai/blog) — agent safety / evals
- [Far AI blog](https://far.ai/blog/)

## Communities

- [LessWrong](https://www.lesswrong.com/) — search "evals", "agent failure", "interpretability"
- [Alignment Forum](https://www.alignmentforum.org/) — higher-signal subset of LessWrong
- [EleutherAI Discord](https://discord.gg/zBGx3azzUn) — `#interpretability-general`, `#research`
- [Hugging Face Discord](https://discord.com/invite/hugging-face-879548962464493619)
- [r/MachineLearning](https://www.reddit.com/r/MachineLearning/) — useful for new-paper signal
- [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/) — practical, fast-moving
- [Mech Interp Slack](https://join.slack.com/t/mech-interp/shared_invite/zt-2egyc81qq-LpEt1xioz~mxa~9wK6gxLg) — small but active

## Community trends to look for (Reddit-ish signal)

When you check /r/MachineLearning, /r/LocalLLaMA, LessWrong, and X over the next 21 days, look for and bookmark anything in these themes — they all overlap with your project:

- **Test-time compute scaling** — does more inference compute help reliability? does the gain depend on context complexity?
- **Speculative decoding observability** — when speculation diverges, *why*?
- **Best-of-N reliability gains** — sampling-based mitigations and their cost
- **Context rot** — long-context reliability degradation as a function of conversation length
- **Agent-as-judge** — using LLMs to grade other LLMs; the failure modes thereof
- **Reward-hacking detection** — Anthropic recently published on this; threads will keep coming
- **SAE-based steering** — using sparse-autoencoder features for behavior control
- **Sandbagging detection** — distinguishing "model can't" from "model won't"
- **Constitutional drift** — long-conversation degradation of safety guardrails
- **Tool-use brittleness** — failure modes specific to tool-using agents
- **Multi-step trajectory evals** — METR-style long-task evals

Any of these is a plausible "next research question" you can mention in your MATS application essay.

## "Open source projects you could contribute to" (low-effort, high-signal)

A merged PR or a useful issue on one of these is a credibility boost. Aim for small, scoped fixes — a typo, a docs improvement, a test, a metric implementation.

- [openai/evals](https://github.com/openai/evals) — add an eval (lowest barrier; their template is clear)
- [EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) — add a task
- [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) — they accept docs and examples readily
- [TransformerLensOrg/TransformerLens](https://github.com/TransformerLensOrg/TransformerLens) — add a model or fix a tokenizer edge case
- [explodinggradients/ragas](https://github.com/explodinggradients/ragas) — implement a metric variant

Do this only if you have spare bandwidth after Day 14 — *don't* sacrifice your own project's polish for an external PR.

## Cost / API budget guidance

Rough budget for 21 days, assuming you run sweeps on Day 11 + smaller sweeps elsewhere:

| Provider | Likely spend | Notes |
|---|---|---|
| OpenAI (GPT-4o-mini for sweeps, GPT-4o for judge) | $30–80 | Apply for [Researcher Access Program](https://openai.com/form/researcher-access-program/) — free credits if accepted |
| Anthropic (Claude Sonnet for sweeps + Haiku for cheap baselines) | $30–80 | Apply for [Anthropic Builder/Research credits](https://www.anthropic.com/) on the API console |
| Local (Modal / RunPod / Lambda) | $0–30 | Only if you do steering vectors on a 7B+ model |
| **Total** | **$60–190** | Plan for $150 and you'll be fine |

Tag every call with a project name in the API console; you'll want the cost-attribution later for the blog post's appendix.

## Templates

- **Paper notes template**: see `papers-notes-template.md` (one-page-per-paper structure)
- **Daily log template**: see your repo's `LOG.md` — 5 lines per day: what shipped, what's blocked, what's next, hours spent, papers read
- **Blog post outline**: see [[02-Main-Project#The story you want to tell]]
