# Mini Project 3 — RAG Distractor Lab

**Time budget:** Day 5 (~6 hours)
**Companion notebook:** [[../notebooks/05_distractor_phase_diagram.ipynb]] (this mini-project bleeds directly into the main project)

## Why this mini project

You need a working RAG pipeline so you can systematically corrupt it. This mini-project is the *direct foundation* of the main-project's distractor sweep — by the end you'll have a corpus, a retriever, a baseline accuracy, and the ability to perturb the retriever output along controlled axes.

## What you build

### 1. Minimal RAG pipeline (~150 lines)

- Corpus: HotpotQA passages, or Wikipedia subset, or a custom 1000-doc set
- Embedder: `bge-small-en-v1.5` (CPU-friendly) or `text-embedding-3-small` (API)
- Index: FAISS or chromadb (both ~10 lines to set up)
- Retriever: top-k cosine similarity
- Reader: a chat model with retrieved-passages-as-context

### 2. Three corruption modes

For each query:
- **Lost-in-the-middle** — re-order top-k so gold passage is at varying positions (top, middle, bottom)
- **Distractor injection** — add K passages from off-topic queries
- **Adversarial injection** — add a passage that mentions the question entities but states the wrong answer ("Paris is the capital of Germany. ...")

### 3. Measurement

Run a 100-question subset through every (model × position × distractor-count) combination. Plot:
- Accuracy vs distractor count, faceted by position
- Accuracy vs gold-passage position, faceted by distractor count

This is your *first phase diagram*. Even if it's only 10×10 cells per model, it's a real artifact and you can talk about it intelligently.

## Repos to lean on

- [run-llama/llama_index](https://github.com/run-llama/llama_index) — fastest path to a working RAG
- [chroma-core/chroma](https://github.com/chroma-core/chroma) — local vector DB
- [facebookresearch/faiss](https://github.com/facebookresearch/faiss) — if you want a closer-to-metal index
- [stanford-futuredata/ColBERT](https://github.com/stanford-futuredata/ColBERT) — better retriever if you want one (skip for v1)
- [explodinggradients/ragas](https://github.com/explodinggradients/ragas) — RAG eval metrics; grab a few definitions

## Datasets

- [HotpotQA](https://hotpotqa.github.io/) — multi-hop QA, ideal for distractor injection
- [NaturalQuestions](https://ai.google.com/research/NaturalQuestions/)
- [NeedleInAHaystack](https://github.com/gkamradt/LLMTest_NeedleInAHaystack) — extreme long-context retrieval; useful baseline
- [LongBench](https://github.com/THUDM/LongBench) — full long-context eval suite, possibly overkill for v1

## Reading (papers that this builds on directly)

- [Lost in the Middle (Liu et al., 2023)](https://arxiv.org/abs/2307.03172)
- [Retrieval-Augmented Generation (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401) — the original RAG paper
- [The Power of Noise: Redefining Retrieval for RAG Systems (Cuconasu et al., 2024)](https://arxiv.org/abs/2401.14887) — directly relevant
- [Long Context Can Be Misleading (RULER, 2024)](https://arxiv.org/abs/2404.06654)

## Deliverable

A notebook with:
- A working 1000-doc RAG pipeline
- One heatmap: accuracy by (gold position × distractor count) for one model
- 3-sentence interpretation of what you see

This heatmap is the **first piece of the main-project dashboard** — don't redo it later, reuse it.
