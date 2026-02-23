import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBuilding, FaUserCheck, FaCode, FaChartBar, FaRocket, FaBriefcase, FaUsers, FaTasks, FaClock } from 'react-icons/fa';
import AdminLayout from '../layouts/AdminLayout';

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_active_clients: 0,
    total_prospects: 0,
    total_active_projects: 0,
    projects_in_progress: 0,
    total_active_employees: 0,
    total_revenue: 0,
    total_outstanding: 0,
    overdue_invoices: 0,
    pending_payments: 0,
    web_visitors_24h: 0,
    page_views_24h: 0
  });
  const [recentInteractions, setRecentInteractions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch business metrics from the view we created
      const { data: metricsData, error: metricsError } = await supabase
        .from('business_metrics')
        .select('*')
        .single();

      if (metricsError) throw metricsError;
      if (metricsData) setMetrics(metricsData);

      // Fetch recent interactions
      const { data: interactionsData, error: interactionsError } = await supabase
        .from('client_interactions')
        .select('*, clients(company_name)')
        .order('interaction_date', { ascending: false })
        .limit(5);

      if (interactionsError) throw interactionsError;
      setRecentInteractions(interactionsData || []);

      // Fetch Web Analytics for last 24h
      const { count: viewCount } = await supabase
        .from('web_analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 86400000).toISOString());

      const { data: uniqueVisitors } = await supabase
        .from('web_analytics')
        .select('session_id')
        .gte('created_at', new Date(Date.now() - 86400000).toISOString());

      const uniqueCount = new Set(uniqueVisitors?.map(v => v.session_id)).size;

      setMetrics(prev => ({
        ...prev,
        web_visitors_24h: uniqueCount,
        page_views_24h: viewCount || 0
      }));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loader"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <header className="admin-header glass-panel" style={{ padding: '1.5rem 2.5rem', borderRadius: '16px', marginBottom: '2.5rem' }}>
        <div className="admin-title-area">
          <h1 style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>Command Center</h1>
          <p style={{ opacity: 0.7 }}>Business performance & Operational insights at a glance.</p>
        </div>
        <div className="admin-actions" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/omni" className="btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', background: 'var(--accent-primary)' }}>🚀 Social Publisher</Link>
          <Link to="/admin/blog?new=1" className="btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>+ Create Post</Link>
          <Link to="/admin/jobs?new=1" className="btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>+ New Job</Link>
        </div>
      </header>

      {/* METRICS GRID */}
      <div className="admin-stats-grid">
        <motion.div
          className="admin-stat-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}><FaUsers /></div>
            <span className="admin-stat-trend trend-up">↑ 12%</span>
          </div>
          <div className="admin-stat-number">{metrics.total_active_clients}</div>
          <div className="admin-stat-label">Active Clients</div>
        </motion.div>

        <motion.div
          className="admin-stat-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}><FaRocket /></div>
            <span className="admin-stat-trend trend-up">↑ 4%</span>
          </div>
          <div className="admin-stat-number">{metrics.total_active_projects}</div>
          <div className="admin-stat-label">Active Projects</div>
        </motion.div>

        <motion.div
          className="admin-stat-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}><FaChartBar /></div>
            <span className="admin-stat-trend trend-down">↓ 2%</span>
          </div>
          <div className="admin-stat-number">{formatCurrency(metrics.pending_payments)}</div>
          <div className="admin-stat-label">Pending Invoices</div>
        </motion.div>

        <motion.div
          className="admin-stat-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}><FaChartBar /></div>
            <span className="admin-stat-trend trend-up">LIVE</span>
          </div>
          <div className="admin-stat-number">{metrics.web_visitors_24h}</div>
          <div className="admin-stat-label">Visitors (24h)</div>
        </motion.div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Web Intelligence</h4>
              <p style={{ opacity: 0.6, fontSize: '0.75rem' }}>Custom tracking for {location.hostname || 'cognivectra.com'}</p>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{metrics.page_views_24h}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>Total Page Views (24h)</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{metrics.web_visitors_24h > 0 ? (metrics.page_views_24h / metrics.web_visitors_24h).toFixed(1) : '0.0'}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>Views per Visitor</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD MODULES */}
      <div className="dashboard-grid">
        {/* CLIENTS MODULE */}
        <div className="module-card glass-panel">
          <div className="module-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
            <div className="module-icon-lg" style={{ background: 'rgba(255,255,255,0.03)' }}><FaBuilding /></div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Client Relations</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>CRM & Interactions</p>
            </div>
          </div>
          <div className="module-content">
            <div className="metric-row">
              <span style={{ color: 'var(--text-secondary)' }}>Prospects</span>
              <strong style={{ color: '#fff' }}>{metrics.total_prospects}</strong>
            </div>
            <div className="metric-row">
              <span style={{ color: 'var(--text-secondary)' }}>Onboarding</span>
              <strong style={{ color: '#fff' }}>2</strong>
            </div>
          </div>
          <div className="module-actions" style={{ marginTop: '1rem' }}>
            <Link to="/admin/clients" className="btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>Open CRM</Link>
          </div>
        </div>

        {/* PROJECTS MODULE */}
        <div className="module-card glass-panel">
          <div className="module-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
            <div className="module-icon-lg" style={{ background: 'rgba(255,255,255,0.03)' }}><FaTasks /></div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Project Delivery</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Milestones & Health</p>
            </div>
          </div>
          <div className="module-content">
            <div className="metric-row">
              <span style={{ color: 'var(--text-secondary)' }}>In Flight</span>
              <strong style={{ color: '#fff' }}>{metrics.projects_in_progress}</strong>
            </div>
            <div className="metric-row">
              <span style={{ color: 'var(--text-secondary)' }}>At Risk</span>
              <strong style={{ color: '#f87171' }}>0</strong>
            </div>
          </div>
          <div className="module-actions" style={{ marginTop: '1rem' }}>
            <Link to="/admin/projects" className="btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>Project Board</Link>
          </div>
        </div>

        {/* RECRUITMENT MODULE */}
        <div className="module-card glass-panel">
          <div className="module-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
            <div className="module-icon-lg" style={{ background: 'rgba(255,255,255,0.03)' }}><FaBriefcase /></div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'white' }}>Hiring & Talent</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Jobs & Offers</p>
            </div>
          </div>
          <div className="module-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/admin/jobs" className="btn-outline" style={{ textAlign: 'center', fontSize: '0.9rem' }}>Jobs</Link>
            <Link to="/admin/offers" className="btn-outline" style={{ textAlign: 'center', fontSize: '0.9rem' }}>Offers</Link>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/admin/compensation" style={{ fontSize: '0.8rem', color: 'var(--accent-light)', hover: { textDecoration: 'underline' } }}>View Compensation Table →</Link>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="module-card glass-panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaClock /> Recent Activity
          </h3>
          <div className="activity-list" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {recentInteractions.length > 0 ? (
              recentInteractions.map(interaction => (
                <div key={interaction.id} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'white' }}>{interaction.clients?.company_name}</strong>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{new Date(interaction.interaction_date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {interaction.interaction_type} · {interaction.subject}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
