# 🧠 AI Implementation: CrewAI & LangGraph State Management

This document serves as a technical reference for the state management and orchestration patterns used in CogniVectra's multi-agent systems.

---

## 🏗️ The Problem: CrewAI Cyclic References

While **CrewAI** is exceptional for autonomous agentic research and task execution, pure CrewAI implementations can sometimes encounter "non-deterministic cycles" or infinite loops when agents are allowed to delegate tasks back and forth without a strict terminal state.

### Challenges:
- **State Drift**: Difficulty in tracking the "source of truth" across multiple autonomous delegations.
- **Infinite Loops**: Agents repeatedly referring tasks to each other under certain edge cases.
- **Cost/Token Bloat**: Recursive loops leading to unnecessary LLM calls.

---

## 🛡️ The Solution: LangGraph Orchestration

To eliminate these issues, CogniVectra utilizes **LangGraph** as a deterministic state machine layer *on top* of specialized agent nodes.

### 1. Deterministic State Machine
Instead of letting agents decide the next high-level step autonomously, a **StateGraph** defines the flow:
- **Linear & Cyclic Control**: High-level cycles are explicitly defined (e.g., "Retry once if confidence < 0.8").
- **Terminal States**: Every path is guaranteed to reach `END`.

### 2. Centralized State (`OrchestrationState`)
All agents operate on a shared, immutable-style state dictionary:
```python
class OrchestrationState(TypedDict):
    query: str
    intent: str
    tenant_id: str
    answer: str
    agent_used: str
    # State persists across transitions
```

---

## 🚀 Performance: Warm Adapter Strategy

For the routing layer (**Intent Router**), we use a **Warm Adapter Registry** to ensure the state machine enters the correct node with zero latency.

- **Pre-loaded weights**: LoRA adapters are loaded into VRAM at startup.
- **Microsecond switching**: `model.set_adapter(name)` is used to swap specialized logic (e.g., for different industries) without a "cold start."

---

## 🛠️ Developer Reference

- **Orchestrator**: [orchestrator.py](file:///d:/Training/working/cognivectra-site/services/langgraph-orchestrator/orchestrator.py)
- **Agent Definitions**: [agents.py](file:///d:/Training/working/cognivectra-site/services/langgraph-orchestrator/agents.py)
- **Intent Engine**: [intent_engine.py](file:///d:/Training/working/cognivectra-site/services/intent-router/intent_engine.py)

---

## 📋 Best Practices
1. **Never delegate out-of-graph**: Agents should finish their task and return state to the orchestrator rather than calling other high-level agents directly.
2. **Keep State Lean**: Only store data required for routing or the final answer in the `OrchestrationState`.
3. **Use Specialized Adapters**: For high-fidelity intent classification, always prefer a specialized LoRA adapter via the Warm Registry over a general zero-shot prompt.
