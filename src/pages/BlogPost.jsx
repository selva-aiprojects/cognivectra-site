import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';

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
      <Helmet>
        <title>{post.title} | CogniVectra Insights</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | CogniVectra`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image_url || 'https://cognivectra.com/og-image.png'} />
        <meta property="twitter:title" content={`${post.title} | CogniVectra`} />
        <meta property="twitter:description" content={post.excerpt} />
        <meta property="twitter:image" content={post.image_url || 'https://cognivectra.com/og-image.png'} />
      </Helmet>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/blog" style={{ textDecoration: 'none', color: "var(--text-secondary)" }}>← Back</Link>
        <h1 style={{ marginTop: '1rem' }}>{post.title}</h1>
        <small style={{ color: "var(--text-muted-dark)" }}>{new Date(post.published_at || post.created_at).toLocaleDateString()}</small>

        {post.image_url && (
          <img src={post.image_url} alt={post.title} style={{ width: '100%', borderRadius: '8px', margin: '2rem 0' }} />
        )}

        <div
          className="blog-post-content"
          style={{ marginTop: '2rem', lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
    </section>
  );
}
