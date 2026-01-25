import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaHome,
    FaUsers,
    FaTasks,
    FaBriefcase,
    FaGem,
    FaEnvelopeOpenText,
    FaPenNib,
    FaRocket,
    FaChartLine,
    FaSignOutAlt
} from 'react-icons/fa';
import logo from '../assets/Logo-new.png';

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/login');
            return;
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
        <div className="admin-layout">
            <aside className="admin-sidebar glass-panel">
                <div className="sidebar-brand">
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={logo}
                        alt="CogniVectra"
                        style={{ height: '32px', marginBottom: '0.5rem' }}
                    />
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800', opacity: 0.6 }}>
                        Command Center
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                    <div className="nav-group-label" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', padding: '0 2.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '800', opacity: 0.4 }}>Operations</div>
                    <Link to="/admin" className={isActive('/admin')}>
                        <FaHome /> Dashboard
                    </Link>
                    <Link to="/admin/clients" className={isActive('/admin/clients')}>
                        <FaUsers /> Relationships
                    </Link>
                    <Link to="/admin/projects" className={isActive('/admin/projects')}>
                        <FaTasks /> Roadmap
                    </Link>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.03)', margin: '1.5rem 1.75rem' }}></div>
                    <div className="nav-group-label" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', padding: '0 2.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '800', opacity: 0.4 }}>Resources</div>
                    <Link to="/admin/jobs" className={isActive('/admin/jobs')}>
                        <FaBriefcase /> Talent Pipeline
                    </Link>
                    <Link to="/admin/compensation" className={isActive('/admin/compensation')}>
                        <FaGem /> Compensation
                    </Link>
                    <Link to="/admin/offers" className={isActive('/admin/offers')}>
                        <FaEnvelopeOpenText /> Offer Mesh
                    </Link>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.03)', margin: '1.5rem 1.75rem' }}></div>
                    <div className="nav-group-label" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', padding: '0 2.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '800', opacity: 0.4 }}>Intelligence</div>
                    <Link to="/admin/blog" className={isActive('/admin/blog')}>
                        <FaPenNib /> Editorial
                    </Link>
                    <Link to="/admin/omni" className={isActive('/admin/omni')}>
                        <FaRocket /> Omni-Channel
                    </Link>
                    <Link to="/admin/reports" className={isActive('/admin/reports')}>
                        <FaChartLine /> Telemetry
                    </Link>
                </nav>

                <div className="sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={handleSignOut} className="sidebar-link" style={{ width: 'calc(100% - 2rem)', background: 'rgba(239, 68, 68, 0.05)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <FaSignOutAlt /> Terminate Session
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

