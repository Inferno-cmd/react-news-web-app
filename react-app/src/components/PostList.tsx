import { PostCard } from './PostCard';
import './PostList.css';

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
  loading: boolean;
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PostList({ posts, loading, total, currentPage, onPageChange }: PostListProps) {
  const postsPerPage = 10;
  const totalPages = Math.ceil(total / postsPerPage);

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div className="no-posts">No posts found. Be the first to post!</div>;
  }

  return (
    <div className="post-list-container">
      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
