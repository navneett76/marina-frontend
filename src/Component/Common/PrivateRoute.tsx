// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { usertoken, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other UI
  }

  if (!usertoken) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
