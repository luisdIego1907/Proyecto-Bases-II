import { Navigate } from "react-router-dom";
import { isAuthenticated, getRoles } from "../auth/sessionAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({
  children,
  roles = [],
}: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const userRoles = getRoles();

    const hasPermission = roles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
