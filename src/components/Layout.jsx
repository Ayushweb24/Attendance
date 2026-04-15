import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Loader from './Loader';
import { getAllowedPaths, getDefaultRoute, normalizeRole } from '../config/rbac';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/students': 'Student Management',
  '/attendance': 'Attendance',
  '/reports': 'Reports',
  '/leave': 'Leave Management',
  '/profile': 'My Profile',
};

export default function Layout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;

  const role = normalizeRole(user?.role);
  const allowedPaths = getAllowedPaths(role);
  if (!allowedPaths.includes(location.pathname)) {
    return <Navigate to={getDefaultRoute(role)} replace />;
  }

  const title = PAGE_TITLES[location.pathname] ?? 'Attendance System';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
