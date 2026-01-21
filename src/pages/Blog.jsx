import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  return (
    <section className="section ai-neutral">
      <div className="container">
        {/* Hero Section */}
        <div 
          className="card hero-card"
          style={{
            maxWidth: "1000px",
            margin: "0 auto 4rem",
            textAlign: "center",
            padding: "3rem 2.5rem"
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.8 }}>📝</div>
          <h1>Latest Insights</h1>
          <p className="stack" style={{ fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
            Practical articles on cloud setup, process automation, SaaS building
            blocks, and applied AI—written for founders and teams building
            scalable startups.
          </p>
          <p className="stack" style={{ fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}>
            Explore how to design lean, reliable platforms and automate what
            slows you down, from day zero through Series B.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div 
            className="card"
            style={{
              maxWidth: "600px",
              margin: "2rem auto",
              textAlign: "center",
              padding: "3rem"
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.6 }}>⏳</div>
            <p style={{ color: "var(--text-secondary)" }}>Loading insights...</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid2" style={{ gap: "2rem" }}>
            {posts.map((post) => (
              <article key={post.slug} className="card" style={{ padding: "2.5rem" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  marginBottom: "1rem",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>📅</span>
                  {new Date(post.published_at || post.created_at).toLocaleDateString()}
                </div>

                <h2 style={{ marginBottom: "1rem", lineHeight: "1.3" }}>{post.title}</h2>

                <p className="stack" style={{ 
                  color: "var(--text-secondary)", 
                  marginBottom: "1.5rem",
                  fontSize: "1rem"
                }}>
                  {post.excerpt}
                </p>

                <div style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  textAlign: "center",
                  marginTop: "auto"
                }}>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="btn"
                    style={{ textDecoration: "none" }}
                  >
                    Read full article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA when no posts */}
        {!loading && posts.length === 0 && (
          <div 
            className="card"
            style={{
              maxWidth: "700px",
              margin: "3rem auto",
              textAlign: "center",
              padding: "3rem"
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.8 }}>🚧</div>
            <h3 style={{ marginBottom: "1rem", color: "var(--accent-primary)" }}>Coming Soon</h3>
            <p className="stack" style={{ fontSize: "1.1rem" }}>
              Our blog is coming soon. Check back for founder-friendly insights on
              cloud infrastructure, automation, and SaaS development.
            </p>
            <div style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
              borderRadius: "12px",
              padding: "1.5rem",
              marginTop: "2rem"
            }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                <strong>Want to be notified?</strong> Subscribe to our newsletter for updates.
              </p>
            </div>
          </div>
        )}

        {/* Visual Break Section */}
        {!loading && (
          <div style={{ margin: "4rem auto", textAlign: "center" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(6, 182, 212, 0.02))",
              borderRadius: "20px",
              padding: "2.5rem",
              maxWidth: "800px",
              margin: "0 auto"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💡</div>
              <h3 style={{ color: "var(--accent-primary)", marginBottom: "1rem" }}>
                Founder-Friendly Content
              </h3>
              <p className="stack" style={{ maxWidth: "600px", margin: "0 auto" }}>
                Practical insights designed to help you build better technology foundations
                without getting lost in technical jargon
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}