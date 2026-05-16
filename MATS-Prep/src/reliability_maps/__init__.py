"""Reliability Maps — phase diagrams of agent failure under context perturbations.

Package layout:
    providers.py    -- thin async clients for OpenAI / Anthropic / local HF
    runners.py      -- async evaluation runner with disk caching
    distractors.py  -- context perturbation generators (6 control axes)
    metrics.py      -- accuracy, consistency, hallucination, collapse-rate
    mitigations.py  -- self-check, dual-pass, retrieval filter, abstention
"""

__version__ = "0.0.1"
