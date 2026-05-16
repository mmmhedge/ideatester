"""Mitigation strategies — interventions you A/B against the baseline.

Each mitigation wraps a `complete_fn(prompt) -> str` and returns a new
complete_fn with the intervention applied. Composable.
"""
from __future__ import annotations

from typing import Awaitable, Callable

CompleteFn = Callable[[str], Awaitable[str]]


# ---- 1. Self-check ------------------------------------------------------------
def self_check(complete_fn: CompleteFn, check_template: str | None = None) -> CompleteFn:
    """First-pass answer, then ask the model to verify against the context.
    Return the post-verification answer (which may be a refusal).
    """
    DEFAULT_TEMPLATE = """The proposed answer below was generated for the question. Verify
it against the context. If the answer is correct, return it unchanged. If
incorrect or unsupported, return a corrected answer or "I don't know".

CONTEXT: {context}
QUESTION: {question}
PROPOSED ANSWER: {answer}

FINAL ANSWER:"""
    raise NotImplementedError


# ---- 2. Dual-pass reasoning ---------------------------------------------------
def dual_pass(complete_fn: CompleteFn, agreement_fn: Callable | None = None) -> CompleteFn:
    """Answer the same question twice with different framings (rephrase the question
    using a paraphrase model or a fixed template). If the two answers agree per
    `agreement_fn`, return the first. Otherwise return "I don't know" or run a
    third tiebreaker call.
    """
    raise NotImplementedError


# ---- 3. Retrieval filter ------------------------------------------------------
def retrieval_filter(complete_fn: CompleteFn, relevance_model,
                     threshold: float = 0.5) -> CompleteFn:
    """For RAG-shaped prompts: score each retrieved passage for relevance with a
    cheap reranker; drop passages below `threshold` before sending to the reader.

    `relevance_model` is anything with a .score(query, passage) -> float method,
    e.g. a BGE reranker or an LLM-as-judge.
    """
    raise NotImplementedError


# ---- 4. Confidence-gated abstention ------------------------------------------
def confidence_gate(complete_fn: CompleteFn, confidence_fn: Callable,
                    threshold: float = 0.7,
                    abstain_text: str = "I don't know.") -> CompleteFn:
    """Use a confidence signal (logit margin, consistency across N samples, or a
    second-model judgement). If confidence < threshold, abstain.

    Cost note: high-quality confidence signals require N forward passes — track
    cost-per-correct in your A/B (see metrics.cost_per_correct).
    """
    raise NotImplementedError


# ---- 5. (Optional) Activation steering ---------------------------------------
def activation_steering(complete_fn: CompleteFn, steering_vector, layer: int,
                        coefficient: float = 1.0) -> CompleteFn:
    """Only available with local HF model + TransformerLens hook. See
    mini-project 4. Adds `coefficient * steering_vector` to the residual stream
    at `layer` during generation.
    """
    raise NotImplementedError
