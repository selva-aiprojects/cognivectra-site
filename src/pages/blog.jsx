import { Link } from "react-router-dom";  // ✅ Fixed import
import { posts } from "../data/posts.js";

export default function Blog() {
  return (
    <section className="section ai-neutral">
      <div className="container">
        {/* Hero Section */}
        <div className="card" style={{ 
          maxWidth: '800px', 
          margin: '0 auto 4rem auto',
          background: 'rgba(255, 255, 255, 0.97)',
          color: '#0f172a'
        }}>
          <h2>Latest Insights</h2>
          <p style={{color: '#334155'}}>
            Stay ahead with our latest articles on AI, Data Engineering, Cloud, and Digital Transformation.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid2">
          {posts.map((post) => (
            <article key={post.slug} className="card" style={{
              background: 'rgba(255, 255, 255, 0.97)',
              color: '#0f172a',
              transition: 'all 0.3s ease'
            }}>
              <div style={{marginBottom: '1.5rem'}}>
                <small style={{color: '#64748b', fontWeight: '500'}}>
                  {post.date}
                </small>
              </div>
              
              <h3>{post.title}</h3>
              
              <p style={{color: '#334155', lineHeight: '1.7', margin: '1rem 0 1.5rem'}}>
                {post.excerpt}
              </p>
              
              <Link 
                to={`/blog/${post.slug}`}
                style={{
                  display: 'inline-block',
                  color: '#1e40af',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: '0.5rem 0'
                }}
              >
                Read full article →
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        {posts.length === 0 && (
          <div className="card" style={{
            maxWidth: '600px',
            margin: '4rem auto 0',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.97)',
            color: '#0f172a'
          }}>
            <h3>No posts yet</h3>
            <p style={{color: '#64748b'}}>
              Our blog is coming soon. Check back for insights on AI, Data Engineering, and Digital Transformation.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
