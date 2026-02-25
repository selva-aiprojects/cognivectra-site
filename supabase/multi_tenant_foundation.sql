-- Modular Multi-Tenant Foundation for CogniVectra Operations OS

-- =============================================
-- 1. TENANTS REGISTRY
-- =============================================
CREATE TABLE IF NOT EXISTS public.tenants (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_name TEXT        NOT NULL,
    subdomain   TEXT        UNIQUE, -- e.g. client1.cognivectra.com
    status      TEXT        DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'maintenance')),
    
    -- Branding Config (CSS variables equivalent)
    branding    JSONB       DEFAULT '{
        "primary_color": "#8b5cf6",
        "secondary_color": "#3b82f6",
        "font_family": "Inter",
        "logo_url": null
    }'::JSONB,
    
    -- Module Subscription Flags
    enabled_modules TEXT[] DEFAULT '{"CRM", "AI_SEARCH", "BLOG"}'::TEXT[]
);

-- =============================================
-- 2. REINFORCE TENANT_ID ACROSS ALL TABLES
-- =============================================

-- Add tenant_id to core tables if missing
DO $$ 
DECLARE
    r RECORD;
BEGIN 
    -- Posts
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='tenant_id') THEN
        ALTER TABLE public.posts ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Clients
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='tenant_id') THEN
        ALTER TABLE public.clients ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Projects
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='tenant_id') THEN
        ALTER TABLE public.projects ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Project Tasks
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='project_tasks' AND column_name='tenant_id') THEN
        ALTER TABLE public.project_tasks ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Client Interactions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='client_interactions' AND column_name='tenant_id') THEN
        ALTER TABLE public.client_interactions ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Invoices
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='tenant_id') THEN
        ALTER TABLE public.invoices ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Employees
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='tenant_id') THEN
        ALTER TABLE public.employees ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Offer Letters
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='offer_letters' AND column_name='tenant_id') THEN
        ALTER TABLE public.offer_letters ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Job Postings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_postings' AND column_name='tenant_id') THEN
        ALTER TABLE public.job_postings ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- Job Applications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applications' AND column_name='tenant_id') THEN
        ALTER TABLE public.job_applications ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
    END IF;

    -- FIX TYPE MISMATCHES (e.g. if ai_query_logs was previously created as TEXT)
    -- We convert TEXT to UUID safely for any table having a tenant_id column.
    FOR r IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'tenant_id' 
          AND table_schema = 'public' 
          AND data_type = 'text'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ALTER COLUMN tenant_id TYPE UUID USING tenant_id::uuid', r.table_name);
    END LOOP;
END $$;

-- =============================================
-- 3. GLOBAL RLS FUNCTION
-- =============================================
-- This function sets the context for the current tenant during a request.
-- In production, the Edge Function or Auth Hook sets 'app.tenant_id'.

CREATE OR REPLACE FUNCTION public.get_tenant_id() 
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.tenant_id', TRUE), '')::UUID;
$$ LANGUAGE sql STABLE;

-- =============================================
-- 4. APPLY UNIFIED RLS POLICIES
-- =============================================

-- Apply to ALL tables (Standardized Policy)
-- Note: We drop existing policies first to centralize control.

DO $$ 
DECLARE 
    t TEXT;
BEGIN 
    FOR t IN SELECT table_name FROM information_schema.columns WHERE column_name = 'tenant_id' AND table_schema = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "tenant_isolation" ON public.%I', t);
        EXECUTE format('CREATE POLICY "tenant_isolation" ON public.%I FOR ALL USING (tenant_id = public.get_tenant_id())', t);
    END LOOP;
END $$;

-- =============================================
-- 5. SEED INITIAL TENANT (CogniVectra Main)
-- =============================================
INSERT INTO public.tenants (id, tenant_name, subdomain)
VALUES ('00000000-0000-0000-0000-000000000000', 'CogniVectra Global', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Assign all existing data to the global tenant
UPDATE public.posts SET tenant_id = '00000000-0000-0000-0000-000000000000' WHERE tenant_id IS NULL;
UPDATE public.clients SET tenant_id = '00000000-0000-0000-0000-000000000000' WHERE tenant_id IS NULL;
UPDATE public.projects SET tenant_id = '00000000-0000-0000-0000-000000000000' WHERE tenant_id IS NULL;
UPDATE public.employees SET tenant_id = '00000000-0000-0000-0000-000000000000' WHERE tenant_id IS NULL;
UPDATE public.job_postings SET tenant_id = '00000000-0000-0000-0000-000000000000' WHERE tenant_id IS NULL;
UPDATE public.ai_query_logs SET tenant_id = '00000000-0000-0000-0000-000000000000' WHERE tenant_id IS NULL;
