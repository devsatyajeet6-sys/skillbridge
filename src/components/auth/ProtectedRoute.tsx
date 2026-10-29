import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
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
  const currentUser = dataService.getCurrentUser();

  // If no user is logged in, default to student demo persona
  if (!currentUser) {
    dataService.loginAsPersona('student');
  }

  // If a specific role is expected, seamlessly auto-activate that persona in the unified app
  useEffect(() => {
    if (allowedRoles && allowedRoles.length > 0 && currentUser) {
      if (!allowedRoles.includes(currentUser.role)) {
        dataService.loginAsPersona(allowedRoles[0]);
      }
    }
  }, [allowedRoles, currentUser]);

  return <>{children}</>;
};
