import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface PrivateRouteProps {
  role: string;
  children: ReactNode;
}

const PrivateRoute = ({ role, children }: PrivateRouteProps) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || userRole.toLowerCase() !== role) {
    if (userRole === "student") return <Navigate to="/student" replace />;
    if (userRole === "tutor") return <Navigate to="/tutor" replace />;
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
