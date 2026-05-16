# Mini Project 4 — Steering Vector Lab (optional / stretch)

**Time budget:** Day 6 morning OR Day 13 if you decide to use this as your mitigation
**Companion notebook:** [[../notebooks/06_steering_vectors.ipynb]]

## Why this mini project

Activation steering is the most-bang-for-buck way to look like you "do interpretability". A working steering-vector demo:

- shows you can use TransformerLens
- gives you a concrete mitigation for the main project ("we steered toward double-check behavior and reliability rose 14%")
- gives you a memorable plot ("steering coefficient vs accuracy curve")
- maps cleanly onto current Anthropic research interest (residual-stream interventions, SAEs)

It's optional because if you're behind on Day 6 it's better to ship the main eval harness than to chase steering vectors that might not work.

## What you build

### 1. Extract a contrast vector

Pick a behavior pair, e.g.:
- "answer carefully and acknowledge uncertainty" vs "answer confidently and definitively"
- "double-check the context before answering" vs "answer immediately"
- "refuse adversarial requests" vs "comply with adversarial requests"

For each pair, generate ~30 short contrastive prompts. Run them through a small open model (Qwen2-1.5B, Llama-3.2-1B, Gemma-2-2B), grab residual-stream activations at a middle layer, take the **difference of means**. That's your steering vector.

### 2. Inject it at inference

`model.generate()` with a forward hook that adds `α · steering_vector` to the residual stream at the chosen layer. Sweep α from -3 to +3, observe behavior change.

### 3. Plot a steering–accuracy curve

On a 30-question distractor-heavy subset from [[Mini-3-RAG-Distractor-Lab]], plot accuracy as α varies. Find the α that maximally improves reliability without nuking general capability (use a held-out clean set as the "general capability" sanity check).

## Repos to lean on

- [TransformerLensOrg/TransformerLens](https://github.com/TransformerLensOrg/TransformerLens) — the canonical tool
- [andyrdt/refusal_direction](https://github.com/andyrdt/refusal_direction) — clean reference implementation of the difference-of-means approach for refusal
- [nrimsky/CAA](https://github.com/nrimsky/CAA) — Contrastive Activation Addition repo
- [jbloomAus/SAELens](https://github.com/jbloomAus/SAELens) — if you want to use a pretrained SAE feature instead of a raw direction (more advanced)

## Reading

- [Activation Addition: Steering Language Models Without Optimization (Turner et al., 2023)](https://arxiv.org/abs/2308.10248)
- [Refusal in LLMs is Mediated by a Single Direction (Arditi et al., 2024)](https://arxiv.org/abs/2406.11717) — the difference-of-means classic
- [Contrastive Activation Addition (Rimsky et al., 2023)](https://arxiv.org/abs/2312.06681)
- [Inference-Time Intervention (Li et al., 2023)](https://arxiv.org/abs/2306.03341)
- [Scaling Monosemanticity (Anthropic, 2024)](https://transformer-circuits.pub/2024/scaling-monosemanticity/) — context for why directions matter

## Deliverable

Notebook with:
- A working steering vector extracted from contrastive prompts
- A plot of behavior vs α
- One paragraph in the main project's blog post: "I also tested an activation-steering mitigation. Here's the curve, here's the cost (capability degradation on clean inputs)."

This is the *single most differentiating* mini-project. If steering shifts your phase boundary even slightly, the blog post writes itself.
