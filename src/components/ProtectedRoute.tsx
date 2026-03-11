import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getAuthData } from "../utils/authStorage";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = getAuthData();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
