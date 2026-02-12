import { Navigate } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';

export function AdminPage() {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (!token || userRole !== 'admin') {
    return <Navigate to="/auth" />;
  }

  return <AdminDashboard />;
}
