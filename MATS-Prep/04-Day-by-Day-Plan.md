# 04 — Day by Day Plan (21 days)

Each day has: **morning block (2–3h)** + **afternoon block (2–3h)** + **evening reading (45–60 min)**. Adjust to your chronotype but keep total ≈ 5–7h. Sustainable beats heroic — you cannot recover a lost Day 16.

Mark progress in [[dashboard.html]] (open in browser, ticks persist locally).

---

## Week 1 — ML + Infra Fluency (Days 1–7)

Goal: by Day 7 you can spin up models from three providers, inspect their internals, run them inside an agent loop, and score outputs. **Push the repo public at end of Day 7.**

### Day 1 — Environment & First Inference
- **Morning**: Set up a fresh `uv` or `conda` env. Install: `torch`, `transformers`, `accelerate`, `sentence-transformers`, `openai`, `anthropic`, `vllm` (skip on Mac), `jupyter`, `matplotlib`, `plotly`, `streamlit`, `python-dotenv`, `pytest`. Verify CUDA / MPS works.
- **Afternoon**: Run [[../notebooks/01_first_inference.ipynb]] — load a tiny HF model (Qwen2-0.5B or TinyLlama-1.1B), do 5 generations, inspect token IDs and probabilities. Push initial commit to GitHub.
- **Evening reading**: [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) (30 min) + the abstract of every paper in [[05-Reading-List#Must Read]].
- **Deliverable**: First inference notebook committed. `requirements.txt` works on a fresh clone.

### Day 2 — Transformer Internals
- **Morning**: Read [Karpathy nanoGPT](https://github.com/karpathy/nanoGPT) `model.py` end-to-end (~250 lines). Annotate it with your own comments and commit.
- **Afternoon**: Build [[03-Mini-Projects/Mini-1-Transformer-Internals]]. Token inspector + attention heatmaps for GPT-2 small.
- **Evening reading**: §1–3 of [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html).
- **Deliverable**: `02_attention_visualizer.ipynb` with 6 attention heatmaps + 1 markdown observation.

### Day 3 — Agent Loops & ReAct
- **Morning**: Read [ReAct paper](https://arxiv.org/abs/2210.03629), §1–4 carefully. Sketch the loop on paper.
- **Afternoon**: Build [[../notebooks/03_react_agent.ipynb]] — minimal ReAct agent with two mock tools (a calculator and a fake-Wikipedia function). 100 lines, no frameworks.
- **Evening reading**: [Reflexion paper](https://arxiv.org/abs/2303.11366), [Toolformer](https://arxiv.org/abs/2302.04761).
- **Deliverable**: Working ReAct loop that solves 5/5 toy multi-hop questions you write yourself.

### Day 4 — Consistency & SelfCheckGPT
- **Morning**: Read [SelfCheckGPT](https://arxiv.org/abs/2303.08896), end-to-end (it's short).
- **Afternoon**: Build a consistency checker — sample N=5 completions per question, score consistency via (a) exact-match on extracted answer, (b) NLI agreement, (c) embedding cosine. Save scores per question.
- **Decide today**: which of [[03-Mini-Projects/Mini-2-Prompt-Injection-Playground]] vs [[03-Mini-Projects/Mini-4-Steering-Vector-Lab]] excites you more. You'll do the second one on Day 6 only if time permits.
- **Evening reading**: [TruthfulQA](https://arxiv.org/abs/2109.07958).
- **Deliverable**: Hallucination/consistency scorer that runs on 20 questions in <2 min.

### Day 5 — RAG Distractor Lab (Mini Project 3)
- **Morning**: Build the minimal RAG pipeline from [[03-Mini-Projects/Mini-3-RAG-Distractor-Lab]]. ~150 lines.
- **Afternoon**: Implement the three corruption modes. Run a 100-question subset, save raw outputs as JSON.
- **Evening reading**: [Lost in the Middle](https://arxiv.org/abs/2307.03172) + [The Power of Noise](https://arxiv.org/abs/2401.14887).
- **Deliverable**: First baseline heatmap (accuracy vs gold position × distractor count) for one model. This goes into the main project unchanged.

### Day 6 — Multi-Provider Eval Runner
- **Morning**: Flesh out [[../src/reliability_maps/providers.py]] and [[../src/reliability_maps/runners.py]] — async, with disk caching (use `diskcache` or a simple JSON cache). Same prompt should hit OpenAI, Anthropic, and a local model with one call.
- **Afternoon**: Run the Day 5 distractor sweep across all three providers. Save unified JSON of results.
- **Optional stretch**: spin up [[03-Mini-Projects/Mini-4-Steering-Vector-Lab]] if you finish early.
- **Evening reading**: skim [HELM](https://arxiv.org/abs/2211.09110) intro + the "design choices" section.
- **Deliverable**: Multi-model results JSON + a 3-line overlay plot.

### Day 7 — Clean, Document, Push Public
- **Morning**: Restructure repo: clear `src/`, `notebooks/`, `data/`, `results/`, `figures/`. Write the README — what, why, how to run, what's coming. Add a `LOG.md` with daily progress entries.
- **Afternoon**: Make 3 figures from Week 1 work that you'd be proud to show a mentor. Add them to the README.
- **Push the repo public.** Tweet / post-on-LessWrong-or-not is optional, but the repo being public is non-negotiable.
- **Evening reading**: Skim [HELM] further if you didn't yesterday, and read [BIG-bench](https://arxiv.org/abs/2206.04615) intro.
- **Deliverable**: Public GitHub repo with working code, 3 figures, clean README. **This is your first MATS-portfolio artifact.**

---

## Week 2 — Research System (Days 8–14)

Goal: by Day 14 you have *real experimental results* — at least one phase-diagram-shaped finding across at least two models, plus one mitigation A/B.

### Day 8 — Distractor Generator (depth)
- Generalize Day 5's distractor injection into [[../src/reliability_maps/distractors.py]] with the 6 control axes from [[02-Main-Project#Architecture (4 components)]].
- Unit tests (use `pytest`). Yes, tests. Mentors notice when applicants have them.
- **Deliverable**: distractor generator with ≥5 axes, parameterizable, with tests.

### Day 9 — Adversarial Suite
- Pull in the dataset from [[03-Mini-Projects/Mini-2-Prompt-Injection-Playground]] (build it today if you skipped it). Wire it into the distractor generator as the "adversarial intent" axis.
- **Deliverable**: a single `generate_perturbation_set(question, axes)` function that produces all variants of a question.

### Day 10 — Scoring Metrics
- Flesh out [[../src/reliability_maps/metrics.py]] — accuracy, consistency, hallucination, reasoning-collapse rate, tool-misuse rate (agent setting), cost/latency. Each metric returns a struct with confidence intervals (bootstrap).
- **Deliverable**: every result has CIs. Plots will look much more credible.

### Day 11 — Large-Scale Run
- Run the full sweep: ~3 models × ~200 questions × ~5 perturbation settings = ~3000 calls. Budget ~$30–80 in API spend. Cache aggressively.
- **Trap to avoid**: don't run this *while* iterating on code. Freeze the runner first, then sweep.
- **Deliverable**: a single results JSON / parquet file with ≥10,000 rows of (model, question, perturbation_params, raw_output, score).

### Day 12 — Dashboards
- Build [[../notebooks/05_distractor_phase_diagram.ipynb]] as the analysis notebook. Streamlit/Dash app optional — a clean notebook is enough for v1.
- Aim for 3 figures: (a) one 2D heatmap with a clear phase boundary in one model, (b) one cross-model overlay, (c) one mitigation A/B teaser.
- **Deliverable**: 3 publication-quality figures (PDF + PNG export).

### Day 13 — Mitigations
- Implement the 4 interventions in [[../src/reliability_maps/mitigations.py]]. Re-run the experimental loop with each mitigation enabled. Compare to baseline.
- If [[03-Mini-Projects/Mini-4-Steering-Vector-Lab]] worked on Day 6, include steering as a 5th mitigation here.
- **Deliverable**: mitigation comparison table.

### Day 14 — Failure Analysis
- Pick 5 representative failed trajectories. For each, write a 100-word case study: input, what the model did, where it went off, what the contaminating context was.
- These case studies are the most-cited part of your eventual blog post. Mentors read case studies more carefully than aggregate plots.
- **Deliverable**: 5 case studies in markdown.

---

## Week 3 — Finalization (Days 15–21)

Goal: by Day 21 you have submitted MATS with a polished portfolio.

### Day 15 — Polish Architecture
- Repo cleanup. Anything not used → delete. Anything used → has a docstring. `make repro` should produce headline figures from scratch.
- **Deliverable**: a fresh clone + 30-min run reproduces a headline figure.

### Day 16 — Visualizations
- Re-style every plot for clarity: consistent fonts, legends, captions. Use a coherent palette. Export at 300 DPI.
- One **hero figure** that summarizes the whole project. This is your Twitter / LinkedIn artifact.
- **Deliverable**: 6–10 publication-quality figures.

### Day 17 — Writeup: Methodology, Findings, Limitations
- Draft three sections (~600 words each) of the blog post. Be honest about limitations — claim less, demonstrate more. Mentors mark hard for overclaiming.
- **Deliverable**: ~1800 words of draft.

### Day 18 — Diagrams & Tables
- Draw the system-architecture diagram (Excalidraw / draw.io). Build the headline benchmark table.
- **Deliverable**: 1 architecture diagram + 2 tables, embedded in the draft.

### Day 19 — Blog Post Final Draft
- Tighten to ~2000 words. Trim ruthlessly. Add a strong intro and a stronger conclusion. **Title test**: read it to a friend, do they want to read on?
- Suggested working title: *"What breaks modern LLM agents? Phase diagrams of context-induced failure."*
- Publish on your own site or LessWrong / EAF / Substack. Cross-link from the repo README.
- **Deliverable**: a published blog post URL.

### Day 20 — Portfolio Polish
- Update GitHub repo header: project tagline, hero figure, blog post link.
- Take 3–5 screenshots of dashboards / plots for the MATS application portfolio section.
- Update your personal site / LinkedIn with the project link.
- **Deliverable**: portfolio assets ready to paste into MATS application.

### Day 21 — Submit MATS
- Pick 3 mentors using [[07-MATS-Application-Strategy]].
- Write the application essays (allow ≥4 hours; don't rush this).
- Submit. Then close the laptop. You did it.

---

## What to do if you fall behind

The schedule has slack baked in. If you're 1 day behind: skip the optional mini-project (Steering, Day 6 stretch). If you're 2 days behind: drop the cross-model dimension and run on 2 models instead of 3. If you're 3+ days behind: drop the mitigations and ship the eval + finding alone — a clean eval with one solid finding is still a strong artifact. The order to cut from is:

1. Steering mini-project (Mini-4)
2. 3rd model in cross-model comparison
3. Mitigations beyond the first one
4. Streamlit dashboard (notebook plots are enough)

The order **NOT** to cut from is: the blog post, the public repo, and at least one non-trivial empirical finding.
