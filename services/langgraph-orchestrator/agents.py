"""
agents.py — CogniVectra LangGraph Agent Implementations
========================================================
Each function here is wrapped as a LangGraph node in orchestrator.py.

CRITICAL: DO NOT modify these agents' core logic.
This file WRAPS intent-based routing TO existing functionality.
All existing Supabase queries, site context, and product knowledge
are preserved exactly as they were in the original ai-search function.

Agents:
  product_info_agent  — MedFlow, StockSteward, StoreAI, EduPortal product info
  comparison_agent    — Competitive comparisons, "why us" queries
  tech_stack_agent    — Architecture and technology questions
  helpdesk_agent      — Support and how-to questions
  analytics_agent     — Data/metrics/report queries (Supabase)
  admin_agent         — Admin/user management queries
  config_agent        — Configuration and settings queries
  general_agent       — Catch-all fallback

Security: tenant_id is enforced in every Supabase query (WHERE tenant_id = ?)
"""

import logging
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from supabase import create_client, Client
from shared.secrets_manager import get_secret

logger = logging.getLogger(__name__)

# ─── Supabase Client (lazy init) ───────────────────────────────────────────────
_supabase: Client | None = None


def _get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        url = get_secret("SUPABASE_URL")
        key = get_secret("SUPABASE_SERVICE_ROLE_KEY")
        _supabase = create_client(url, key)
    return _supabase


# ─── Site Knowledge Base (mirrors existing ai-search context exactly) ──────────
SITE_CONTEXT = {
    "techstack": (
        "CogniVectra uses a high-performance stack: Vite + React 18 for speed, "
        "Framer Motion for premium UI, Supabase for scalable backend/auth, and "
        "Advanced AI Orchestration (LangChain/LangGraph/CrewAI) for agentic and "
        "multi-agent RAG systems."
    ),
    "medflow": (
        "MedFlow EMR: Multi-tenant, HIPAA-ready, and live at Kidz-Clinic. Unlike "
        "legacy EMRs (Epic/Cerner), MedFlow is agile, cloud-native, and reduces "
        "provider onboarding from weeks to hours."
    ),
    "stocksteward": (
        "StockSteward: FinTech intelligence using CrewAI for agentic research. It beats "
        "standard bots by analyzing global sentiment and market liquidity in real-time."
    ),
    "storeai": (
        "StoreAI: Retail intelligence platform with AI-driven inventory, demand forecasting, "
        "and personalized customer engagement at scale."
    ),
    "eduportal": (
        "EduPortal: EdTech platform scaling content delivery for thousands of concurrent "
        "learners with integrated AI tutoring systems."
    ),
    "comparison": (
        "CogniVectra is better because we deliver senior-architected IP that YOU own. "
        "Most competitors provide black-box solutions or high-maintenance offshore code. "
        "We provide production-ready foundations with no technical debt and zero vendor lock-in."
    ),
    "price": (
        "Our modular Launch Packs for startups and Enterprise Retainers for scale save "
        "clients 30-50% on long-term operational costs by building correctly from day one."
    ),
    "customers": (
        "We partner with technical leaders at Kidz-Clinic (Healthcare) and various "
        "North American EdTech/FinTech startups."
    ),
}


def _format_response(context: str, query: str) -> str:
    return (
        f'Neural Intelligence Brief on: "{query}"\n\n{context}\n\n'
        "Our engineering core ensures that every deployment is security-hardened and "
        "performance-optimized. Would you like a technical deep-dive with our lead architect?"
    )


# ─── Agent Functions ───────────────────────────────────────────────────────────

def product_info_agent(query: str, tenant_id: str) -> dict:
    """Answer questions about CogniVectra products."""
    q = query.lower()
    if "medflow" in q or "health" in q or "emr" in q or "medical" in q:
        context = SITE_CONTEXT["medflow"]
    elif "steward" in q or "stock" in q or "fintech" in q or "trading" in q:
        context = SITE_CONTEXT["stocksteward"]
    elif "store" in q or "retail" in q:
        context = SITE_CONTEXT["storeai"]
    elif "edu" in q or "learn" in q or "portal" in q:
        context = SITE_CONTEXT["eduportal"]
    else:
        context = (
            f"{SITE_CONTEXT['medflow']} | {SITE_CONTEXT['stocksteward']} | "
            f"{SITE_CONTEXT['storeai']} | {SITE_CONTEXT['eduportal']}"
        )
    return {
        "answer": _format_response(context, query),
        "agent": "product_info_agent",
        "sources": ["Product Catalog v2.0", "Client Success Metrics"],
    }


