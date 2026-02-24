import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { supabase } from "../lib/supabase";
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
        <section className="services-modern">
          <h3>Latest Articles</h3>

          <div className="services-modern-grid">

            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article className="service-modern-card blog-card">
                  <div className="blog-meta">
                    <span>📅</span>
                    {new Date(
                      post.published_at || post.created_at
                    ).toLocaleDateString()}
                  </div>

                  <h4 className="blog-title" style={{ transition: 'color 0.2s' }}>{post.title}</h4>

                  <p className="blog-excerpt">
                    {post.excerpt}
                  </p>

                  <div className="blog-cta">
                    <span className="btn-outline" style={{ display: 'inline-flex', pointerEvents: 'none' }}>
                      Read Article →
                    </span>
                  </div>
                </article>
              </Link>
            ))}

          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {!loading && posts.length === 0 && (
        <section className="services-modern">
          <div className="service-modern-card blog-empty">

            <div className="blog-empty-icon">🚧</div>
            <h4>Coming Soon</h4>
            <p>
              Our blog is coming soon. Check back for founder-friendly insights
              on cloud infrastructure, automation, and SaaS development.
            </p>

            <div className="highlight-pill">
              Want updates? Subscribe to our newsletter.
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
