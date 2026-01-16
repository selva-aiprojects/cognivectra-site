import { useParams, Link } from "react-router";
import { posts } from "../data/posts.js";

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <h1>Post not found</h1>
        <Link to="/blogPost">Back to Blog</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/blogPost">← Back</Link>
      <h1>{post.title}</h1>
      <small>{post.date}</small>
      <p style={{ whiteSpace: "pre-line" }}>{post.body}</p>
    </>
  );
}
