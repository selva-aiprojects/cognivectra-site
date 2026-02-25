"""
orchestrator.py — LangGraph State Machine Orchestrator
=======================================================
Defines a deterministic LangGraph StateGraph that:
  1. Receives a classified intent
  2. Routes to the correct agent node
  3. Returns the agent's response

State Machine Flow:
  START → route_intent → [product_info | comparison | tech_stack |
                           helpdesk | analytics | admin | config | general]
         → END

Design Principles:
  - Routing is deterministic (intent string → agent) — no LLM used for routing
  - Each agent node is wrapped from agents.py (no logic duplication)
  - tenant_id flows through entire graph state for isolation
  - Fallback to general_agent on unknown intents
"""

import logging
from typing import TypedDict, Literal, Annotated
from langgraph.graph import StateGraph, END, START

from agents import (
    product_info_agent,
    comparison_agent,
    tech_stack_agent,
    helpdesk_agent,
    analytics_agent,
    admin_agent,
    config_agent,
    general_agent,
)

logger = logging.getLogger(__name__)

# ─── Graph State Schema ────────────────────────────────────────────────────────
class OrchestrationState(TypedDict):
    query: str
    intent: str
    confidence: float
    tenant_id: str
    user_id: str | None
    answer: str
    agent_used: str
    sources: list[str]
    error: str | None


# ─── Intent → Route Mapping ───────────────────────────────────────────────────
INTENT_ROUTE_MAP = {
    "PRODUCT_INFO":        "product_info",
    "COMPARISON_QUERY":    "comparison",
    "TECH_STACK":          "tech_stack",
    "HELPDESK_QUERY":      "helpdesk",
    "VIEW_ANALYTICS":      "analytics",
    "CREATE_USER":         "admin",
    "CONFIGURATION_QUERY": "config",
    "GENERAL":             "general",
}

RouteType = Literal["product_info", "comparison", "tech_stack", "helpdesk",
                    "analytics", "admin", "config", "general"]


# ─── Router Node ──────────────────────────────────────────────────────────────
def route_intent(state: OrchestrationState) -> RouteType:
    """Deterministic router: maps intent string to the correct agent node."""
    intent = state.get("intent", "GENERAL").upper()
    route = INTENT_ROUTE_MAP.get(intent, "general")
    logger.info("Routing intent='%s' → node='%s' (tenant=%s)", intent, route, state["tenant_id"])
    return route


# ─── Agent Node Wrappers ──────────────────────────────────────────────────────
def _make_node(agent_fn):
    """Wrap an agent function as a LangGraph node (state-in → state-out)."""
    def node(state: OrchestrationState) -> OrchestrationState:
        try:
            result = agent_fn(state["query"], state["tenant_id"])
            return {
                **state,
                "answer": result["answer"],
                "agent_used": result["agent"],
                "sources": result.get("sources", []),
                "error": None,
            }
        except Exception as e:
            logger.error("Agent %s failed: %s", agent_fn.__name__, e, exc_info=True)
            return {
                **state,
                "answer": "I encountered an issue processing your request. Please try again.",
                "agent_used": agent_fn.__name__,
                "sources": [],
                "error": str(e),
            }
    node.__name__ = agent_fn.__name__ + "_node"
    return node


# ─── Build Graph ──────────────────────────────────────────────────────────────
def build_graph() -> StateGraph:
    """Construct and compile the LangGraph orchestration state machine."""
    builder = StateGraph(OrchestrationState)

    # Add all agent nodes
    builder.add_node("product_info", _make_node(product_info_agent))
    builder.add_node("comparison",   _make_node(comparison_agent))
    builder.add_node("tech_stack",   _make_node(tech_stack_agent))
    builder.add_node("helpdesk",     _make_node(helpdesk_agent))
    builder.add_node("analytics",    _make_node(analytics_agent))
    builder.add_node("admin",        _make_node(admin_agent))
    builder.add_node("config",       _make_node(config_agent))
    builder.add_node("general",      _make_node(general_agent))

    # Add conditional entry edge from START based on intent
    builder.add_conditional_edges(
        START,
        route_intent,
        {
            "product_info": "product_info",
            "comparison":   "comparison",
            "tech_stack":   "tech_stack",
            "helpdesk":     "helpdesk",
            "analytics":    "analytics",
            "admin":        "admin",
            "config":       "config",
            "general":      "general",
        },
    )

    # All agent nodes terminate at END
    for node_name in ["product_info", "comparison", "tech_stack", "helpdesk",
                       "analytics", "admin", "config", "general"]:
        builder.add_edge(node_name, END)

    return builder.compile()


# Module-level compiled graph singleton
_graph = None


def get_graph():
    global _graph
    if _graph is None:
        _graph = build_graph()
        logger.info("✅ LangGraph orchestration graph compiled.")
    return _graph


def orchestrate(query: str, intent: str, confidence: float,
                tenant_id: str, user_id: str | None = None) -> dict:
    """
    Run the orchestration graph for a classified query.
    Returns the final state dict with answer, agent_used, sources.
    """
    graph = get_graph()

    initial_state: OrchestrationState = {
        "query": query,
        "intent": intent,
        "confidence": confidence,
        "tenant_id": tenant_id,
        "user_id": user_id,
        "answer": "",
        "agent_used": "",
        "sources": [],
        "error": None,
    }

    final_state = graph.invoke(initial_state)
    return final_state
