-- Fix: Enable all modules for the Global Tenant
-- This ensures HR (TALENT), CRM, Blog, and AI Search are all visible in the sidebar

UPDATE public.tenants
SET enabled_modules = ARRAY['CRM', 'TALENT', 'AI_SEARCH', 'BLOG']
WHERE id = '00000000-0000-0000-0000-000000000000';

-- Verify
SELECT id, tenant_name, enabled_modules FROM public.tenants;
