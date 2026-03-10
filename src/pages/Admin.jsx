import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuHouse, LuUsers, LuListTodo, LuFileText, LuArrowUpRight, LuBriefcase, LuMailOpen, LuGem, LuCircleCheck, LuRocket, LuBuilding2, LuUserCheck, LuCode, LuChartBar, LuClock, LuRefreshCw } from 'react-icons/lu';
import { useTenant } from '../context/TenantContext';

export default function Admin() {
  const { isModuleEnabled, tenant } = useTenant();
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
        .maybeSingle();

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
        <>
        <div className="loading-container">
          <LuRefreshCw className="loading-spinner spin" />
          <p className="loading-text">Synchronizing dashboard...</p>
        </div>
        </>
    );
  }

  return (
    <>
      <header className="admin-header">
        <div className="admin-title-area">
          <h1>Command Center</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontWeight: '500', marginTop: '0.5rem' }}>Core Operations & Performance Intelligence.</p>
        </div>
        <div className="admin-actions" style={{ gap: '1.25rem' }}>
          <button className="btn" style={{ background: 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)', boxShadow: '0 4px 15px rgba(67, 56, 202, 0.4)' }}>
            <LuRocket style={{ marginRight: '0.75rem' }} /> Social Publisher
          </button>
          <button className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
            + Create Post
          </button>
          <button className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
            + New Job
          </button>
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
            <div className="admin-stat-icon" style={{ background: 'var(--admin-accent-soft)', color: 'var(--admin-accent)', border: '1px solid var(--admin-border)' }}><LuUsers /></div>
            <span className="admin-stat-trend trend-up">↑ 12%</span>
          </div>
          <div className="admin-stat-number">{metrics.total_active_clients}</div>
          <div className="admin-stat-label text-muted">Active Clients</div>
        </motion.div>

        <motion.div
          className="admin-stat-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #d1fae5' }}><LuRocket /></div>
            <span className="admin-stat-trend trend-up">↑ 4%</span>
          </div>
          <div className="admin-stat-number">{metrics.total_active_projects}</div>
          <div className="admin-stat-label text-muted">Active Projects</div>
        </motion.div>

        <motion.div
          className="admin-stat-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: '#fffef3', color: '#f59e0b', border: '1px solid #fef9c3' }}><LuChartBar /></div>
            <span className="admin-stat-trend trend-down">↓ 2%</span>
          </div>
          <div className="admin-stat-number">{formatCurrency(metrics.pending_payments)}</div>
          <div className="admin-stat-label text-muted">Pending Invoices</div>
        </motion.div>

        <motion.div
          className="admin-stat-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'var(--admin-accent-soft)', color: 'var(--admin-accent)', border: '1px solid var(--admin-border)' }}><LuChartBar /></div>
            <span className="admin-stat-trend trend-up">LIVE</span>
          </div>
          <div className="admin-stat-number">{metrics.web_visitors_24h}</div>
          <div className="admin-stat-label text-muted">Visitors (24h)</div>
        </motion.div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', border: '1px solid var(--admin-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem', fontWeight: '700' }}>Web Intelligence</h4>
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontWeight: '500' }}>Custom tracking for {window.location.hostname || 'cognivectra.com'}</p>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--admin-text-main)' }}>{metrics.page_views_24h}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Total Page Views (24h)</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--admin-text-main)' }}>{metrics.web_visitors_24h > 0 ? (metrics.page_views_24h / metrics.web_visitors_24h).toFixed(1) : '0.0'}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Views per Visitor</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD MODULES */}
      <div className="dashboard-grid">
        {/* CLIENTS MODULE */}
        {isModuleEnabled('CRM') && (
          <div className="module-card glass-panel">
            <div className="module-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
              <div className="module-icon-lg" style={{ background: 'var(--admin-accent-soft)', color: 'var(--admin-accent)' }}><LuBuilding2 /></div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--admin-text-main)' }}>Client Relations</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>CRM & Interactions</p>
              </div>
            </div>
            <div className="module-content">
              <div className="metric-row">
                <span style={{ color: 'var(--admin-text-muted)', fontWeight: '500' }}>Prospects</span>
                <strong style={{ color: 'var(--admin-text-main)' }}>{metrics.total_prospects}</strong>
              </div>
              <div className="metric-row">
                <span style={{ color: 'var(--admin-text-muted)', fontWeight: '500' }}>Onboarding</span>
                <strong style={{ color: 'var(--admin-text-main)' }}>2</strong>
              </div>
            </div>
            <div className="module-actions" style={{ marginTop: '1rem' }}>
              <Link to="/admin/clients" className="btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>Open CRM</Link>
            </div>
          </div>
        )}

        {/* PROJECTS MODULE */}
        {isModuleEnabled('CRM') && (
          <div className="module-card glass-panel">
            <div className="module-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
              <div className="module-icon-lg" style={{ background: 'var(--admin-accent-soft)', color: 'var(--admin-accent)' }}><LuListTodo /></div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--admin-text-main)' }}>Project Delivery</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>Milestones & Health</p>
              </div>
            </div>
            <div className="module-content">
              <div className="metric-row">
                <span style={{ color: 'var(--admin-text-muted)', fontWeight: '500' }}>In Flight</span>
                <strong style={{ color: 'var(--admin-text-main)' }}>{metrics.projects_in_progress}</strong>
              </div>
              <div className="metric-row">
                <span style={{ color: 'var(--admin-text-muted)', fontWeight: '500' }}>At Risk</span>
                <strong style={{ color: '#dc2626' }}>0</strong>
              </div>
            </div>
            <div className="module-actions" style={{ marginTop: '1rem' }}>
              <Link to="/admin/projects" className="btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem' }}>Project Board</Link>
            </div>
          </div>
        )}

        {/* RECRUITMENT MODULE */}
        {isModuleEnabled('TALENT') && (
          <div className="module-card glass-panel">
            <div className="module-header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
              <div className="module-icon-lg" style={{ background: 'var(--admin-accent-soft)', color: 'var(--admin-accent)' }}><LuBriefcase /></div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Hiring & Talent</h3>
                <p style={{ fontSize: '0.8rem' }}>Jobs & Offers</p>
              </div>
            </div>
            <div className="module-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
              <Link to="/admin/jobs" className="btn-outline" style={{ textAlign: 'center', fontSize: '0.9rem' }}>Jobs</Link>
              <Link to="/admin/offers" className="btn-outline" style={{ textAlign: 'center', fontSize: '0.9rem' }}>Offers</Link>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="/admin/compensation" style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', fontWeight: '700', textDecoration: 'underline' }}>View Compensation Table →</Link>
            </div>
          </div>
        )}

        {/* RECENT ACTIVITY */}
        <div className="module-card glass-panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LuClock /> Recent Activity
          </h3>
          <div className="activity-list" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {recentInteractions.length > 0 ? (
              recentInteractions.map(interaction => (
                <div key={interaction.id} style={{ padding: '1rem', borderRadius: '12px', background: 'var(--admin-bg)', border: '1px solid var(--admin-border)', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text-main)' }}>{interaction.clients?.company_name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontWeight: '600' }}>{new Date(interaction.interaction_date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>
                    {interaction.interaction_type} · {interaction.subject}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', textAlign: 'center', padding: '1rem', border: '1px dashed var(--admin-border)', borderRadius: '12px' }}>No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
