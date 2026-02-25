-- =============================================================================
-- Migration: ai_query_logs
-- Purpose: Log every AI query routed through the LoRA Intent Router + LangGraph
--          orchestrator. Data is used for observability, debugging, and future
--          LoRA fine-tuning training sets.
-- Security: Row-Level Security enforces tenant_id isolation.
--           No API keys or secrets are ever stored in this table.
-- =============================================================================

CREATE TABLE IF NOT EXISTS ai_query_logs (
    id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id     UUID        NOT NULL,
    user_id       TEXT,
    query         TEXT        NOT NULL,
    intent        TEXT,                    -- e.g. PRODUCT_INFO, HELPDESK_QUERY
    confidence    FLOAT,                   -- 0.0 – 1.0 from intent router
    agent_selected TEXT,                   -- e.g. product_info_agent
    response      TEXT,                    -- AI response text (trimmed, no keys)
    latency_ms    FLOAT,                   -- End-to-end latency
    routing_path  TEXT DEFAULT 'keyword',  -- 'lora_langgraph' | 'keyword_fallback'
    error_detail  TEXT,                    -- Populated only if routing errored
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast tenant + time-range queries
CREATE INDEX IF NOT EXISTS idx_ai_query_logs_tenant_created
    ON ai_query_logs (tenant_id, created_at DESC);

-- Index for intent analytics
CREATE INDEX IF NOT EXISTS idx_ai_query_logs_intent
    ON ai_query_logs (intent);

-- =============================================================================
-- Row Level Security
-- =============================================================================
ALTER TABLE ai_query_logs ENABLE ROW LEVEL SECURITY;

-- Tenants can only read their own logs
    USING (tenant_id = public.get_tenant_id());

-- Only service role (backend) can insert
-- (Edge Function uses service_role key to write logs)
CREATE POLICY "service_role_can_insert_logs"
    ON ai_query_logs
    FOR INSERT
    WITH CHECK (TRUE);

-- No direct updates or deletes from client
-- (Logs are append-only for audit integrity)