def comparison_agent(query: str, tenant_id: str) -> dict:
    """Handle competitive comparison queries."""
    context = f"{SITE_CONTEXT['comparison']} {SITE_CONTEXT['price']}"
    return {
        "answer": _format_response(context, query),
        "agent": "comparison_agent",
        "sources": ["Competitive Analysis Internal v1.5", "Pricing Guide"],
    }


def tech_stack_agent(query: str, tenant_id: str) -> dict:
    """Answer architecture and technology questions."""
    return {
        "answer": _format_response(SITE_CONTEXT["techstack"], query),
        "agent": "tech_stack_agent",
        "sources": ["Architecture System Design v3.0"],
    }


def helpdesk_agent(query: str, tenant_id: str) -> dict:
    """Handle support and how-to queries."""
    context = (
        "CogniVectra provides dedicated technical support through our engagement model. "
        "Our engineers are available for architecture reviews, onboarding, and ongoing support. "
        f"{SITE_CONTEXT['customers']}"
    )
    return {
        "answer": _format_response(context, query),
        "agent": "helpdesk_agent",
        "sources": ["Support Runbook v1.0"],
    }


def analytics_agent(query: str, tenant_id: str) -> dict:
    """Fetch analytics data from Supabase (tenant-isolated)."""
    try:
        supabase = _get_supabase()
        # Tenant-isolated query — tenant_id is always enforced
        result = (
            supabase.table("ai_query_logs")
            .select("intent, count(*)")
            .eq("tenant_id", tenant_id)   # MANDATORY: tenant isolation
            .limit(10)
            .execute()
        )
        data = result.data or []
        summary = f"Found {len(data)} analytics record(s) for tenant {tenant_id}."
        context = f"Analytics Brief: {summary} Query your admin dashboard for full reports."
    except Exception as e:
        logger.warning("Analytics query failed for tenant %s: %s", tenant_id, e)
        context = (
            "Analytics data is available in your CogniVectra admin dashboard. "
            "Contact support for custom report generation."
        )

    return {
        "answer": _format_response(context, query),
        "agent": "analytics_agent",
        "sources": ["Supabase Analytics — Live"],
    }


def admin_agent(query: str, tenant_id: str) -> dict:
    """Handle admin operations queries."""
    context = (
        "CogniVectra admin operations are managed through the Admin Dashboard at /admin. "
        "User creation, role management, and compensation workflows are available to "
        "authenticated administrators. All operations are tenant-isolated."
    )
    return {
        "answer": _format_response(context, query),
        "agent": "admin_agent",
        "sources": ["Admin Operations Guide v1.0"],
    }


def config_agent(query: str, tenant_id: str) -> dict:
    """Handle configuration queries."""
    context = (
        "CogniVectra platform configuration is managed via Supabase environment variables "
        "and the feature flags table. All secrets are encrypted using Fernet (AES-128-CBC). "
        "Contact your platform administrator for configuration changes."
    )
    return {
        "answer": _format_response(context, query),
        "agent": "config_agent",
        "sources": ["Configuration Management Guide v1.0"],
    }


def general_agent(query: str, tenant_id: str) -> dict:
    """Catch-all agent for unclassified queries."""
    context = (
        "CogniVectra is an elite platform engineering firm specializing in GenAI "
        "and Cloud Foundations. Our products span Healthcare (MedFlow), FinTech (StockSteward), "
        "Retail (StoreAI), and Education (EduPortal)."
    )
    return {
        "answer": _format_response(context, query),
        "agent": "general_agent",
        "sources": ["Internal Architecture Docs", "CogniVectra Overview v1.0"],
    }
