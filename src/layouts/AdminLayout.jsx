import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
                <div className="sidebar-brand" style={{ padding: '2.5rem 1.5rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        CogniVectra
                    </h2>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                        Admin Console
                    </div>
                </div>

                <nav className="sidebar-nav" style={{ flex: 1, padding: '0 1rem', overflowY: 'auto' }}>
                    <div className="nav-group-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', padding: '0 1.25rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', opacity: 0.5 }}>Business</div>
                    <Link to="/admin" className={isActive('/admin')}>
                        <FaHome /> Dashboard
                    </Link>
                    <Link to="/admin/clients" className={isActive('/admin/clients')}>
                        <FaUsers /> CRM
                    </Link>
                    <Link to="/admin/projects" className={isActive('/admin/projects')}>
                        <FaTasks /> Projects
                    </Link>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1.5rem 1.25rem' }}></div>
                    <div className="nav-group-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', padding: '0 1.25rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', opacity: 0.5 }}>Talent</div>
                    <Link to="/admin/jobs" className={isActive('/admin/jobs')}>
                        <FaBriefcase /> Careers
                    </Link>
                    <Link to="/admin/compensation" className={isActive('/admin/compensation')}>
                        <FaGem /> Salary
                    </Link>
                    <Link to="/admin/offers" className={isActive('/admin/offers')}>
                        <FaEnvelopeOpenText /> Offers
                    </Link>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '1.5rem 1.25rem' }}></div>
                    <div className="nav-group-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', padding: '0 1.25rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', opacity: 0.5 }}>Insights</div>
                    <Link to="/admin/blog" className={isActive('/admin/blog')}>
                        <FaPenNib /> Editorial
                    </Link>
                    <Link to="/admin/omni" className={isActive('/admin/omni')}>
                        <FaRocket /> Omni-Channel
                    </Link>
                    <Link to="/admin/reports" className={isActive('/admin/reports')}>
                        <FaChartLine /> Reports
                    </Link>
                </nav>

                <div className="sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={handleSignOut} className="sidebar-link" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.05)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </aside>

            <main className="admin-main-content">
                <div className="admin-container">
                    {children}
                </div>
            </main>
        </div>
    );
}
