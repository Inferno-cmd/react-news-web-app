import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, getCategories } from '../services/api';
import { PostList } from '../components/PostList';
import { CategoryMenu } from '../components/CategoryMenu';
import './HomePage.css';

export function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ jobs: 0, rentals: 0, events: 0 });

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, page]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts(selectedCategory, page);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const jobsData = await getPosts('Jobs', 1, 1);
      const rentalsData = await getPosts('Rentals', 1, 1);
      const eventsData = await getPosts('Events', 1, 1);
      setStats({
        jobs: jobsData.total || 0,
        rentals: rentalsData.total || 0,
        events: eventsData.total || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Local Digital Noticeboard</h1>
        <p>Your community hub for jobs, rentals, events, and more</p>
        <div className="hero-buttons">
          <Link to="/submit" className="cta-button primary">
            🚀 Post an Ad
          </Link>
          <Link to="/auth" className="cta-button secondary">
            👤 Login / Sign Up
          </Link>
        </div>
      </div>

      <div className="container">
        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.jobs}+</div>
            <div className="stat-label">Jobs Available</div>
            <p>Find great employment opportunities</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.rentals}+</div>
            <div className="stat-label">Rentals Listed</div>
            <p>Discover your next home</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.events}+</div>
            <div className="stat-label">Events Happening</div>
            <p>Join community activities</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">1</div>
              <h3>Browse Posts</h3>
              <p>Explore jobs, rentals, events, and more from your community</p>
            </div>
            <div className="step">
              <div className="step-icon">2</div>
              <h3>Post Your Ad</h3>
              <p>Create and share your post for free in minutes</p>
            </div>
            <div className="step">
              <div className="step-icon">3</div>
              <h3>Connect Directly</h3>
              <p>Contact posters via phone, email, or WhatsApp</p>
            </div>
            <div className="step">
              <div className="step-icon">4</div>
              <h3>Get Results</h3>
              <p>Find what you're looking for in your local community</p>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="featured-categories">
          <h2>Browse by Category</h2>
          <CategoryMenu
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Latest Posts */}
        <div className="latest-posts-section">
          <h2>
            {selectedCategory === 'all' ? 'Latest Posts' : `Latest ${selectedCategory} Posts`}
          </h2>
          <PostList
            posts={posts}
            loading={loading}
            total={total}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>

        {/* Features */}
        <div className="features-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>100% Free</h3>
              <p>Post and browse listings completely free</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Safe & Secure</h3>
              <p>Your data is protected and private</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Quick & Easy</h3>
              <p>Post in minutes, get results instantly</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Community Focused</h3>
              <p>Connect with people in your local area</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Mobile Friendly</h3>
              <p>Access from any device, anywhere</p>
            </div>
            <div className="feature">
              <div className="feature-icon"></div>
              <h3>Direct Contact</h3>
              <p>Message via phone, email, or WhatsApp</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of people buying, selling, and connecting in our community</p>
          <Link to="/submit" className="cta-button large">
            Post Your First Ad Now
          </Link>
        </div>
      </div>
    </div>
  );
}
