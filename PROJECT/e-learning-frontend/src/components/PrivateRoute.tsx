import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  role: string;
}

const PrivateRoute = ({ role }: PrivateRouteProps) => {
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

  return <Outlet />; // 👈 Important: Render nested routes
};

export default PrivateRoute;
