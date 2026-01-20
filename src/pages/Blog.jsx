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
          className="card"
          style={{
            maxWidth: "800px",
            margin: "0 auto 4rem auto",
            background: "rgba(255, 255, 255, 0.97)",
            color: "var(--text-primary)",
          }}
        >
          <h1>Latest Insights</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Practical articles on cloud setup, process automation, SaaS building
            blocks, and applied AI—written for founders and teams building
            scalable startups.
          </p>
          <p
            style={{
              color: "var(--text-muted-dark)",
              fontSize: "0.95rem",
            }}
          >
            Explore how to design lean, reliable platforms and automate what
            slows you down, from day zero through Series B.
          </p>
        </div>

        {/* Loading State */}
        {loading && <div style={{ textAlign: 'center' }}>Loading insights...</div>}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="grid2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="card"
                style={{
                  background: "rgba(255, 255, 255, 0.97)",
                  color: "var(--text-primary)",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ marginBottom: "1.5rem" }}>
                  <small
                    style={{ color: "var(--text-muted-dark)", fontWeight: "500" }}
                  >
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </small>
                </div>

                <h2>{post.title}</h2>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: "1.7",
                    margin: "1rem 0 1.5rem",
                  }}
                >
                  {post.excerpt}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                  style={{
                    display: "inline-block",
                    color: "var(--accent-primary)",
                    fontWeight: "600",
                    textDecoration: "none",
                    padding: "0.5rem 0",
                  }}
                >
                  Read full article →
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* CTA when no posts */}
        {!loading && posts.length === 0 && (
          <div
            className="card"
            style={{
              maxWidth: "600px",
              margin: "4rem auto 0",
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.97)",
              color: "var(--text-primary)",
            }}
          >
            <h3>No posts yet</h3>
            <p style={{ color: "var(--text-muted-dark)" }}>
              Our blog is coming soon. Check back for founder-friendly insights.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
