import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirect to correct login page based on role
    let loginPath = '/login';
    if (allowedRoles.includes('admin')) loginPath = '/adminlogin';
    else if (allowedRoles.includes('teacher')) loginPath = '/teacherlogin';
    else if (allowedRoles.includes('student')) loginPath = '/studentlogin';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;