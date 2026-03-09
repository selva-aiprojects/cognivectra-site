import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { supabase } from "../lib/supabase";
import { FaCalendarAlt, FaClock, FaUser, FaArrowLeft, FaShareAlt, FaFacebook } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import blogHero from "../assets/hero-automation-new.png";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error) setPost(data);
      setLoading(false);
    }
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <main>
        <section className="hero-modern" style={{ minHeight: '60vh' }}>
          <div className="hero-modern-inner">
            <h1 className="blog-title">Loading insight...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main>
        <section className="hero-modern" style={{ minHeight: '60vh' }}>
          <div className="hero-modern-inner">
            <h1 className="blog-title">Insight Not Found</h1>
            <div className="hero-cta" style={{ marginTop: '2rem' }}>
              <Link to="/blog" className="btn-outline">← Back to Insights</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Helmet>
        <title>{post.title} | CogniVectra Insights</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | CogniVectra`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image_url || 'https://cognivectra.com/hero-automation.png'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta property="twitter:title" content={`${post.title} | CogniVectra`} />
        <meta property="twitter:description" content={post.excerpt} />
      </Helmet>

      {/* HERO / HEADER */}
      <section className="hero-modern" style={{ padding: '8rem 2rem 6rem', background: 'radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(2, 6, 23, 1) 50%)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
              <Link to="/blog" className="btn-outline" style={{
                padding: '0.6rem 1.2rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.03)'
              }}>
                <FaArrowLeft /> Back to Insights
              </Link>
              <span className="hero-badge" style={{ margin: 0 }}>Strategic Publication</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.04em',
              marginBottom: '2.5rem',
              color: '#fff'
            }}>
              {post.title}
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.95rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaUser style={{ color: 'var(--accent-light)' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#fff' }}>Technical Architecture Team</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>CogniVectra Innovations</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt style={{ color: 'var(--accent-light)' }} />
                {new Date(post.published_at || post.created_at).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaClock style={{ color: 'var(--accent-light)' }} />
                {Math.ceil((post.body?.length || 500) / 1000) + 2} min read
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '600' }}
                >
                  <FaFacebook /> Share
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: post.title, url: window.location.href });
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '600' }}
                >
                  <FaShareAlt /> Share Insight
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section style={{ padding: '0 2rem 8rem', marginTop: '-4rem' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <motion.div
            className="glass-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              padding: 'clamp(2rem, 8vw, 5rem)',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '32px'
            }}
          >
            {post.image_url && (
              <div style={{ marginBottom: '4rem', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                <img
                  src={post.image_url}
                  alt={post.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )}

            <div className="blog-post-content premium-article" style={{
              fontSize: '1.2rem',
              lineHeight: '1.8',
              color: 'var(--text-secondary)'
            }}>
              {post.body && (post.body.includes('</') || post.body.includes('/>')) ? (
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              ) : (
                <ReactMarkdown>{post.body}</ReactMarkdown>
              )}
            </div>

            <div className="post-footer" style={{
              marginTop: '6rem',
              paddingTop: '4rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span className="hero-badge" style={{ marginBottom: '1.5rem' }}>Engagement</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>Deploy These Strategies</h3>
              <p style={{ maxWidth: '600px', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                Every startup journey is unique. Let's discuss how these technical foundations apply to your specific product roadmap.
              </p>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <Link to="/contact" className="btn" style={{ padding: '1rem 2.5rem' }}>Discuss Architecture</Link>
                <Link to="/blog" className="btn-outline" style={{ padding: '1rem 2.5rem' }}>Explore More Insights</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
