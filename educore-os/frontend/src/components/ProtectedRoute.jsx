import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole, isTokenExpired } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if token is expired
  if (isTokenExpired()) {
    // Clear expired token and redirect to login
    localStorage.clear();
    return <Navigate to="/login" state={{ from: location, expired: true }} replace />;
  }
  
  // Check if user has required role
  if (allowedRoles.length > 0) {
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
      // Redirect to unauthorized page or appropriate dashboard
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
