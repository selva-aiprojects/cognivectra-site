import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
        <div className="hero-bg-gradient"></div>

        <div className="hero-modern-inner">

          <div className="hero-copy">
            <span className="hero-badge">📝 Insights</span>

            <h1>
              Founder-Friendly <br />
              Technology Insights
            </h1>

            <p>
              Practical articles on cloud setup, automation, SaaS building blocks,
              and applied AI — written for founders building scalable startups.
            </p>

            <p>
              Learn how to design lean, reliable platforms and automate what slows
              you down — from day zero through Series B.
            </p>

            <div className="hero-cta">
              <Link to="/contact" className="btn">
                Talk to an Architect
              </Link>
              <Link to="/services" className="btn-outline">
                View Services
              </Link>
            </div>

            <p className="hero-subtext">
              Cloud · Automation · SaaS · AI · Startup Engineering
            </p>
          </div>

          {/* Visual Card */}
          <div className="hero-visual">
            <div className="hero-glass-card">
              <ul>
                <li>Cloud Architecture</li>
                <li>Automation Patterns</li>
                <li>SaaS Foundations</li>
                <li>AI in Operations</li>
                <li>Startup DevOps</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* LOADING STATE */}
      {loading && (
        <section className="services-modern">
          <div className="services-modern-grid">

            <div className="service-modern-card blog-loading">
              <div className="blog-loading-icon">⏳</div>
              <p>Loading insights…</p>
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
              <article key={post.slug} className="service-modern-card blog-card">

                <div className="blog-meta">
                  <span>📅</span>
                  {new Date(
                    post.published_at || post.created_at
                  ).toLocaleDateString()}
                </div>

                <h4 className="blog-title">{post.title}</h4>

                <p className="blog-excerpt">
                  {post.excerpt}
                </p>

                <div className="blog-cta">
                  <Link to={`/blog/${post.slug}`} className="btn-outline">
                    Read Article →
                  </Link>
                </div>

              </article>
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
        <Link to="/contact" className="btn">
          Talk to Us
        </Link>
      </section>

    </main>
  );
}
