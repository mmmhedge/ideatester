"""Thin async clients for OpenAI, Anthropic, and a local HF/transformers model.

Design goals:
    - one async `complete()` entrypoint per provider, same signature
    - automatic retries on rate limits (tenacity)
    - per-call cost tracking returned in the response struct
    - no hidden state — caching belongs in runners.py, not here
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Optional

# NOTE: imports below are stubbed; uncomment as you flesh out each provider.
# from openai import AsyncOpenAI
# from anthropic import AsyncAnthropic
# import torch
# from transformers import AutoModelForCausalLM, AutoTokenizer


@dataclass
class CompletionResult:
    """Provider-agnostic completion response."""
    text: str
    model: str
    provider: str
    prompt_tokens: int
    completion_tokens: int
    cost_usd: float
    latency_s: float
    raw: dict = field(default_factory=dict)  # provider-specific payload


# ---- Pricing (USD per 1M tokens) ----------------------------------------------
# Keep up to date. These numbers feed the cost-tracking column in your plots.
PRICING = {
    "gpt-4o":            {"in": 2.50,  "out": 10.00},
    "gpt-4o-mini":       {"in": 0.15,  "out": 0.60},
    "claude-sonnet-4-6": {"in": 3.00,  "out": 15.00},
    "claude-haiku-4-5":  {"in": 1.00,  "out": 5.00},
    # local models cost ~ GPU rental; tracked separately
}


def _price(model: str, in_tok: int, out_tok: int) -> float:
    p = PRICING.get(model, {"in": 0, "out": 0})
    return (in_tok * p["in"] + out_tok * p["out"]) / 1_000_000


# ---- OpenAI -------------------------------------------------------------------
class OpenAIProvider:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ["OPENAI_API_KEY"]
        # self.client = AsyncOpenAI(api_key=self.api_key)

    async def complete(self, prompt: str, model: str = "gpt-4o-mini",
                       temperature: float = 0.0, max_tokens: int = 512) -> CompletionResult:
        """TODO: implement. Should:
        1. time the request
        2. retry on RateLimitError with exponential backoff (tenacity)
        3. extract token usage from response.usage
        4. compute cost via _price()
        5. return CompletionResult
        """
        raise NotImplementedError


# ---- Anthropic ----------------------------------------------------------------
class AnthropicProvider:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ["ANTHROPIC_API_KEY"]
        # self.client = AsyncAnthropic(api_key=self.api_key)

    async def complete(self, prompt: str, model: str = "claude-haiku-4-5",
                       temperature: float = 0.0, max_tokens: int = 512) -> CompletionResult:
        """TODO: same shape as OpenAIProvider.complete."""
        raise NotImplementedError


# ---- Local HF (sync wrapped in asyncio.to_thread) -----------------------------
class LocalHFProvider:
    """Local model via HF transformers. For CPU/Mac use Qwen2-0.5B or TinyLlama."""

    def __init__(self, model_name: str = "Qwen/Qwen2-0.5B-Instruct", device: str = "auto"):
        self.model_name = model_name
        self.device = device
        # self.tok = AutoTokenizer.from_pretrained(model_name)
        # self.model = AutoModelForCausalLM.from_pretrained(model_name, device_map=device)

    async def complete(self, prompt: str, model: str = None,
                       temperature: float = 0.0, max_tokens: int = 512) -> CompletionResult:
        """TODO: use asyncio.to_thread to wrap a sync generate() call.
        cost_usd = 0.0 for local; track GPU time separately if you care.
        """
        raise NotImplementedError


# ---- Convenience: provider registry -------------------------------------------
def get_provider(name: str):
    return {
        "openai":    OpenAIProvider,
        "anthropic": AnthropicProvider,
        "local":     LocalHFProvider,
    }[name]()
