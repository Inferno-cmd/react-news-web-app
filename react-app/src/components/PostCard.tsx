import { Link } from 'react-router-dom';
import './PostCard.css';

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  createdAt: string;
}

export function PostCard({ post }: { post: Post }) {
  const date = new Date(post.createdAt);
  const dateString = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link to={`/post/${post._id}`} className="post-card">
      <div className="card-header">
        <span className={`badge badge-${post.category.toLowerCase()}`}>
          {post.category}
        </span>
        <span className="date">{dateString}</span>
      </div>
      <h3>{post.title}</h3>
      <p className="description">{post.description.substring(0, 150)}...</p>
      {post.location && <p className="location">📍 {post.location}</p>}
      <div className="card-footer">
        <span className="read-more">Read More →</span>
      </div>
    </Link>
  );
}
