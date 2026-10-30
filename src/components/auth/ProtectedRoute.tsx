import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const location = useLocation();
  const currentUser = dataService.getCurrentUser();

  // If not logged in, redirect to login page instead of forcing a demo persona
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is restricted and user does not match, redirect to unified dashboard
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role) && currentUser.role !== 'admin') {
    return <Navigate to={`/dashboard?role=${currentUser.role}`} replace />;
  }

  return <>{children}</>;
};
