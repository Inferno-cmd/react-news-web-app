import { Link, useNavigate } from 'react-router-dom';
import { adminLogout } from '../services/api';
import { LogoIcon } from './LogoIcon';
import './Header.css';

export function Header() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';
  const isLoggedIn = localStorage.getItem('authToken');

  const handleLogout = () => {
    adminLogout();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogoIcon />
            <h1></h1>
          </div>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/submit">Submit Post</Link>
          <Link to="/contact">Contact</Link>
          {isLoggedIn ? (
            <>
              {isAdmin && <Link to="/admin" className="admin-link">Admin</Link>}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/auth" className="login-link">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
