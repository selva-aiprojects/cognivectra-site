import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { Helmet } from "react-helmet-async";
import blogHero from "../assets/generated/hero-blog-8k.png";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <main>
      <Helmet>
        <title>Founder-Friendly Technology Insights | Cognivectra Blog</title>
        <meta name="description" content="Practical articles on cloud setup, automation, SaaS building blocks, and applied AI — written for founders building scalable startups." />
        <meta name="keywords" content="Cloud Architecture, AI Automation, SaaS Development, Startup Engineering, Cognivectra Insights" />
        <meta property="og:title" content="Founder-Friendly Technology Insights | Cognivectra Blog" />
        <meta property="og:description" content="Technical deep-dives and industry perspectives for startup founders." />
        <meta property="og:url" content="https://cognivectra.com/blog" />
      </Helmet>

      {/* HERO */}
      <section className="hero-modern">
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">📝 Insights</span>

            <h1>
              Founder-Friendly <br />
              Technology Insights
            </h1>

            <p>
              Practical articles on cloud setup, automation, SaaS building blocks,
              and applied AI — written for founders building scalable startups.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Talk to an Architect
              </Link>
              <Link to="/#services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext" style={{ marginTop: "2rem", opacity: 0.6 }}>
              Cloud · Automation · SaaS · AI · Startup Engineering
            </p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="industry-visual glass-panel">
              <img src={blogHero} alt="Blog & Insights" className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOADING STATE */}
      {loading && (
        <section className="services-modern">
          <div className="services-modern-grid">
            <div className="loading-card">
              <FaSpinner className="loading-card-icon spin" />
              <p className="loading-card-text">Loading insights...</p>
            </div>
          </div>
        </section>
      )}

      {/* POSTS GRID */}
      {!loading && posts.length > 0 && (
        <section className="services-modern" style={{ paddingTop: '0' }}>
          <div className="container">
            {/* FEATURED POST */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ marginBottom: '5rem', marginTop: '-4rem', position: 'relative', zIndex: 10 }}
            >
              <Link to={`/blog/${posts[0].slug}`} className="glass-panel" style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '0',
                overflow: 'hidden',
                minHeight: '400px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '24px'
              }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={posts[0].image_url || blogHero}
                    alt={posts[0].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                    <span className="hero-badge" style={{ background: 'var(--accent-primary)', color: 'white' }}>Featured Insight</span>
                  </div>
                </div>
                <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaCalendarAlt style={{ color: 'var(--accent-light)' }} /> {new Date(posts[0].published_at || posts[0].created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaClock style={{ color: 'var(--accent-light)' }} /> {Math.ceil((posts[0].body?.length || 500) / 1000) + 2} min read</span>
                  </div>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem', letterSpacing: '-0.03em', color: '#fff' }}>{posts[0].title}</h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>{posts[0].excerpt}</p>
                  <div className="btn" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Read Full Article <FaArrowRight style={{ fontSize: '0.8rem' }} />
                  </div>
                </div>
              </Link>
            </motion.div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
              <div>
                <span className="hero-badge" style={{ marginBottom: '1rem' }}>Latest Publications</span>
                <h3 style={{ margin: 0 }}>Fresh Perspectives</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.95rem' }}>
                Technical deep-dives and strategic frameworks for enterprise scaling and AI integration.
              </p>
            </div>

            <div className="services-modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
              {posts.slice(1).map((post, idx) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="service-modern-card glass-panel" style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    transition: 'all 0.4s ease'
                  }}>
                    <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={post.image_url || blogHero}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                        <span style={{
                          background: 'rgba(15, 23, 42, 0.8)',
                          backdropFilter: 'blur(8px)',
                          color: '#fff',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          INSIGHT
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaCalendarAlt /> {new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaClock /> {Math.ceil((post.body?.length || 500) / 1000) + 1} min read</span>
                      </div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.3', color: '#fff' }}>{post.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem', flex: 1, lineHeight: '1.6' }}>{post.excerpt}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-light)', fontWeight: '700', fontSize: '0.9rem' }}>
                        Read Insight <FaArrowRight style={{ fontSize: '0.7rem' }} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {!loading && posts.length === 0 && (
        <section className="services-modern">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 3rem', background: 'rgba(255, 255, 255, 0.02)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '2rem', opacity: 0.5 }}>🏗️</div>
              <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>Knowledge Foundation Loading</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '1rem auto 3rem' }}>
                We are currently crafting technical deep-dives on applied AI and SaaS engineering.
                Subscribe to be the first to know when we publish.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <input
                  type="email"
                  placeholder="name@company.com"
                  style={{
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    maxWidth: '300px',
                    width: '100%'
                  }}
                />
                <button className="btn">Notify Me</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VALUE BREAK */}
      {!loading && (
        <section className="why-modern">
          <div className="why-modern-inner">
            <h3>Founder-Friendly Content</h3>

            <div className="why-modern-grid">
              <div className="why-pill">No fluff, only execution</div>
              <div className="why-pill">Real startup examples</div>
              <div className="why-pill">Architecture best practices</div>
              <div className="why-pill">Automation blueprints</div>
              <div className="why-pill">Cost-aware engineering</div>
              <div className="why-pill">AI without hype</div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-modern">
        <h3>Want Similar Results for Your Startup?</h3>
        <p>
          Share your current platform challenges and we’ll suggest
          the smallest useful starting point.
        </p>
        <Link to="/#services" className="btn">
          Explore Our Services
        </Link>
      </section>

    </main>
  );
}
