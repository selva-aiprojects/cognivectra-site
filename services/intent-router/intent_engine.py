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
    Multi-adapter intent classifier (Phase 2).
    Maintains a registry of 'warm' adapters for zero-latency switching.
    """

    def __init__(self):
        self._client = None
        self._tokenizer = None
        self._lora_model = None
        self._adapters_registry = self._parse_adapters_env()
        
        if self._adapters_registry:
            self._load_warm_adapters()
        else:
            logger.info("No LoRA adapters configured — using zero-shot OpenAI classification.")

    def _parse_adapters_env(self) -> dict[str, str]:
        """Parse LORA_ADAPTERS="name1:path1,name2:path2" into a dict."""
        adapters_str = os.environ.get("LORA_ADAPTERS", "")
        # Fallback to legacy single path if registry env isn't set
        if not adapters_str and os.environ.get("LORA_ADAPTER_PATH"):
            return {"default": os.environ["LORA_ADAPTER_PATH"]}
            
        registry = {}
        if adapters_str:
            for pair in adapters_str.split(","):
                if ":" in pair:
                    name, path = pair.split(":", 1)
                    registry[name.strip()] = path.strip()
        return registry

    def _get_openai_client(self) -> OpenAI:
        if self._client is None:
            api_key = get_secret("OPENAI_API_KEY")
            self._client = OpenAI(api_key=api_key)
        return self._client

    def _load_warm_adapters(self):
        """
        Phase 2: Load multiple PEFT LoRA adapters into a single warm model instance.
        """
        try:
            from peft import PeftModel
            from transformers import AutoModelForCausalLM, AutoTokenizer
            import torch

            base_model_name = os.environ.get(
                "BASE_MODEL_NAME", "meta-llama/Meta-Llama-3.1-8B-Instruct"
            )
            
            # Load Base Model & Tokenizer once
            logger.info("Loading base model for Multi-Adapter Registry: %s", base_model_name)
            self._tokenizer = AutoTokenizer.from_pretrained(base_model_name)
            base_model = AutoModelForCausalLM.from_pretrained(
                base_model_name, 
                device_map="auto", 
                torch_dtype=torch.float16,
                load_in_4bit=True
            )

            # Load adapters into the registry
            first_adapter = True
            for name, path in self._adapters_registry.items():
                if first_adapter:
                    logger.info("Initializing PEFT model with base adapter '%s' from: %s", name, path)
                    self._lora_model = PeftModel.from_pretrained(base_model, path, adapter_name=name)
                    first_adapter = False
                else:
                    logger.info("Adding warm adapter '%s' from: %s", name, path)
                    self._lora_model.load_adapter(path, name)
            
            self._lora_model.eval()
            logger.info("✅ Warm Adapter Registry initialized with %d adapters.", len(self._adapters_registry))
        except Exception as e:
            logger.error("Failed to initialize Warm Adapter Registry: %s — falling back to zero-shot.", e)
            self._lora_model = None

    def classify(self, query: str, task: str = "default") -> tuple[str, float]:
        """
        Classify a query into an intent.
        'task' parameter allows selecting a specific warm adapter.
        """
        if self._lora_model is not None:
            return self._classify_lora(query, task)
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
            temperature=0.0,
        )

        raw_intent = response.choices[0].message.content.strip().upper()
        if raw_intent not in INTENT_LABELS:
            return "GENERAL", 0.5

        finish_reason = response.choices[0].finish_reason
        confidence = 0.92 if finish_reason == "stop" else 0.6
        return raw_intent, confidence

    def _classify_lora(self, query: str, task: str) -> tuple[str, float]:
        """Use Warm Adapter for high-speed switching classification."""
        import torch

        # Zero-latency switch to the requested adapter
        if task in self._adapters_registry:
            self._lora_model.set_adapter(task)
        else:
            # Fallback to first available if requested task not found
            default_adapt = list(self._adapters_registry.keys())[0]
            self._lora_model.set_adapter(default_adapt)

        prompt = f"{SYSTEM_PROMPT}\n\nUser query: {query}\nIntent:"
        inputs = self._tokenizer(prompt, return_tensors="pt").to(self._lora_model.device)

        with torch.no_grad():
            outputs = self._lora_model.generate(**inputs, max_new_tokens=10, temperature=0.0)

        decoded = self._tokenizer.decode(outputs[0], skip_special_tokens=True)
        intent_raw = decoded.split("Intent:")[-1].strip().upper().split()[0]

        if intent_raw not in INTENT_LABELS:
            return "GENERAL", 0.5

        return intent_raw, 0.95


# Module-level singleton
_engine: IntentEngine | None = None


def get_engine() -> IntentEngine:
    global _engine
    if _engine is None:
        _engine = IntentEngine()
    return _engine
