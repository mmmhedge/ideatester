"""Context perturbation generators — the 6 control axes.

Given a base (question, gold_passages) pair, produce variant prompts that
vary along controlled dimensions. Each generator returns:
    (prompt: str, perturbation_kind: str, perturbation_params: dict)

Axes:
    1. density            -- number of distractor passages added
    2. semantic_distance  -- distractors range from topically near to far
    3. position           -- where in the context the gold passage sits
    4. token_length       -- pad context to a target length
    5. adversarial_intent -- distractors actively suggest wrong answers
    6. tool_noise         -- (agent setting) corrupt tool returns
"""
from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Literal

# from sentence_transformers import SentenceTransformer
# import numpy as np


@dataclass
class Passage:
    text: str
    source: str | None = None
    embedding: list[float] | None = None


@dataclass
class BaseQuestion:
    qid: str
    question: str
    gold_passages: list[Passage]
    distractor_pool: list[Passage]  # candidate distractors (pre-fetched)
    gold_answer: str


# ---- Axis 1: density ----------------------------------------------------------
def vary_density(q: BaseQuestion, n_distractors: int, seed: int = 0) -> tuple[str, str, dict]:
    """Add N random distractors from the pool; assemble prompt."""
    rng = random.Random(seed)
    chosen = rng.sample(q.distractor_pool, min(n_distractors, len(q.distractor_pool)))
    passages = q.gold_passages + chosen
    rng.shuffle(passages)
    prompt = _build_prompt(q.question, passages)
    return prompt, "density", {"n_distractors": n_distractors, "seed": seed}


# ---- Axis 2: semantic distance ------------------------------------------------
def vary_semantic_distance(q: BaseQuestion, distance_bucket: Literal["near", "mid", "far"],
                           n_distractors: int = 5) -> tuple[str, str, dict]:
    """Pick distractors from a similarity bucket (near/mid/far) relative to question.

    TODO: precompute embeddings of question + pool. Compute cosine sim. Bucket
    distractors into terciles. Return n from the requested bucket.
    """
    raise NotImplementedError


# ---- Axis 3: position ---------------------------------------------------------
def vary_position(q: BaseQuestion, gold_position: Literal["start", "middle", "end"],
                  n_distractors: int = 9) -> tuple[str, str, dict]:
    """Lost-in-the-middle setup. Place gold passage at chosen position; fill rest with distractors."""
    rng = random.Random(0)
    distractors = rng.sample(q.distractor_pool, n_distractors)
    if gold_position == "start":
        passages = q.gold_passages + distractors
    elif gold_position == "end":
        passages = distractors + q.gold_passages
    elif gold_position == "middle":
        half = len(distractors) // 2
        passages = distractors[:half] + q.gold_passages + distractors[half:]
    else:
        raise ValueError(gold_position)
    prompt = _build_prompt(q.question, passages)
    return prompt, "position", {"gold_position": gold_position, "n_distractors": n_distractors}


# ---- Axis 4: token length -----------------------------------------------------
def vary_token_length(q: BaseQuestion, target_tokens: int) -> tuple[str, str, dict]:
    """Pad context with neutral filler to hit a target token length.

    TODO: use a tokenizer to count; pad with stretched distractors until target reached.
    """
    raise NotImplementedError


# ---- Axis 5: adversarial intent ----------------------------------------------
def vary_adversarial(q: BaseQuestion, attack_kind: str,
                     attacks_dataset: list[dict]) -> tuple[str, str, dict]:
    """Inject adversarial passages. attack_kind selects from the taxonomy
    in mini-project 2 (direct_override, indirect_injection, contradicting_evidence, ...).
    """
    raise NotImplementedError


# ---- Axis 6: tool noise (agent setting) --------------------------------------
def vary_tool_noise(tool_output: str, noise_level: float, seed: int = 0) -> str:
    """Corrupt a tool's output with character/word noise scaled by noise_level in [0,1].

    Useful for agent loops, not bare QA.
    """
    raise NotImplementedError


# ---- Prompt assembly ----------------------------------------------------------
PROMPT_TEMPLATE = """Answer the question below using only the provided context.
Be concise. If the context is insufficient, say "I don't know".

CONTEXT:
{context}

QUESTION: {question}

ANSWER:"""


def _build_prompt(question: str, passages: list[Passage]) -> str:
    context = "\n\n---\n\n".join(p.text for p in passages)
    return PROMPT_TEMPLATE.format(context=context, question=question)


# ---- Full sweep generator -----------------------------------------------------
def generate_perturbation_set(q: BaseQuestion, axes: dict) -> list[tuple[str, str, dict]]:
    """One-stop helper. axes is a dict like
        {"density": [0, 1, 3, 5, 10], "position": ["start", "middle", "end"]}
    Cross-product the axes and produce a prompt per cell.
    """
    raise NotImplementedError
