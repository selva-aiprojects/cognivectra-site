# CogniVectra AI Routing Layer — Deployment Guide

Deploys two new Python microservices alongside the existing Supabase + React stack.
Existing features are **not affected** until `ENABLE_LORA_ROUTING=true` is set.

---

## Architecture

```
NeuralSearch (React) → ai-search (Supabase Edge Function)
                              │
              ENABLE_LORA_ROUTING=true?
              ├─ YES → Intent Router (port 8001)
              │             └─ LangGraph Orchestrator (port 8002)
              │                       └─ Agent → Response → Log
              └─ NO  → Original keyword matching (unchanged)
```

---

## Services

| Service | Port | File |
|---------|------|------|
| Intent Router | 8001 | `services/intent-router/` |
| LangGraph Orchestrator | 8002 | `services/langgraph-orchestrator/` |

---

## Phase 1: Setup Secrets (do this first)

### 1. Generate a MASTER_KEY
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```
→ Store this in your **platform secret manager** as `MASTER_KEY`. Never in git.

### 2. Encrypt each API key
```bash
MASTER_KEY=your-master-key python services/scripts/encrypt_secret.py sk-openai-your-real-key
# Output: ENCRYPTED:gAAAAABm...
```
Copy the `ENCRYPTED:...` output and set it as the value in your platform secrets.

---

## Phase 2: Deploy Services

### Option A — Railway / Render / Fly.io (Recommended)
1. Connect your repo and select the `services/intent-router/` directory
2. Set all encrypted secrets in the platform dashboard:
   - `MASTER_KEY` (plaintext in platform secrets)
   - `OPENAI_API_KEY` (ENCRYPTED: prefixed value)
3. Deploy — service auto-starts on port 8001
4. Repeat for `services/langgraph-orchestrator/` on port 8002

### Option B — Docker (Local / VPS)
```bash
# Copy .env.example → .env, fill in your ENCRYPTED values
cp services/intent-router/.env.example services/intent-router/.env
cp services/langgraph-orchestrator/.env.example services/langgraph-orchestrator/.env

# Build and start
docker-compose up --build
```

---

## Phase 3: Configure Supabase

### Run SQL Migrations
In **Supabase SQL Editor**, run in order:
```sql
-- 1. Query logging table
\i supabase/ai_query_logs_migration.sql

-- 2. Feature flags table
\i supabase/ai_feature_flags_migration.sql
```

### Set Supabase Vault Secrets
In **Supabase Dashboard → Settings → Edge Functions → Secrets**:

| Secret Name | Value |
|-------------|-------|
| `ENABLE_LORA_ROUTING` | `false` (start here) |
| `ENABLE_QUERY_LOGGING` | `true` |
| `INTENT_ROUTER_URL` | `https://your-intent-router.railway.app` |
| `ORCHESTRATOR_URL` | `https://your-orchestrator.railway.app` |

---

## Phase 4: Phased Rollout

| Phase | Action |
|-------|--------|
| 1 | Deploy services, keep `ENABLE_LORA_ROUTING=false` — only logging active |
| 2 | Set `ENABLE_LORA_ROUTING=true` for internal team testing |
| 3 | Monitor `ai_query_logs` table for accuracy and latency |
| 4 | Full production rollout with confidence |

---

## Health Checks
```bash
curl https://your-intent-router.railway.app/health
# → {"status":"ok","service":"intent-router","version":"1.0.0"}

curl https://your-orchestrator.railway.app/health
# → {"status":"ok","service":"langgraph-orchestrator","version":"1.0.0"}
```

## Test Intent Classification
```bash
curl -X POST https://your-intent-router.railway.app/intent-classify \
  -H "Content-Type: application/json" \
  -d '{"query":"What is MedFlow?","tenant_id":"demo","user_id":"test"}'
# → {"intent":"PRODUCT_INFO","confidence":0.92,"latency_ms":380}
```

---

## Key Security Rules

- ✅ All API keys encrypted with Fernet before storing in platform
- ✅ Supabase secrets stored in Vault (AES-256, never in Edge Function source)  
- ✅ `.env` files blocked in `.gitignore` — only `.env.example` (placeholders) committed
- ✅ Services run as non-root Docker user
- ✅ `ai_query_logs` never stores API keys — only query/response data
- ✅ Every Supabase query filters by `tenant_id` for isolation
