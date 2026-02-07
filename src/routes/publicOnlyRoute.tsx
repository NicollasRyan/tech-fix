import React from "react";
import { Navigate } from "react-router-dom";

function PublicOnlyRoute({ children, isAuthenticated }: { 
    children: React.ReactNode; 
    isAuthenticated: boolean;
  }) {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  export default PublicOnlyRoute;