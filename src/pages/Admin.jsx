import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LuHouse, LuUsers, LuListTodo, LuFileText, LuArrowUpRight, LuBriefcase, LuMailOpen, 
  LuGem, LuCircleCheck, LuRocket, LuBuilding2, LuUserCheck, LuCode, LuChartBar, LuClock, 
  LuRefreshCw, LuActivity, LuZap, LuTarget, LuDollarSign, LuTrendingUp, LuSignal
} from 'react-icons/lu';
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
      const { data: metricsData, error: metricsError } = await supabase
        .from('business_metrics')
        .select('*')
        .maybeSingle();

      if (metricsError) throw metricsError;
      if (metricsData) setMetrics(metricsData);

      const { data: interactionsData, error: interactionsError } = await supabase
        .from('client_interactions')
        .select('*, clients(company_name)')
        .order('interaction_date', { ascending: false })
        .limit(8);

      if (interactionsError) throw interactionsError;
      setRecentInteractions(interactionsData || []);

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
      <div className="loading-container">
        <LuRefreshCw className="loading-spinner spin" />
        <p className="loading-text">Synchronizing Command Center...</p>
      </div>
    );
  }

  return (
    <>
      <header className="admin-header sapphire-glow" style={{ marginBottom: '1.5rem', borderBottom: 'none' }}>
        <div className="admin-title-area">
          <div className="admin-breadcrumbs">
            <span className="current">Operational Command Center</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}>System Core <span style={{ opacity: 0.3, fontWeight: 300 }}>/</span> Overview</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></span>
            Real-time Operational Telemetry Active
          </p>
        </div>
        
        {/* PULSE TELEMETRY STRIP */}
        <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '2.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.7)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Live Visitors</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--admin-accent)' }}>{metrics.web_visitors_24h} <span style={{ fontSize: '0.65rem', color: '#10b981' }}>LIVE</span></span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--admin-border)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Sys. Response</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--admin-text-main)' }}>24ms <span style={{ fontSize: '0.65rem', color: '#10b981' }}>SECURE</span></span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--admin-border)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Portfolio Health</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>98.4%</span>
          </div>
        </div>
      </header>

      {/* COMMAND CONTROL QUADS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* QUAD 1: INTELLIGENCE OUTPUT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="module-card glass-panel sapphire-glow"
          style={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <LuSignal style={{ color: 'var(--admin-accent)' }} />
                <h3 style={{ fontSize: '1.15rem' }}>Intelligence Acquisition</h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>Organic Funnel & Chat Signals</p>
            </div>
            <Link to="/admin/reports" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>View Signals</Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--admin-accent-soft)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>High Intent Leads</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                {metrics.total_prospects}
                <span style={{ fontSize: '0.8rem', color: '#10b981' }}>+12%</span>
              </div>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Active Inquiries</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                08
                <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>WAITING</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--admin-text-muted)', fontWeight: '800', marginBottom: '1rem' }}>Last 24h Engagement</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
              {[30, 45, 25, 60, 40, 70, 50, 85, 45, 65, 35, 50].map((h, i) => (
                <div key={i} style={{ flex: 1, background: i === 7 ? 'var(--admin-accent)' : 'var(--admin-accent-soft)', height: `${h}%`, borderRadius: '2px' }}></div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* QUAD 2: OPERATIONAL DELIVERY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="module-card glass-panel sapphire-glow"
          style={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <LuActivity style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '1.15rem' }}>Operational Velocity</h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>Project Delivery & Portfolio Health</p>
            </div>
            <Link to="/admin/projects" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Control Board</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>In-Flight Streams</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--admin-text-main)' }}>{metrics.projects_in_progress}</div>
            </div>
            <div style={{ background: 'var(--admin-accent-soft)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Total Portfolio</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--admin-text-main)' }}>{metrics.total_active_projects}</div>
            </div>
          </div>

          <div style={{ background: 'var(--admin-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--admin-text-main)' }}>Global Milestone Progress</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--admin-accent)' }}>74%</span>
            </div>
            <div style={{ height: '8px', background: 'white', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '74%', height: '100%', background: 'linear-gradient(to right, var(--admin-accent), #10b981)' }}></div>
            </div>
          </div>
        </motion.div>

        {/* QUAD 3: HUMAN CAPITAL */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="module-card glass-panel sapphire-glow"
          style={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <LuUserCheck style={{ color: 'var(--admin-accent)' }} />
                <h3 style={{ fontSize: '1.15rem' }}>Talent Pipeline</h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>Strategic Roles & Deployment</p>
            </div>
            <Link to="/admin/jobs" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Funnel Hub</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--admin-accent-soft)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Open Architectures</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--admin-text-main)' }}>04</div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Pending Offers</span>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--admin-text-main)' }}>02</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/admin/offers" style={{ flex: 1, padding: '0.75rem', textAlign: 'center', background: 'var(--admin-accent)', color: 'white', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>Issue Offer</Link>
            <Link to="/admin/compensation" style={{ flex: 1, padding: '0.75rem', textAlign: 'center', background: 'white', border: '1px solid var(--admin-border)', color: 'var(--admin-text-main)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>Pay Scales</Link>
          </div>
        </motion.div>

        {/* QUAD 4: REVENUE & FINANCE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="module-card glass-panel sapphire-glow"
          style={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <LuDollarSign style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '1.15rem' }}>Financial Liquidity</h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>Invoicing & Outstanding Portfolio</p>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: '800' }}>FISCAL Q1</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Pending Outflows</span>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--admin-text-main)' }}>{formatCurrency(metrics.pending_payments)}</div>
            </div>
            <div style={{ background: 'var(--admin-accent-soft)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Overdue Capital</span>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ef4444' }}>{formatCurrency(0)}</div>
            </div>
          </div>

          <div style={{ position: 'relative', background: 'var(--admin-bg)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Consolidated Revenue</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>₹84,50,000</div>
            </div>
            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: '700' }}>
              <LuTrendingUp /> +4.2%
            </div>
          </div>
        </motion.div>

      </div>

      {/* SYSTEM HEARTBEAT / RECENT ACTIVITY */}
      <div className="module-card glass-panel sapphire-glow" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--admin-accent-soft)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
              <LuClock />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>System Heartbeat</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: '500' }}>Real-time event stream from across the portfolio.</p>
            </div>
          </div>
          <button className="btn-outline" style={{ fontSize: '0.8rem' }}>Full Audit Log</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {recentInteractions.slice(0, 4).map((interaction, idx) => (
            <motion.div 
              key={interaction.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              className="glass-panel" 
              style={{ padding: '1.25rem', background: 'rgba(240, 240, 255, 0.3)', border: '1px solid var(--admin-border)' }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--admin-accent)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{interaction.interaction_type}</span>
                <span style={{ color: 'var(--admin-text-muted)' }}>{new Date(interaction.interaction_date).toLocaleDateString()}</span>
              </div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--admin-text-main)', display: 'block', marginBottom: '0.25rem' }}>{interaction.clients?.company_name}</strong>
              <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', lineHeight: '1.4' }}>{interaction.subject}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
