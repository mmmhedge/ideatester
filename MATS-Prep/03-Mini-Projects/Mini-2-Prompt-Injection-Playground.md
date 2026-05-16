# Mini Project 2 — Prompt Injection Playground

**Time budget:** Day 3 evening + Day 4 (~6–8 hours)
**Companion notebook:** none — this lives mostly in your eval harness

## Why this mini project

Half of "agent reliability" research is just *understanding how prompts can be made to break models*. You need to internalize the attack surface before you can map it. By end of this you should have a small curated dataset of attack patterns with reproducible examples — useful immediately as a fixture in the main project.

## What you build

### 1. Attack taxonomy (a markdown table + small JSON dataset)

Categories to cover, with 2–5 examples each:
- **Direct override** — "ignore previous instructions, instead..."
- **Indirect injection** — payload hidden in a retrieved document or tool output
- **Roleplay jailbreak** — DAN, grandma, fictional-scenario
- **Encoding tricks** — base64, leetspeak, low-resource language, ASCII art
- **Many-shot jailbreak** — long context with many fake examples (Anthropic 2024 attack)
- **Suffix-optimization** (GCG) — adversarial token suffixes; you don't need to optimize, just include a few known suffixes from the literature
- **Context-window flooding** — push system prompt out of effective attention range
- **Tool-output poisoning** — a "weather API" returns a paragraph that tries to override the agent

### 2. Defense filters (3 stacked layers)

- **Static regex / heuristic** — strip known patterns, flag suspicious tokens
- **LLM-as-judge** — second model classifies "is this output trying to bypass instructions?"
- **Output policy check** — match completion against system-prompt-derived rules

Compare attack success rate against (a) no defense, (b) each layer alone, (c) all three stacked.

### 3. A small leaderboard

CSV / markdown table: rows = attacks, columns = models, cells = success rate over N trials. Even a 6×4 grid is enough to talk about.

## Repos to lean on

- [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) — testing harness
- [openai/evals](https://github.com/openai/evals) — eval format conventions
- [llm-attacks/llm-attacks](https://github.com/llm-attacks/llm-attacks) — GCG implementation; you don't need to run it but read the README
- [protectai/llm-guard](https://github.com/protectai/llm-guard) — production-grade defenses; raid for ideas

## Datasets to reuse

- [AdvBench](https://github.com/llm-attacks/llm-attacks/tree/main/data/advbench) (Zou et al.)
- [HarmBench](https://github.com/centerforaisafety/HarmBench)
- [JailbreakBench](https://github.com/JailbreakBench/jailbreakbench)

**Ethics note**: keep the dataset focused on *categorical demonstrations*, not stockpiling working attacks against current models. Don't publish anything that's a live attack on a current production system. When in doubt, redact the payload and keep the structure.

## Reading

- [Universal and Transferable Adversarial Attacks on Aligned Language Models (Zou et al., 2023)](https://arxiv.org/abs/2307.15043) — the GCG paper
- [Many-shot jailbreaking (Anthropic, 2024)](https://www.anthropic.com/research/many-shot-jailbreaking)
- [Prompt Injection attacks against GPT-3 (Simon Willison, 2022)](https://simonwillison.net/2022/Sep/12/prompt-injection/) — short and excellent
- [Best-of-N Jailbreaking (Hughes et al., 2024)](https://arxiv.org/abs/2412.03556)

## Deliverable

- `mini-2-injection/` folder in the main repo with:
  - `taxonomy.md` (the table)
  - `attacks.json` (the dataset)
  - `defenses.py` (the three filters)
  - `leaderboard.md` (the results table)
  - `README.md` with 200-word explanation

This whole mini-project becomes **fixture material** for the main project's adversarial-context axis.
