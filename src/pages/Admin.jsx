import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
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
    pending_payments: 0
  });
  const [recentInteractions, setRecentInteractions] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }

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

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-main-content">
          <p>Loading your Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <Link to="/admin" className="sidebar-link active">
          🏠 Dashboard
        </Link>
        <Link to="/admin/clients" className="sidebar-link">
          👥 Clients & CRM
        </Link>
        <Link to="/admin/projects" className="sidebar-link">
          🚀 Projects
        </Link>
        <Link to="/admin/jobs" className="sidebar-link">
          💼 Careers & Jobs
        </Link>
        <Link to="/admin/compensation" className="sidebar-link">
          💰 Compensation
        </Link>
        <Link to="/admin/offers" className="sidebar-link">
          📄 Offer Letters
        </Link>
        <Link to="/admin/blog" className="sidebar-link">
          ✍️ Blog Posts
        </Link>
        <Link to="/admin/reports" className="sidebar-link">
          📊 Reports
        </Link>
        <div style={{ marginTop: 'auto', padding: '1rem 0' }}>
          <button onClick={handleSignOut} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main-content">
        <div className="admin-header">
          <div className="admin-title-area">
            <h1>Command Center</h1>
            <p>Welcome back! Here's what's happening at CogniVectra.</p>
          </div>
          <div className="admin-actions">
            <Link to="/admin/blog/new" className="btn">+ New Post</Link>
            <Link to="/admin/jobs/new" className="btn-outline">+ New Job</Link>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon">👥</div>
              <span className="admin-stat-trend trend-up">↑ 12%</span>
            </div>
            <div className="admin-stat-number">{metrics.total_active_clients}</div>
            <div className="admin-stat-label">Active Clients</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon">🚀</div>
              <span className="admin-stat-trend trend-up">↑ 4%</span>
            </div>
            <div className="admin-stat-number">{metrics.total_active_projects}</div>
            <div className="admin-stat-label">Active Projects</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon">💰</div>
              <span className="admin-stat-trend trend-down">↓ 2%</span>
            </div>
            <div className="admin-stat-number">{formatCurrency(metrics.pending_payments)}</div>
            <div className="admin-stat-label">Pending Invoices</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon">👷</div>
            </div>
            <div className="admin-stat-number">{metrics.total_active_employees}</div>
            <div className="admin-stat-label">Total Staff</div>
          </div>
        </div>

        {/* DASHBOARD MODULES */}
        <div className="dashboard-grid">
          {/* CLIENTS MODULE */}
          <div className="module-card">
            <div className="module-icon">🏢</div>
            <div className="module-info">
              <h3>Client Relations</h3>
              <p>Manage {metrics.total_prospects} active prospects and track client health. View interactions and onboarding status.</p>
            </div>
            <div className="module-actions">
              <Link to="/admin/clients" className="btn-outline" style={{ fontSize: '0.8rem' }}>View CRM</Link>
              <Link to="/admin/clients/new" className="btn" style={{ fontSize: '0.8rem' }}>Add Client</Link>
            </div>
          </div>

          {/* PROJECTS MODULE */}
          <div className="module-card">
            <div className="module-icon">📑</div>
            <div className="module-info">
              <h3>Project Delivery</h3>
              <p>{metrics.projects_in_progress} projects currently in flight. Check health status, milestones and delivery timelines.</p>
            </div>
            <div className="module-actions">
              <Link to="/admin/projects" className="btn-outline" style={{ fontSize: '0.8rem' }}>Project Board</Link>
            </div>
          </div>

          {/* RECRUITMENT MODULE */}
          <div className="module-card">
            <div className="module-icon">👨‍💻</div>
            <div className="module-info">
              <h3>Hiring & Talent</h3>
              <p>Manage job openings, review applications, and generate professional offer letters with pre-set compensation.</p>
            </div>
            <div className="module-actions">
              <Link to="/admin/jobs" className="btn-outline" style={{ fontSize: '0.8rem' }}>Jobs</Link>
              <Link to="/admin/offers" className="btn-outline" style={{ fontSize: '0.8rem' }}>Offers</Link>
              <Link to="/admin/compensation" className="btn-outline" style={{ fontSize: '0.8rem' }}>Salary Table</Link>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="module-card" style={{ gridColumn: 'span 1' }}>
            <div className="module-info">
              <h3>Recent Activity</h3>
              <div style={{ marginTop: '1rem' }}>
                {recentInteractions.length > 0 ? (
                  recentInteractions.map(interaction => (
                    <div key={interaction.id} style={{
                      padding: '0.75rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.9rem', color: 'white' }}>{interaction.clients?.company_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{interaction.interaction_type} - {interaction.subject}</div>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(interaction.interaction_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem' }}>No recent interactions found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
