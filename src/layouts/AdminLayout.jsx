import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
import { useTenant } from '../context/TenantContext';

export default function AdminLayout({ children }) {
    const { tenant, isModuleEnabled, loading: tenantLoading } = useTenant();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

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

    const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

    return (
        <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Mobile Header */}
            <header className="admin-mobile-header">
                <button className="admin-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className="admin-mobile-brand">
                    {tenant?.tenant_name || 'Operations OS'}
                </div>
                <div style={{ width: '40px' }}></div> {/* Spacer */}
            </header>

            <aside className={`admin-sidebar glass-panel ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        {tenant?.branding?.logo_url ? (
                            <img src={tenant.branding.logo_url} alt={tenant.tenant_name} style={{ height: '32px', width: 'auto', marginBottom: '0.5rem' }} />
                        ) : (
                            <img src="/logo-enterprise.png" alt="CogniVectra" style={{ height: '32px', width: 'auto', marginBottom: '0.5rem', filter: 'brightness(1.2)' }} />
                        )}
                        <div data-testid="tenant-name" style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white', textAlign: 'center' }}>
                            {tenant?.tenant_name || 'Operations OS'}
                        </div>
                    </motion.div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800', opacity: 0.6 }}>
                        Command Center
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                    {isModuleEnabled('CRM') && (
                        <>
                            <div className="nav-group-label" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', padding: '0 2.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '800', opacity: 0.4 }}>Operations</div>
                            <Link to="/admin" className={isActive('/admin')}>
                                <LuHouse /> Dashboard
                            </Link>
                            <Link to="/admin/clients" className={isActive('/admin/clients')}>
                                <LuUsers /> Relationships
                            </Link>
                            <Link to="/admin/projects" className={isActive('/admin/projects')}>
                                <LuListTodo /> Roadmap
                            </Link>
                        </>
                    )}

                    {isModuleEnabled('TALENT') && (
                        <>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.03)', margin: '1.5rem 1.75rem' }}></div>
                            <div className="nav-group-label" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', padding: '0 2.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '800', opacity: 0.4 }}>Resources</div>
                            <Link to="/admin/jobs" className={isActive('/admin/jobs')}>
                                <LuBriefcase /> Talent Pipeline
                            </Link>
                            <Link to="/admin/compensation" className={isActive('/admin/compensation')}>
                                <LuGem /> Compensation
                            </Link>
                            <Link to="/admin/offers" className={isActive('/admin/offers')}>
                                <LuMailOpen /> Offer Mesh
                            </Link>
                        </>
                    )}

                    {(isModuleEnabled('BLOG') || isModuleEnabled('AI_SEARCH')) && (
                        <>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.03)', margin: '1.5rem 1.75rem' }}></div>
                            <div className="nav-group-label" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', padding: '0 2.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '800', opacity: 0.4 }}>Intelligence</div>
                            {isModuleEnabled('BLOG') && (
                                <>
                                    <Link to="/admin/blog" className={isActive('/admin/blog')}>
                                        <LuPenTool /> Editorial
                                    </Link>
                                    <Link to="/admin/omni" className={isActive('/admin/omni')}>
                                        <LuRocket /> Omni-Channel
                                    </Link>
                                </>
                            )}
                            {isModuleEnabled('AI_SEARCH') && (
                                <Link to="/admin/reports" className={isActive('/admin/reports')}>
                                    <LuTrendingUp /> Telemetry
                                </Link>
                            )}
                        </>
                    )}
                </nav>

                <div className="sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={handleSignOut} className="sidebar-link" style={{ width: 'calc(100% - 2rem)', background: 'rgba(239, 68, 68, 0.05)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.1)', transition: 'all 0.3s ease' }}>
                        <LuLogOut /> Terminate Session
                    </button>
                </div>
            </aside>

            <main className="admin-main-content">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="admin-container"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}

