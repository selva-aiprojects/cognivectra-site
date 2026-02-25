"""
main.py — CogniVectra LangGraph Orchestrator Service
=====================================================
FastAPI microservice that receives a classified intent + query,
runs the LangGraph state machine, and returns an AI-generated response.

Endpoints:
  POST /orchestrate — Run orchestration for a classified query
  GET  /health      — Service health check

Flow:
  intent-router → POST /orchestrate → LangGraph graph → agent → response
"""

# ─── Imports ──────────────────────────────────────────────────────────────────
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager

from orchestrator import orchestrate, get_graph

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger("langgraph-orchestrator")


# ─── Request / Response Models ─────────────────────────────────────────────────
class OrchestrateRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    intent: str = Field(..., description="Intent label from intent-router")
    confidence: float = Field(..., ge=0.0, le=1.0)
    tenant_id: str = Field(..., min_length=1, max_length=100)
    user_id: str | None = Field(None)


class OrchestrateResponse(BaseModel):
    answer: str
    agent_used: str
    sources: list[str]
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
    logger.info("🚀 LangGraph Orchestrator starting up — compiling graph...")
    try:
        get_graph()   # Pre-compile graph at startup
        logger.info("✅ LangGraph graph compiled and ready.")
    except Exception as e:
        logger.error("❌ Graph compilation failed: %s", e)
    yield
    logger.info("🛑 LangGraph Orchestrator shutting down.")


# ─── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CogniVectra LangGraph Orchestrator",
    description="Deterministic LangGraph agent orchestration for CogniVectra AI routing",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


# ─── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["Observability"])
async def health():
    return HealthResponse(status="ok", service="langgraph-orchestrator", version="1.0.0")


@app.post("/orchestrate", response_model=OrchestrateResponse, tags=["Orchestration"])
async def run_orchestration(body: OrchestrateRequest):
    """
    Execute LangGraph orchestration for a pre-classified query.
    Routes to the appropriate agent based on intent.
    Enforces tenant_id isolation through the full graph execution.
    """
    start_ms = time.monotonic() * 1000
    logger.info(
        "orchestrate | intent=%s confidence=%.2f tenant=%s user=%s",
        body.intent,
        body.confidence,
        body.tenant_id,
        body.user_id or "anonymous",
    )

    try:
        result = orchestrate(
            query=body.query,
            intent=body.intent,
            confidence=body.confidence,
            tenant_id=body.tenant_id,
            user_id=body.user_id,
        )

        elapsed_ms = (time.monotonic() * 1000) - start_ms

        if result.get("error"):
            logger.warning("Agent returned error: %s", result["error"])

        logger.info(
            "agent=%s latency_ms=%.1f",
            result.get("agent_used", "unknown"),
            elapsed_ms,
        )

        return OrchestrateResponse(
            answer=result["answer"],
            agent_used=result.get("agent_used", "unknown"),
            sources=result.get("sources", []),
            intent=body.intent,
            confidence=body.confidence,
            latency_ms=round(elapsed_ms, 2),
        )

    except Exception as e:
        logger.error("Orchestration failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Orchestration failed.")


# ─── Entry Point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=False, workers=2)
