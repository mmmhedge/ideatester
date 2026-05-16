# 05 — Reading List

**Reading budget: ~1 hour per evening. No more.** You learn by building; reading is to seed building.

## Must Read (Week 1)

| # | Paper | Why | When |
|---|---|---|---|
| 1 | [Attention Is All You Need (Vaswani 2017)](https://arxiv.org/abs/1706.03762) | Foundation. Skim §3 carefully. | Day 1 |
| 2 | [A Mathematical Framework for Transformer Circuits (Elhage 2021)](https://transformer-circuits.pub/2021/framework/index.html) | The lens you'll think through. §1–3. | Day 2 |
| 3 | [ReAct (Yao 2022)](https://arxiv.org/abs/2210.03629) | Agent baseline. | Day 3 |
| 4 | [Reflexion (Shinn 2023)](https://arxiv.org/abs/2303.11366) | Self-correction. | Day 3 |
| 5 | [Toolformer (Schick 2023)](https://arxiv.org/abs/2302.04761) | Tool use. | Day 3 |
| 6 | [SelfCheckGPT (Manakul 2023)](https://arxiv.org/abs/2303.08896) | Consistency-based hallucination scoring. | Day 4 |
| 7 | [TruthfulQA (Lin 2021)](https://arxiv.org/abs/2109.07958) | Eval design canon. | Day 4 |
| 8 | [Lost in the Middle (Liu 2023)](https://arxiv.org/abs/2307.03172) | The direct ancestor of your main project. | Day 5 |
| 9 | [RAG (Lewis 2020)](https://arxiv.org/abs/2005.11401) | Original RAG. | Day 5 |
| 10 | [The Power of Noise (Cuconasu 2024)](https://arxiv.org/abs/2401.14887) | The other direct ancestor. | Day 5 |

## Must Read (Week 2 — for the main project)

| # | Paper | Why |
|---|---|---|
| 11 | [HELM (Liang 2022)](https://arxiv.org/abs/2211.09110) | How to design a defensible eval. Skim §2, §5. |
| 12 | [BIG-bench (Srivastava 2022)](https://arxiv.org/abs/2206.04615) | Eval design philosophy. |
| 13 | [Sycophancy in LLMs (Sharma 2023)](https://arxiv.org/abs/2310.13548) | A reliability failure mode you'll see in your data. |
| 14 | [Chain-of-Thought is not Faithful (Turpin 2023)](https://arxiv.org/abs/2305.04388) | Reasoning ≠ explanation. Reframes your interpretation. |
| 15 | [Universal Adversarial Suffixes / GCG (Zou 2023)](https://arxiv.org/abs/2307.15043) | Attack surface for adversarial axis. |
| 16 | [Many-shot Jailbreaking (Anil et al., Anthropic 2024)](https://www.anthropic.com/research/many-shot-jailbreaking) | Long-context failure modes. |
| 17 | [Best-of-N Jailbreaking (Hughes 2024)](https://arxiv.org/abs/2412.03556) | Cheap attacks; useful baseline. |
| 18 | [Sleeper Agents (Hubinger 2024)](https://arxiv.org/abs/2401.05566) | Conditional behavior. Connects to "agent failure forensics" angle. |

## Bonus (Week 3 — read if you want, cite if relevant)

| # | Paper / Post |
|---|---|
| 19 | [Scaling Monosemanticity (Anthropic 2024)](https://transformer-circuits.pub/2024/scaling-monosemanticity/) |
| 20 | [Toy Models of Superposition (Elhage 2022)](https://transformer-circuits.pub/2022/toy_model/index.html) |
| 21 | [Refusal in LLMs is Mediated by a Single Direction (Arditi 2024)](https://arxiv.org/abs/2406.11717) |
| 22 | [Activation Addition (Turner 2023)](https://arxiv.org/abs/2308.10248) |
| 23 | [Discovering Latent Knowledge / CCS (Burns 2022)](https://arxiv.org/abs/2212.03827) |
| 24 | [Inference-Time Intervention (Li 2023)](https://arxiv.org/abs/2306.03341) |
| 25 | [Constitutional AI (Bai 2022)](https://arxiv.org/abs/2212.08073) |
| 26 | [Weak-to-Strong Generalization (Burns 2023)](https://arxiv.org/abs/2312.09390) |
| 27 | [Measuring AI's Ability to Complete Long Tasks (METR 2025)](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) — long-task reliability data; cite in intro |
| 28 | [Debate (Irving 2018)](https://arxiv.org/abs/1805.00899) — scalable oversight foundations |
| 29 | [RULER (Hsieh 2024)](https://arxiv.org/abs/2404.06654) — long-context eval design |
| 30 | [Auditing Language Models for Hidden Objectives (Anthropic 2024)](https://arxiv.org/abs/2503.10965) — alignment-evals framing |

## How to read a paper in 25 minutes (for these)

1. **Title + abstract** (2 min) — what's the claim?
2. **All figures + captions** (8 min) — what's the evidence?
3. **Intro + first paragraph of related work** (5 min) — why does it matter?
4. **Skim methods** (5 min) — what knobs would you turn?
5. **Discussion / limitations** (5 min) — what's the next paper that wants to be written?

Take 3 bullet points of notes per paper in a single `papers-notes.md` file. Stop pretending you'll re-read them.

## Blog posts worth queuing

- [Anthropic Engineering Blog](https://www.anthropic.com/engineering) — read the most recent 3 posts
- [Transformer Circuits Thread](https://transformer-circuits.pub/) — pin to your sidebar
- [Simon Willison on prompt injection](https://simonwillison.net/tags/prompt-injection/)
- [LessWrong AI Alignment Forum](https://www.alignmentforum.org/) — search "evals" and "agent failure" tags
- [Eleuther blog](https://blog.eleuther.ai/) — eval/training infrastructure
- [METR Blog](https://metr.org/blog/) — eval design done right
