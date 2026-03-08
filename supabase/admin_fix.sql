-- Phase 3: Admin & Tenant Security Patch
-- Run this in your Supabase SQL Editor to resolve access conflicts and enable superadmin bypass.

-- 1. Ensure the Global Tenant has correct aliases
UPDATE public.tenants
SET subdomain = 'admin',
    tenant_name = 'CogniVectra Global'
WHERE id = '00000000-0000-0000-0000-000000000000';

-- 2. Enhanced get_tenant_id function with Superadmin Bypass
-- Detects superadmin via JWT metadata 'is_superadmin' or if it's the system user
CREATE OR REPLACE FUNCTION public.get_tenant_id() 
RETURNS UUID AS $$
DECLARE
    _tenant_id UUID;
    _raw_metadata JSONB;
BEGIN
    -- 1. Check if we're in a bypass role (service_role)
    IF (auth.role() = 'service_role') THEN
        RETURN '00000000-0000-0000-0000-000000000000'; -- Default to Global
    END IF;

    -- 2. Check for superadmin metadata in JWT
    _raw_metadata := auth.jwt() -> 'user_metadata';
    IF (_raw_metadata ? 'is_superadmin' AND (_raw_metadata ->> 'is_superadmin')::BOOLEAN = TRUE) THEN
        -- Superadmins see GLOBAL data by default, but policies should be updated to use this
        RETURN NULL; -- Special signal for 'ALL' access
    END IF;

    -- 3. Standard tenant resolution
    _tenant_id := NULLIF(current_setting('app.tenant_id', TRUE), '')::UUID;
    RETURN COALESCE(_tenant_id, '00000000-0000-0000-0000-000000000000');
END;
$$ LANGUAGE plpgsql STABLE;

-- 3. Update Unified RLS Policies to handle Superadmin (NULL return)
DO $$ 
DECLARE 
    t TEXT;
BEGIN 
    FOR t IN SELECT table_name FROM information_schema.columns WHERE column_name = 'tenant_id' AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "tenant_isolation" ON public.%I', t);
        -- Policy: Access if tenant matches OR if public.get_tenant_id() returns NULL (Superadmin Bypass)
        EXECUTE format('CREATE POLICY "tenant_isolation" ON public.%I FOR ALL USING (
            public.get_tenant_id() IS NULL OR tenant_id = public.get_tenant_id()
        )', t);
    END LOOP;
END $$;

-- 4. Enable RLS on tenants table itself if not already
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_tenants" ON public.tenants;
CREATE POLICY "public_read_tenants" ON public.tenants FOR SELECT USING (true);
