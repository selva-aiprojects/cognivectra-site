-- =============================================================================
-- Migration: ai_feature_flags
-- Purpose: Controls which AI routing features are active.
--          Allows safe, zero-downtime rollout of LoRA routing + LangGraph.
-- Usage:   Toggle ENABLE_LORA_ROUTING to true to activate the new AI pipeline.
-- =============================================================================

CREATE TABLE IF NOT EXISTS ai_feature_flags (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    flag_name   TEXT        UNIQUE NOT NULL,
    is_enabled  BOOLEAN     DEFAULT FALSE,
    description TEXT,
    rollout_pct INTEGER     DEFAULT 0 CHECK (rollout_pct BETWEEN 0 AND 100),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_by  TEXT        DEFAULT 'system'
);

-- Seed initial flags (safe defaults — new routing is OFF until explicitly enabled)
INSERT INTO ai_feature_flags (flag_name, is_enabled, rollout_pct, description)
VALUES
    (
        'ENABLE_LORA_ROUTING',
        false,
        0,
        'Routes AI queries through LoRA Intent Router + LangGraph Orchestrator. Set to true to activate. Set rollout_pct to control % of traffic (0-100).'
    ),
    (
        'ENABLE_QUERY_LOGGING',
        true,
        100,
        'Logs AI queries to ai_query_logs for observability and LoRA training data collection. Safe to enable at 100% from day one.'
    ),
    (
        'ENABLE_LANGSMITH_TRACING',
        false,
        0,
        'Sends traces to LangSmith for intent router and agent execution observability. Requires LANGSMITH_API_KEY in Supabase Vault.'
    )
ON CONFLICT (flag_name) DO NOTHING;

-- Trigger to auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_ai_feature_flags_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER ai_feature_flags_updated_at
    BEFORE UPDATE ON ai_feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_feature_flags_timestamp();

-- =============================================================================
-- Row Level Security
-- =============================================================================
ALTER TABLE ai_feature_flags ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read flags (flags are not sensitive)
CREATE POLICY "authenticated_can_read_flags"
    ON ai_feature_flags
    FOR SELECT
    TO authenticated
    USING (TRUE);

-- Only service role can modify flags (via admin or deployment pipeline)
CREATE POLICY "service_role_can_modify_flags"
    ON ai_feature_flags
    FOR ALL
    TO service_role
    USING (TRUE);
