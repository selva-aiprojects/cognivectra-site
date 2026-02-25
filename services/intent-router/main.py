"""
main.py — CogniVectra Intent Router Service
============================================
FastAPI microservice that classifies incoming AI queries into intents.

Endpoints:
  POST /intent-classify — Classify a query and return intent + confidence
  GET  /health          — Service health check

Security:
  - All API keys encrypted via Fernet; decrypted at runtime via SecretsManager
  - tenant_id is required and logged but never stored with raw keys
  - Requests validated via Pydantic models
"""

import time
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager

from intent_engine import get_engine

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("intent-router")


# ─── Request / Response Models ─────────────────────────────────────────────────
class IntentRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, description="User query to classify")
    tenant_id: str = Field(..., min_length=1, max_length=100, description="Tenant identifier for isolation")
    user_id: str | None = Field(None, description="Optional user identifier for logging")


class IntentResponse(BaseModel):
    intent: str
    confidence: float
    latency_ms: float


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


# ─── App Lifecycle ─────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Pre-warm the intent engine on startup to avoid cold start latency."""
    logger.info("🚀 Intent Router starting up — pre-warming engine...")
    try:
        engine = get_engine()
        logger.info("✅ Intent engine ready (LoRA=%s)", engine._use_lora)
    except Exception as e:
        logger.error("❌ Intent engine failed to initialize: %s", e)
        # Don't block startup — first request will attempt re-init
    yield
    logger.info("🛑 Intent Router shutting down.")


# ─── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CogniVectra Intent Router",
    description="LoRA-based AI intent classification microservice",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to Supabase Edge Function IPs in production
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


# ─── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["Observability"])
async def health():
    """Liveness probe. Returns 200 when service is ready."""
    return HealthResponse(status="ok", service="intent-router", version="1.0.0")


@app.post("/intent-classify", response_model=IntentResponse, tags=["Classification"])
async def classify_intent(body: IntentRequest, request: Request):
    """
    Classify a user query into an intent.

    - Validates inputs via Pydantic
    - Enforces tenant_id presence (for downstream isolation)
    - Logs request metadata (never logs raw API keys or sensitive content)
    - Returns intent + confidence + latency within target <100ms (GPU / <500ms CPU zero-shot)
    """
    start_ms = time.monotonic() * 1000
    logger.info(
        "classify_intent | tenant=%s user=%s query_len=%d",
        body.tenant_id,
        body.user_id or "anonymous",
        len(body.query),
    )

    try:
        engine = get_engine()
        intent, confidence = engine.classify(body.query)
        elapsed_ms = (time.monotonic() * 1000) - start_ms

        logger.info(
            "intent=%s confidence=%.2f latency_ms=%.1f",
            intent, confidence, elapsed_ms,
        )

        return IntentResponse(
            intent=intent,
            confidence=round(confidence, 4),
            latency_ms=round(elapsed_ms, 2),
        )

    except EnvironmentError as e:
        # Missing secret — service misconfiguration
        logger.error("Secret configuration error: %s", e)
        raise HTTPException(status_code=503, detail="Service configuration error. Check secrets.")

    except Exception as e:
        logger.error("Classification failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Intent classification failed.")


# ─── Entry Point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False, workers=2)
