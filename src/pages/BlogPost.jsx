import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { supabase } from "../lib/supabase";
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
        <meta property="twitter:title" content={`${post.title} | CogniVectra`} />
        <meta property="twitter:description" content={post.excerpt} />
      </Helmet>

      {/* HERO */}
      <section className="hero-modern" style={{ padding: '6rem 2rem 4rem' }}>
        <div className="hero-modern-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/blog" className="hero-badge" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span>←</span>
              Expert Insights
            </Link>
            <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', maxWidth: '900px', margin: '1.25rem auto 1.25rem 0' }}>{post.title}</h1>
            <div className="blog-meta" style={{ justifyContent: 'flex-start', fontSize: '1rem', opacity: 0.8 }}>
              <span>📅</span>
              {new Date(post.published_at || post.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="services-modern" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '900px', transform: 'translateY(-60px)', position: 'relative', zIndex: 10 }}>
          <motion.div
            className="glass-panel"
            style={{ padding: '4rem' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >

            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="hero-image-modern"
                style={{ width: '100%', borderRadius: '16px', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              />
            )}

            <div className="blog-post-content">
              {post.body && (post.body.includes('</') || post.body.includes('/>')) ? (
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              ) : (
                <ReactMarkdown>{post.body}</ReactMarkdown>
              )}
            </div>

            <div className="post-footer" style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Ready to implement these insights in your startup?</p>
              <div className="hero-cta" style={{ justifyContent: 'center' }}>
                <Link to="/contact" className="btn">Book Strategy Call</Link>
                <Link to="/#services" className="btn-outline">Our Services</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
