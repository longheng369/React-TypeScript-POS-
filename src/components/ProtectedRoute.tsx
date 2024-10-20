// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // If authenticated, render the protected route's content
};

export default ProtectedRoute;
