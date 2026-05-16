"""Async evaluation runner with disk caching and resumption.

A "run" sweeps over (model, question, perturbation_params) and produces a long
DataFrame of results. Designed so that:
    - any single cell is independently cacheable
    - re-running with the same args is free (cache hit)
    - failures don't lose the whole sweep — partial results persist
"""
from __future__ import annotations

import asyncio
import hashlib
import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Callable, Iterable

# import diskcache
# import pandas as pd

from .providers import CompletionResult


@dataclass
class EvalCell:
    """One (model × question × perturbation) experimental unit."""
    model: str
    provider: str
    question_id: str
    perturbation_kind: str           # e.g. "distractor_count=5,position=middle"
    perturbation_params: dict
    prompt: str
    gold_answer: str | None = None


@dataclass
class EvalResult:
    cell: EvalCell
    completion: CompletionResult
    extracted_answer: str | None = None
    is_correct: bool | None = None
    consistency: float | None = None
    extras: dict = None


def cell_key(cell: EvalCell) -> str:
    """Deterministic hash for cache lookup."""
    payload = {
        "model": cell.model,
        "provider": cell.provider,
        "qid": cell.question_id,
        "perturbation_kind": cell.perturbation_kind,
        "params": cell.perturbation_params,
        "prompt": cell.prompt,
    }
    h = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    return h[:16]


class Runner:
    """Async runner with on-disk cache.

    Usage:
        runner = Runner(cache_dir=".cache/run-2025-05-15")
        results = await runner.run(cells, scorer=my_scorer, max_concurrency=8)
    """

    def __init__(self, cache_dir: str = ".cache", max_concurrency: int = 8):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        # self.cache = diskcache.Cache(str(self.cache_dir))
        self.sem = asyncio.Semaphore(max_concurrency)

    async def _run_one(self, cell: EvalCell, provider_fn: Callable,
                       scorer: Callable | None = None) -> EvalResult:
        """TODO: implement.
        1. compute cell_key, check cache; return cached result if hit
        2. acquire semaphore
        3. call provider_fn(cell.prompt) -> CompletionResult
        4. if scorer provided, run scorer(cell, completion) -> dict of extras
        5. build EvalResult, write to cache, return
        """
        raise NotImplementedError

    async def run(self, cells: Iterable[EvalCell], provider_fn: Callable,
                  scorer: Callable | None = None) -> list[EvalResult]:
        """TODO: dispatch _run_one across cells, gather, return list."""
        raise NotImplementedError

    def to_dataframe(self, results: list[EvalResult]):
        """Flatten EvalResult list into a tidy pandas DataFrame.

        Columns to emit:
            model, provider, question_id, perturbation_kind, *params,
            prompt_tokens, completion_tokens, cost_usd, latency_s,
            extracted_answer, is_correct, consistency, *extras
        """
        raise NotImplementedError
