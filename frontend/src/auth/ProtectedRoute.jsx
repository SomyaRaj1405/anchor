import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="access-denied">
        <div className="access-denied-card">
          <p className="access-denied-kicker">Access needed</p>
          <h1>You don’t have access to this page</h1>
          <p>
            This account is set for a different role, so the page you tried to open is not available.
          </p>
          <a href="/" className="text-link">
            Return to your dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
