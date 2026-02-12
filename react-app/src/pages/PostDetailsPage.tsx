import { useEffect, useState } from 'react';
import { getPost } from '../services/api';
import { useParams, Link } from 'react-router-dom';
import './PostDetailsPage.css';

export function PostDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await getPost(id!);
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="not-found">Post not found</div>;
  }

  const date = new Date(post.createdAt);
  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="post-details-page">
      <div className="container">
        <Link to="/" className="back-link">← Back to Posts</Link>

        <article className="post-details">
          <header className="post-header">
            <span className={`badge badge-${post.category.toLowerCase()}`}>
              {post.category}
            </span>
            <span className="date">{dateString}</span>
          </header>

          <h1>{post.title}</h1>

          <div className="post-meta">
            {post.location && (
              <div className="meta-item">
                <span className="label">Location:</span>
                <span>{post.location}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="label">Contact:</span>
              <span>{post.contact}</span>
            </div>
          </div>

          <div className="post-content">
            <h2>Details</h2>
            <p>{post.description}</p>
          </div>

          <div className="post-contact-section">
            <h2>Get in Touch</h2>
            <div className="contact-methods">
              {post.phone && (
                <a href={`tel:${post.phone}`} className="contact-link phone-link">
                  Call: {post.phone}
                </a>
              )}
              {post.email && (
                <a href={`mailto:${post.email}`} className="contact-link email-link">
                  Email: {post.email}
                </a>
              )}
              {post.phone && (
                <a
                  href={`https://wa.me/${post.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link whatsapp-link"
                >
                  WhatsApp: {post.phone}
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
