import { useState, useEffect } from 'react';
import { getAdminPosts, updatePostStatus, deletePost, editPost } from '../services/api';
import './AdminDashboard.css';

export function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState<'pending' | 'approved' | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    fetchPosts();
  }, [status, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAdminPosts((status as string | null) || undefined, page);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updatePostStatus(id, 'approved');
      fetchPosts();
    } catch (error) {
      console.error('Failed to approve post:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updatePostStatus(id, 'rejected');
      fetchPosts();
    } catch (error) {
      console.error('Failed to reject post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        fetchPosts();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleEdit = (post: any) => {
    setEditingId(post._id);
    setEditData({ ...post });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await editPost(id, editData);
      setEditingId(null);
      fetchPosts();
    } catch (error) {
      console.error('Failed to edit post:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-filters">
        <button
          className={`filter-btn ${!status ? 'active' : ''}`}
          onClick={() => {
            setStatus(null);
            setPage(1);
          }}
        >
          All Posts ({total})
        </button>
        <button
          className={`filter-btn ${status === 'pending' ? 'active' : ''}`}
          onClick={() => {
            setStatus('pending');
            setPage(1);
          }}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${status === 'approved' ? 'active' : ''}`}
          onClick={() => {
            setStatus('approved');
            setPage(1);
          }}
        >
          Approved
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="no-posts">No posts found</div>
      ) : (
        <div className="posts-table">
          {posts.map((post: any) => (
            <div key={post._id} className="post-row">
              {editingId === post._id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Title"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Description"
                    rows={3}
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleSaveEdit(post._id)} className="save-btn">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="post-details">
                    <h3>{post.title}</h3>
                    <p className="category-badge">{post.category}</p>
                    <p className="description">{post.description.substring(0, 100)}...</p>
                    <p className="meta">
                      {post.contact} • {post.phone || ''} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="post-status">
                    <span className={`status-badge status-${post.status}`}>{post.status}</span>
                  </div>
                  <div className="post-actions">
                    {post.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(post._id)} className="approve-btn">
                          Approve
                        </button>
                        <button onClick={() => handleReject(post._id)} className="reject-btn">
                          Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => handleEdit(post)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            ← Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
