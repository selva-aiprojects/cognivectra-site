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
        <div className="card blog-hero">
          <h1>Latest Insights</h1>
          <p>
            Practical articles on cloud setup, process automation, SaaS building
            blocks, and applied AI—written for founders and teams building
            scalable startups.
          </p>
          <p>
            Explore how to design lean, reliable platforms and automate what
            slows you down, from day zero through Series B.
          </p>
        </div>

        {/* Loading State */}
        {loading && <div className="blog-loading">Loading insights...</div>}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.slug} className="card blog-post">
                <small className="blog-post-date">
                  {new Date(post.published_at || post.created_at).toLocaleDateString()}
                </small>

                <h2 class="blog-hero">{post.title}</h2>

                <p className="blog-post-excerpt">{post.excerpt}</p>

                <Link to={`/blog/${post.slug}`} className="blog-post-link">
                  Read full article →
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* CTA when no posts */}
        {!loading && posts.length === 0 && (
          <div className="card blog-empty">
            <h3>No posts yet</h3>
            <p>
              Our blog is coming soon. Check back for founder-friendly insights.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}