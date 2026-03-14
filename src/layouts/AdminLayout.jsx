import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LuHouse,
    LuUsers,
    LuListTodo,
    LuBriefcase,
    LuGem,
    LuMailOpen,
    LuPenTool,
    LuRocket,
    LuTrendingUp,
    LuLogOut,
    LuGlobe
} from 'react-icons/lu';
import { FaGlobe } from 'react-icons/fa';
import { useTenant } from '../context/TenantContext';
import '../admin.css';

export default function AdminLayout({ children }) {
    const { tenant, isModuleEnabled, loading: tenantLoading } = useTenant();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [location.pathname]);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/login');
            return;
        }

        // Module Protection: Redirect if trying to access a disabled module
        const path = location.pathname;
        if (path.startsWith('/admin/clients') || path.startsWith('/admin/projects')) {
            if (!isModuleEnabled('CRM')) navigate('/admin');
        } else if (path.startsWith('/admin/jobs') || path.startsWith('/admin/compensation') || path.startsWith('/admin/offers')) {
            if (!isModuleEnabled('TALENT')) navigate('/admin');
        } else if (path.startsWith('/admin/blog') || path.startsWith('/admin/omni')) {
            if (!isModuleEnabled('BLOG')) navigate('/admin');
        } else if (path.startsWith('/admin/reports')) {
            if (!isModuleEnabled('AI_SEARCH')) navigate('/admin');
        }

        setLoading(false);
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <div className="admin-main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    const isActive = (path) => location.pathname === path ? 'topbar-link active' : 'topbar-link';

    return (
        <div className={`admin-portal-layout admin-theme ${sidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Top Navigation Bar */}
            <header className="admin-topbar">
                <div className="topbar-brand">
                    <button className={`admin-hamburger ${sidebarOpen ? 'is-active' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    {tenant?.branding?.logo_url ? (
                        <img src={tenant.branding.logo_url} alt={tenant.tenant_name} className="topbar-logo-img" />
                    ) : (
                        <img src="/logo-enterprise.png" alt="CogniVectra" className="topbar-logo-img" />
                    )}
                    {tenant?.branding?.logo_url && (
                        <div className="topbar-brand-text">
                            <div data-testid="tenant-name" className="topbar-tenant-name">
                                {tenant.tenant_name}
                            </div>
                        </div>
                    )}
                </div>

                <nav className={`topbar-nav ${sidebarOpen ? 'open' : ''}`}>
                    {isModuleEnabled('CRM') && (
                        <>
                            <Link to="/admin" className={isActive('/admin')}>
                                <LuHouse /> Dashboard
                            </Link>
                            <Link to="/admin/clients" className={isActive('/admin/clients')}>
                                <LuUsers /> CRM
                            </Link>
                            <Link to="/admin/projects" className={isActive('/admin/projects')}>
                                <LuListTodo /> Roadmap
                            </Link>
                        </>
                    )}

                    {isModuleEnabled('TALENT') && (
                        <>
                            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }}></div>
                            <Link to="/admin/jobs" className={isActive('/admin/jobs')}>
                                <LuBriefcase /> Jobs
                            </Link>
                            <Link to="/admin/compensation" className={isActive('/admin/compensation')}>
                                <LuGem /> Comp
                            </Link>
                            <Link to="/admin/offers" className={isActive('/admin/offers')}>
                                <LuMailOpen /> Offers
                            </Link>
                        </>
                    )}

                    {(isModuleEnabled('BLOG') || isModuleEnabled('AI_SEARCH')) && (
                        <>
                            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }}></div>
                            {isModuleEnabled('BLOG') && (
                                <>
                                    <Link to="/admin/blog" className={isActive('/admin/blog')}>
                                        <LuPenTool /> Blog
                                    </Link>
                                    <Link to="/admin/omni" className={isActive('/admin/omni')}>
                                        <LuRocket /> Omni
                                    </Link>
                                </>
                            )}
                            {isModuleEnabled('AI_SEARCH') && (
                                <Link to="/admin/reports" className={isActive('/admin/reports')}>
                                    <LuTrendingUp /> Reports
                                </Link>
                            )}
                        </>
                    )}
                </nav>

                <div className="topbar-actions">
                    <button onClick={handleSignOut} className="topbar-logout">
                        <LuLogOut /> Logout
                    </button>
                </div>
            </header>

            <main className="admin-main-content">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="admin-container"
                >
                    {children || <Outlet />}
                </motion.div>
            </main>
        </div>
    );
}

