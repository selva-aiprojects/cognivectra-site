import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ReactMarkdown from 'react-markdown';

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
  }, [slug]);

  if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading...</div>;

  if (!post) {
    return (
      <div className="container" style={{ padding: '4rem' }}>
        <h1>Post not found</h1>
        <Link to="/blog">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/blog" style={{ textDecoration: 'none', color: "var(--text-secondary)" }}>← Back</Link>
        <h1 style={{ marginTop: '1rem' }}>{post.title}</h1>
        <small style={{ color: "var(--text-muted-dark)" }}>{new Date(post.published_at || post.created_at).toLocaleDateString()}</small>

        {post.image_url && (
          <img src={post.image_url} alt={post.title} style={{ width: '100%', borderRadius: '8px', margin: '2rem 0' }} />
        )}

        <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>
          <ReactMarkdown 
            components={{
              h1: ({node, ...props}) => <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
              h2: ({node, ...props}) => <h3 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }} {...props} />,
              p: ({node, ...props}) => <p style={{ marginBottom: '1rem' }} {...props} />,
              ul: ({node, ...props}) => <ul style={{ marginBottom: '1rem', marginLeft: '1.5rem' }} {...props} />,
              ol: ({node, ...props}) => <ol style={{ marginBottom: '1rem', marginLeft: '1.5rem' }} {...props} />,
              li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
              code: ({node, inline, ...props}) => inline ? 
                <code style={{ background: 'var(--bg-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }} {...props} /> :
                <code style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', display: 'block', overflow: 'auto', marginBottom: '1rem' }} {...props} />,
              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1rem', marginLeft: 0, marginBottom: '1rem', fontStyle: 'italic' }} {...props} />
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
