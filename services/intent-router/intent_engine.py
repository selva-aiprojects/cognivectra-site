"""
intent_engine.py — LoRA Intent Classification Engine
=====================================================
Classifies incoming queries into one of the defined intents using:
  - Phase 1 (default): Zero-shot classification via OpenAI/Groq API
  - Phase 2+: PEFT LoRA fine-tuned adapter loaded on top of a base LLM

Intent taxonomy:
  PRODUCT_INFO        — Questions about MedFlow, StockSteward, StoreAI, EduPortal
  COMPARISON_QUERY    — "Why better than X?", competitor comparisons
  TECH_STACK          — Questions about architecture, technology choices
  HELPDESK_QUERY      — Support, how-to, troubleshooting
  VIEW_ANALYTICS      — Requests to see data, metrics, reports
  CREATE_USER         — Admin user management operations
  CONFIGURATION_QUERY — Settings, configuration, setup queries
  GENERAL             — Catch-all for unclassified intents
"""

import time
import logging
import os
from typing import Literal
from openai import OpenAI
from shared.secrets_manager import get_secret

logger = logging.getLogger(__name__)

INTENT_LABELS = [
    "PRODUCT_INFO",
    "COMPARISON_QUERY",
    "TECH_STACK",
    "HELPDESK_QUERY",
    "VIEW_ANALYTICS",
    "CREATE_USER",
    "CONFIGURATION_QUERY",
    "GENERAL",
]

SYSTEM_PROMPT = """You are an intent classification engine for CogniVectra, an enterprise AI/SaaS platform.
Classify the user query into exactly ONE of these intents:

- PRODUCT_INFO: Questions about CogniVectra products (MedFlow, StockSteward, StoreAI, EduPortal)
- COMPARISON_QUERY: Comparisons to competitors, "why better than", "vs" questions
- TECH_STACK: Questions about technical architecture, frameworks, infrastructure
- HELPDESK_QUERY: Support questions, how-to, troubleshooting, setup help
- VIEW_ANALYTICS: Requests to see metrics, reports, dashboards, data
- CREATE_USER: Admin operations — creating users, roles, permissions
- CONFIGURATION_QUERY: Settings, configuration, environment setup
- GENERAL: Anything that does not clearly match the above

Respond with ONLY the intent label (e.g. PRODUCT_INFO). No explanation."""


class IntentEngine:
    """
    Zero-shot intent classifier (Phase 1).
    Swap classify() internals in Phase 2 to load a real LoRA adapter.
    """

    def __init__(self):
        self._client = None
        self._use_lora = os.environ.get("LORA_ADAPTER_PATH") and os.path.exists(
            os.environ.get("LORA_ADAPTER_PATH", "")
        )
        if self._use_lora:
            self._load_lora_adapter()
        else:
            logger.info("LoRA adapter not found — using zero-shot OpenAI classification.")

    def _get_openai_client(self) -> OpenAI:
        if self._client is None:
            api_key = get_secret("OPENAI_API_KEY")
            self._client = OpenAI(api_key=api_key)
        return self._client

    def _load_lora_adapter(self):
        """
        Phase 2: Load a PEFT LoRA adapter.
        Uncomment and implement when a fine-tuned adapter is available.
        """
        try:
            from peft import PeftModel
            from transformers import AutoModelForCausalLM, AutoTokenizer

            base_model_name = os.environ.get(
                "BASE_MODEL_NAME", "meta-llama/Meta-Llama-3.1-8B-Instruct"
            )
            adapter_path = os.environ["LORA_ADAPTER_PATH"]

            logger.info("Loading base model: %s", base_model_name)
            self._tokenizer = AutoTokenizer.from_pretrained(base_model_name)
            base_model = AutoModelForCausalLM.from_pretrained(
                base_model_name, device_map="auto", load_in_4bit=True
            )
            self._lora_model = PeftModel.from_pretrained(base_model, adapter_path)
            self._lora_model.eval()
            logger.info("LoRA adapter loaded from: %s", adapter_path)
        except Exception as e:
            logger.error("Failed to load LoRA adapter: %s — falling back to zero-shot.", e)
            self._use_lora = False

    def classify(self, query: str) -> tuple[str, float]:
        """
        Classify a query into an intent.
        Returns: (intent_label, confidence_score)
        """
        if self._use_lora:
            return self._classify_lora(query)
        return self._classify_zero_shot(query)

    def _classify_zero_shot(self, query: str) -> tuple[str, float]:
        """Call OpenAI API for zero-shot intent classification."""
        client = self._get_openai_client()

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query},
            ],
            max_tokens=20,
            temperature=0.0,  # Deterministic for classification
        )

        raw_intent = response.choices[0].message.content.strip().upper()

        # Validate intent is in known labels
        if raw_intent not in INTENT_LABELS:
            logger.warning("Unknown intent '%s' returned — defaulting to GENERAL.", raw_intent)
            return "GENERAL", 0.5

        # Derive pseudo-confidence from finish_reason (full = high confidence)
        finish_reason = response.choices[0].finish_reason
        confidence = 0.92 if finish_reason == "stop" else 0.6

        return raw_intent, confidence

    def _classify_lora(self, query: str) -> tuple[str, float]:
        """Use loaded LoRA adapter for classification (Phase 2)."""
        import torch

        prompt = f"{SYSTEM_PROMPT}\n\nUser query: {query}\nIntent:"
        inputs = self._tokenizer(prompt, return_tensors="pt").to("cuda" if torch.cuda.is_available() else "cpu")

        with torch.no_grad():
            outputs = self._lora_model.generate(**inputs, max_new_tokens=10, temperature=0.0)

        decoded = self._tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Extract last token(s) as the intent label
        intent_raw = decoded.split("Intent:")[-1].strip().upper().split()[0]

        if intent_raw not in INTENT_LABELS:
            return "GENERAL", 0.5

        return intent_raw, 0.95  # LoRA model = higher confidence


# Module-level singleton
_engine: IntentEngine | None = None


def get_engine() -> IntentEngine:
    global _engine
    if _engine is None:
        _engine = IntentEngine()
    return _engine
