# 02 — Main Project

> **Headline framing**: *Phase Diagrams of Agent Failure — mapping reliability collapse in LLM agents under controlled context perturbations.*

This keeps every component of the original PDF's main project (dataset generator, multi-model runner, dashboards, mitigations) but reframes the analysis through a **physics lens** that you, specifically, are credible to use. Two alternative framings are at the bottom in case this one stops exciting you by Day 3.

---

## The story you want to tell

Modern LLM agents work well on clean inputs and fail mysteriously when context gets messy. The community has a vague intuition that "more distractor context → worse performance" but mostly reports it as bar charts of accuracy vs context length.

You go further: you treat reliability as an **order parameter** in a system whose **control parameters** are properties of the context (distractor density, semantic similarity of distractors to the question, position, token length, tool-noise level). You sweep the control parameters and look for:

- **Smooth degradation** (boring) — most prior work shows this
- **Phase transitions** — sharp drops at critical thresholds, suggestive of a qualitative change in agent behavior
- **Hysteresis** — does the agent recover when you remove the distractor mid-trajectory, or does the chain stay poisoned?
- **Universality** — do different model families collapse at the same control-parameter values when normalized?

If you find even one clean phase-transition-shaped curve across two models, that's a publishable empirical finding and a great blog post.

---

## Why this beats the generic version

The generic "I built a context-stress eval" project has been done. The phase-diagram framing:

1. Plays to your physics edge no one else can credibly use.
2. Suggests specific analysis tools (critical exponents, finite-size scaling, universality classes) most ML people don't reach for.
3. Yields a single memorable artifact — *a heatmap with a phase boundary* — that travels well on Twitter and in mentor conversations.
4. Connects to live research threads at Anthropic and elsewhere on emergent behavior and scaling.

---

## Architecture (4 components)

### 1. Distractor / context-perturbation generator

Takes a base benchmark question (HotpotQA, GPQA, MMLU, or a custom multi-hop set) and produces variants along controlled axes:

- **Density** — number of distractor passages inserted
- **Semantic distance** — distractors vary from topically related to wildly unrelated (use sentence-embedding similarity to control)
- **Position** — beginning, middle, end (Lost-in-the-Middle territory)
- **Token length** — pad context length while holding other variables fixed
- **Adversarial intent** — passive distractors vs prompt-injection-style distractors that actively suggest wrong answers
- **Tool-output noise** — for the agent setting: corrupt tool returns with controlled noise

→ Skeleton in [[../src/reliability_maps/distractors.py]]

### 2. Evaluation runner (multi-provider)

Async runner that hits OpenAI, Anthropic, and a local Hugging Face / vLLM model with the same prompts. Caches everything to disk. Computes:

