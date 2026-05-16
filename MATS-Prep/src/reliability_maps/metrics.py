"""Scoring functions with bootstrap confidence intervals.

Convention: every metric returns a Metric struct with point estimate + 95% CI.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

# import numpy as np


@dataclass
class Metric:
    name: str
    value: float
    ci_low: float
    ci_high: float
    n: int


# ---- Helpers ------------------------------------------------------------------
def bootstrap_ci(samples: list[float], statistic: Callable = None,
                 n_boot: int = 1000, alpha: float = 0.05, seed: int = 0) -> tuple[float, float]:
    """Percentile bootstrap CI. `statistic` defaults to mean.

    TODO: implement with numpy. Return (low, high).
    """
    raise NotImplementedError


# ---- Core metrics -------------------------------------------------------------
def accuracy(predictions: list[str], gold: list[str], normalize: Callable | None = None) -> Metric:
    """Exact-match accuracy after optional normalization (lowercase, strip punctuation, etc.)."""
    raise NotImplementedError


def consistency(completions_per_question: list[list[str]],
                similarity_fn: Callable | None = None) -> Metric:
    """SelfCheckGPT-style consistency: per question, mean pairwise similarity
    across N sampled completions. Aggregate over questions.

    similarity_fn defaults to embedding cosine.
    """
    raise NotImplementedError


def hallucination_rate(predictions: list[str], gold: list[str],
                       checker: Callable | None = None) -> Metric:
    """Fraction of answers containing entities not supported by gold.

    `checker` is an LLM-as-judge or NLI model that returns bool per (pred, gold) pair.
    """
    raise NotImplementedError


def reasoning_collapse_rate(traces: list[str], collapse_classifier: Callable) -> Metric:
    """Fraction of agent trajectories that end with a confidently-wrong answer.

    Defined as: is_wrong AND confidence_signal > threshold.
    Confidence signal can be self-reported ("I am sure...") or logit-margin.
    """
    raise NotImplementedError


def tool_misuse_rate(traces: list[dict], tool_specs: dict) -> Metric:
    """For agent settings: fraction of tool calls that violate the tool's spec
    (wrong tool, malformed args, ignoring output).
    """
    raise NotImplementedError


# ---- Cost / efficiency --------------------------------------------------------
def cost_per_correct(costs: list[float], is_correct: list[bool]) -> Metric:
    """Total cost divided by number correct. Use for mitigation vs baseline plots —
    a mitigation that doubles accuracy but quadruples cost is not a win.
    """
    raise NotImplementedError
