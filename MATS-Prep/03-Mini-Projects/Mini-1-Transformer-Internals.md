# Mini Project 1 — Transformer Internals Explorer

**Time budget:** Day 2 (~6 hours)
**Companion notebook:** [[../notebooks/02_attention_visualizer.ipynb]]

## Why this mini project

You need to **feel** transformer internals in your fingers, not just read about them, before you can credibly talk about agent failure modes. By the end of today you should be able to answer "why did the model say X at position Y?" by pointing at attention patterns and logit distributions, not by waving your hands.

## What you build (3 small tools)

### 1. Token inspector
Given a prompt + completion, print a table of:
- token id, token string, top-5 logits + probabilities at each position, entropy of the distribution

This is how you build intuition for *where the model is confident vs guessing*.

### 2. Attention pattern viewer
Pick a small model (GPT-2 small or Pythia-160M — they fit on CPU). For a given prompt:
- Extract attention weights per layer × head
- Plot as heatmaps (matplotlib) — input tokens on both axes
- Identify 2–3 heads that have visually distinct patterns (induction-head-like, BOS-attending, syntax-following)

### 3. Hidden state comparison
Same prompt, two different models (or same model, two phrasings). Cosine similarity of final-layer hidden states per position. Look for places they diverge.

## Repos to lean on

- [karpathy/minGPT](https://github.com/karpathy/minGPT) — read `model.py` end-to-end, ~300 lines
- [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) — successor, slightly more production-shaped
- [TransformerLensOrg/TransformerLens](https://github.com/TransformerLensOrg/TransformerLens) — the actual tool you'll use; `model.run_with_cache(prompt)` returns every activation
- [huggingface/transformers](https://github.com/huggingface/transformers) — for tokenizers and easy model loading
- [BertViz](https://github.com/jessevig/bertviz) — drop-in attention visualizer if you don't want to roll your own

## Stretch (only if you finish early)

- Pick an "induction head" candidate and verify with the standard induction-head pattern (`ABCAB → C`)
- Run the same prompt through Pythia-160M, 410M, 1.4B — does the head pattern stabilize with scale?

## Deliverable

A notebook (`02_attention_visualizer.ipynb`) with:
- Token inspector output for one prompt
- 6 attention heatmaps (2 layers × 3 heads)
- One short markdown cell summarizing what you noticed (this becomes blog material later)

## Reading to do alongside

- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — 30 min
- [Karpathy's Let's build GPT video](https://www.youtube.com/watch?v=kCc8FmEb1nY) — 2 hr, watch at 1.5× while coding
- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) — skim §1–3, you'll come back to it
