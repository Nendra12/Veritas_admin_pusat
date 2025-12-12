// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('admin_pusat_logged_in') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/admin/pusat" replace />;
  }

  return children;
};

export default ProtectedRoute;