- **Accuracy** vs ground truth
- **Consistency** across temperature samples (SelfCheckGPT-style)
- **Reasoning collapse rate** — fraction of trajectories that end with a clearly wrong-but-confident answer
- **Tool misuse** rate (agent setting) — calls wrong tool, passes wrong arg, ignores tool output
- **Hallucination score** — entity-level fact check on free-form answers
- **Cost / latency** per call (you are the only candidate who'll bother to plot this — leverage your infra edge)

→ Skeleton in [[../src/reliability_maps/runners.py]] and [[../src/reliability_maps/providers.py]]

### 3. Phase-diagram dashboard

Streamlit or Plotly Dash app. Three primary views:

- **2D heatmaps**: accuracy as function of two control parameters (e.g. distractor count × position). Show the phase boundary as a contour.
- **Failure trajectory inspector**: pick a failed run, see the full reasoning chain, the contaminating context, and the point where the agent's logits committed to the wrong answer.
- **Cross-model overlays**: same control-parameter sweep, three models overlaid. Look for universality.

### 4. Mitigation layer (4 interventions, A/B'd against baseline)

- **Self-checking** — append "verify your answer against the context" turn
- **Dual-pass reasoning** — answer twice with different framings, only commit if agree
- **Retrieval filtering** — relevance-score-then-filter contexts before answering
- **Confidence-gated abstention** — refuse to answer if logit margin / consistency is below threshold

→ Skeleton in [[../src/reliability_maps/mitigations.py]]

Goal: show that one or more mitigations **shifts the phase boundary** rather than just lifting baseline accuracy.

---

## Concrete success criteria (for Day 21)

You ship if you have:

- ✅ A public GitHub repo, clean README, reproducible install
- ✅ At least **one 2D heatmap** showing a non-trivial phase boundary in a single model
- ✅ At least **one cross-model comparison** plot (3 models, same axes)
- ✅ At least **one mitigation A/B** showing a measurable shift
- ✅ A ~2000-word blog post: *"What breaks modern LLM agents? Phase diagrams of context-induced failure."*
- ✅ Failure-trajectory case studies (3 commented examples in the writeup)

You don't need novel mitigations or SOTA results. You need a clean, defensible experimental loop and a non-obvious empirical claim.

---

## Datasets to start from (don't build from scratch)

- **HotpotQA** — multi-hop QA, easy to inject distractors at the passage level
- **GPQA** — graduate-level science multiple-choice (your physics background = you can sanity-check it)
- **NaturalQuestions** — long context, real-world distractor candidates
- **NeedleInAHaystack** — for raw long-context retrieval baseline
- **AgentBench / SWE-bench-lite** — if you want a real agent setting (harder, do this in Week 2 only)
- **Custom 200-question multi-hop set** you write — small but lets you control everything

Start with **HotpotQA + GPQA**. Add others only if time permits.

---

## What "evidence of a phase transition" actually means

Be honest with yourself. You are looking for empirical patterns. You are NOT proving these are real phase transitions in any rigorous statistical-mechanics sense. The blog post should explicitly say:

> *"I borrow phase-transition language because the curves look like order parameters, and the framing suggests useful analyses (critical exponents, scaling collapse). I make no claim that LLM behavior actually instantiates a thermodynamic system."*

This calibrated framing is itself signal — it shows you can use a powerful metaphor without overclaiming. Mentors love that.

---

## Creative Angles (backup framings)

If the phase-diagram angle stops feeling alive by Day 3, pivot to one of these. **Do not switch after Day 5.**

### Angle B — Agent Failure Forensics

A diagnostic tool that takes a failed agent trajectory and produces a *causal autopsy*: which token / context chunk / tool return is responsible for the failure? Builds on activation patching ideas from mech interp. Single deliverable: an autopsy report generator that ingests a trajectory and outputs a Sentry-style root-cause writeup. Very tool-shaped and very portable.

### Angle C — The Reward Hack Bestiary

Curate, taxonomize, and reproduce reward-hacking examples across modern code/agent benchmarks. Build a small website cataloguing them with reproducible scripts. The artifact is *the canonical reference*, not a paper. High shareability, low novelty bar.

### Angle D — Steering Vector Lab (mech-interp-flavored)

Extract activation steering vectors that change agent behavior on the reliability axis (e.g. "more cautious", "double-check before answering"). Demonstrate behavioral control as a mitigation. Stronger ML chops required; do this only if the mini-project on steering vectors ([[03-Mini-Projects/Mini-4-Steering-Vector-Lab]]) goes smoothly.

---

## Files in this project

- [[../src/reliability_maps/providers.py]] — multi-provider LLM client wrapper
- [[../src/reliability_maps/runners.py]] — async evaluation runner with caching
- [[../src/reliability_maps/distractors.py]] — context perturbation generators
- [[../src/reliability_maps/metrics.py]] — scoring functions
- [[../src/reliability_maps/mitigations.py]] — intervention strategies
- [[../notebooks/05_distractor_phase_diagram.ipynb]] — the headline experiment notebook

→ Next: [[03-Mini-Projects]] or jump to [[04-Day-by-Day-Plan]]
