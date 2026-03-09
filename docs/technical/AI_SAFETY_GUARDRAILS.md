# 🛡️ AI Implementation: Safety Guardrails

This document outlines the security and efficiency layers implemented to protect the CogniVectra AI infrastructure from abuse and non-productive resource consumption.

---

## 🏗️ Guardrail Architecture

Every query entering the platform through the `ai-search` Edge Function passes through a sequential safety pipeline before reaching the **Intent Router** or **Orchestrator**.

### Layer 1: Token Optimization (Truncation)
- **Action**: Input queries are hard-capped at **500 characters**.
- **Reasoning**: Prevents "token bomb" attacks where massive payloads are used to inflate infrastructure costs or crash inference models.

### Layer 2: Prompt Injection Defense (Heuristic)
- **Action**: Regex-based scanning for common malicious patterns.
- **Patterns**:
    - `ignore previous instructions`
    - `system reveal`
    - `disregard all prior`
    - `you are now a [role]`
- **Bailout**: Requests matching these patterns are terminated with a `guarded_rejection` status.

### Layer 3: Toxicity Filtering (Neural Moderation)
- **Action**: Pre-flight check via OpenAI's Moderation API.
- **Scope**: Detects and blocks content categorized under:
    - Hate speech
    - Harassment
    - Self-harm
    - Sexual content
    - Violence
- **Bailout**: Flagged content results in a `moderated_rejection` response.

---

## 🛠️ Developer Reference

- **Implementation**: [ai-search/index.ts](file:///d:/Training/working/cognivectra-site/supabase/functions/ai-search/index.ts)
- **Failure Handling**: Guardrail failures (e.g., Moderation API timeout) are logged but allow the query to proceed to the Intent Router to ensure high availability, unless explicitly flagged as toxic.

---

## 📋 Best Practices
1. **Low Latency**: Heuristic checks (Layer 1 & 2) must remain near-zero latency.
2. **Privacy First**: Moderation checks only send the query text; no tenant or user identifiers are forwarded to external safety APIs.
3. **Audit Trail**: All rejections are logged in the `ai_query_logs` table with their respective routing status for security audit.
