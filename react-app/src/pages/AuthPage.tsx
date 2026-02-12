import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, registerUser } from '../services/api';
import './AuthPage.css';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // For admin login, use 'admin' as email
        const email = formData.email === 'admin' ? 'admin' : formData.email;
        await login(email, formData.password);
      } else {
        // Register new user
        await registerUser(formData.email, formData.password, formData.name);
      }

      // Navigate based on role or back to home
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>{isLogin ? 'Login' : 'Create Account'}</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email or Username</label>
              <input
                type={isLogin && formData.email === 'admin' ? 'text' : 'email'}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={isLogin ? "admin (for admin) or your@email.com" : "your@email.com"}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setFormData({ email: '', password: '', name: '' });
                  }}
                  className="toggle-btn"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setFormData({ email: '', password: '', name: '' });
                  }}
                  className="toggle-btn"
                >
                  Login here
                </button>
              </p>
            )}
          </div>

          {isLogin && (
            <div className="default-credentials">
              <p>
                <strong>Admin Demo:</strong><br />
                Email: <code>admin</code><br />
                Password: <code>admin123</code>
              </p>
            </div>
          )}
        </div>

        <div className="auth-info">
          <h2>Welcome to Local Noticeboard</h2>
          <p>Connect with your community. Browse and post jobs, rentals, events, and more.</p>
          <ul>
            <li>Free to use</li>
            <li>Local community focused</li>
            <li>Easy to post and manage</li>
            <li>Direct contact with posters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
