import { useState } from 'react';
import { createPost } from '../services/api';
import './PostForm.css';

interface PostFormProps {
  categories: string[];
  onSuccess?: () => void;
}

export function PostForm({ categories, onSuccess }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0] || 'Jobs',
    location: '',
    contact: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createPost(formData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: categories[0] || 'Jobs',
        location: '',
        contact: '',
        email: '',
        phone: '',
      });

      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-container">
      <h2>Submit a New Post</h2>
      <p className="form-subtitle">Share your post with the community</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">✓ Post submitted successfully! It will appear after admin approval.</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Give your post a clear title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            ) : (
              <>
                <option value="Jobs">Jobs</option>
                <option value="Rentals">Rentals</option>
                <option value="Events">Events</option>
                <option value="Announcements">Announcements</option>
                <option value="Lost & Found">Lost & Found</option>
              </>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Provide detailed information about your post"
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Nairobi, Westlands"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact">Contact Person *</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+254 700 000 000"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Submitting...' : 'Submit Post'}
        </button>
      </form>
    </div>
  );
}
