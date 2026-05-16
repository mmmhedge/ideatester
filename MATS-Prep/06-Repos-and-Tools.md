# 06 — Repos and Tools

A short list of repos that are *actually useful* for the 21 days, sorted by when you'll touch them.

## Week 1 — fluency

| Repo | What for | Time to skim |
|---|---|---|
| [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) | Read `model.py`. The cleanest transformer impl. | 1 hr |
| [karpathy/minGPT](https://github.com/karpathy/minGPT) | Same but older / pedagogical | 1 hr |
| [huggingface/transformers](https://github.com/huggingface/transformers) | Daily driver | ongoing |
| [TransformerLensOrg/TransformerLens](https://github.com/TransformerLensOrg/TransformerLens) | `run_with_cache` is the killer feature | 30 min |
| [jessevig/bertviz](https://github.com/jessevig/bertviz) | Quick attention visualizations | 15 min |

## Week 1 — RAG + agent infra

| Repo | What for |
|---|---|
| [run-llama/llama_index](https://github.com/run-llama/llama_index) | Fastest path to a working RAG |
| [chroma-core/chroma](https://github.com/chroma-core/chroma) | Local vector DB |
| [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | If you want an agent framework. Optional. |
| [microsoft/autogen](https://github.com/microsoft/autogen) | Multi-agent — read for ideas, don't depend on it |
| [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) | Same |

## Week 2 — evals

| Repo | What for |
|---|---|
| [openai/evals](https://github.com/openai/evals) | The conventions you should follow |
| [EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) | The actual standard for academic eval; great structure to copy |
| [confident-ai/deepeval](https://github.com/confident-ai/deepeval) | Production-flavored evals; raid for metric ideas |
| [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | Quick A/B testing of prompts |
| [explodinggradients/ragas](https://github.com/explodinggradients/ragas) | RAG-specific metric definitions |
| [centerforaisafety/HarmBench](https://github.com/centerforaisafety/HarmBench) | Adversarial eval dataset |

## Week 2 — inference

| Repo | What for |
|---|---|
| [vllm-project/vllm](https://github.com/vllm-project/vllm) | Batched local inference. Needed only if you go big on local. |
| [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) | CPU/Mac local inference |
| [ollama/ollama](https://github.com/ollama/ollama) | Easiest local model serving for a laptop |

## Week 3 — interp / steering (if you go that route)

| Repo | What for |
|---|---|
| [jbloomAus/SAELens](https://github.com/jbloomAus/SAELens) | Pretrained SAEs, easy interface |
| [andyrdt/refusal_direction](https://github.com/andyrdt/refusal_direction) | The canonical difference-of-means impl |
| [nrimsky/CAA](https://github.com/nrimsky/CAA) | Contrastive activation addition |
| [neelnanda-io/Easy-Transformer](https://github.com/neelnanda-io/Easy-Transformer) | Predecessor of TransformerLens — historical context |

## Research-engineering reference (skim only, don't depend on)

| Repo | Why |
|---|---|
| [huggingface/trl](https://github.com/huggingface/trl) | PPO / DPO / GRPO reference |
| [OpenRLHF/OpenRLHF](https://github.com/OpenRLHF/OpenRLHF) | Distributed RLHF — see how production code is structured |

## Tools you should have set up

- **Editor**: VS Code with Python, Jupyter, GitLens extensions
- **Env manager**: `uv` (fast) or `mamba` — not raw pip
- **Notebook UI**: Jupyter Lab or VS Code's native notebook view
- **API key storage**: `.env` file + `python-dotenv`, never inline
- **Caching**: `diskcache` or a `~/.cache/<project>/` JSON dump — never re-run an API call you've already made
- **Cost tracking**: a small `cost.py` that logs every API call's tokens-in/tokens-out + price, dumps to CSV. You'll want this when writing the blog post.
- **Plotting**: `matplotlib` + `plotly`. Use plotly for interactivity, matplotlib for paper-quality static plots. `seaborn` for stats plots.
- **Diagrams**: [Excalidraw](https://excalidraw.com/) for the architecture diagram. Hand-drawn aesthetic — surprisingly more memorable than auto-generated.
- **Compute**: Modal, RunPod, or Lambda for GPU. Probably only needed for steering vectors / local model inference at scale.
