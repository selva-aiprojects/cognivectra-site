import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTenantConfig();
    }, []);

    const fetchTenantConfig = async () => {
        try {
            // 1. Detect subdomain (e.g. client1.cognivectra.com)
            const hostname = window.location.hostname;
            const subdomainParts = hostname.split('.');
            let subdomain = subdomainParts[0];

            // Handle production aliases: map cognivectra (vercel), www, and empty to 'admin'
            if (subdomain === 'localhost' || subdomain === '127' || subdomain === 'cognivectra' || subdomain === 'www' || subdomainParts.length === 1) {
                subdomain = 'admin';
            }

            // 2. Fetch tenant config from Supabase
            // Use maybeSingle() to prevent network level 406 errors on empty results
            const { data, error } = await supabase
                .from('tenants')
                .select('*')
                .eq('subdomain', subdomain)
                .maybeSingle();

            let globalTenant = null;
            if (error || !data) {
                // Fallback to Global Tenant if not found
                const { data: gt } = await supabase
                    .from('tenants')
                    .select('*')
                    .eq('id', '00000000-0000-0000-0000-000000000000')
                    .maybeSingle();
                globalTenant = gt;
            }

            // Failsafe Default Tenant for local dev or missing DB
            const failsafeTenant = {
                id: '00000000-0000-0000-0000-000000000000',
                tenant_name: 'CogniVectra Global',
                subdomain: 'admin',
                branding: {
                    primary_color: '#8b5cf6',
                    secondary_color: '#3b82f6',
                    font_family: 'Inter',
                    logo_url: null
                },
                enabled_modules: ['CRM', 'TALENT', 'AI_SEARCH', 'BLOG']
            };

            const finalTenant = data || globalTenant || failsafeTenant;
            setTenant(finalTenant);
            applyBranding(finalTenant.branding);
        } catch (err) {
            console.error('Failed to load tenant context:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyBranding = (branding) => {
        if (!branding) return;
        const root = document.documentElement;
        if (branding.primary_color) root.style.setProperty('--accent-primary', branding.primary_color);
        if (branding.secondary_color) root.style.setProperty('--accent-secondary', branding.secondary_color);
        if (branding.font_family) root.style.setProperty('--font-main', branding.font_family);
    };

    const isModuleEnabled = (moduleName) => {
        return tenant?.enabled_modules?.includes(moduleName) || false;
    };

    return (
        <TenantContext.Provider value={{ tenant, loading, isModuleEnabled, refreshTenant: fetchTenantConfig }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};
