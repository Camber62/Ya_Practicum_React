import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { selectIsAuthenticated } from '../../features/authSlice';

interface ProtectedRouteElementProps {
  component: React.ReactElement;
  onlyUnAuth?: boolean;
}

export const OnlyAuth: React.FC<ProtectedRouteElementProps> = ({ component }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return component;
};

export const OnlyUnAuth: React.FC<ProtectedRouteElementProps> = ({ component }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return component;
};