import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  role: string;
  children: React.ReactNode;
}

const PrivateRoute = ({ role, children }: PrivateRouteProps) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token") !== null;
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userRole || userRole.toLowerCase() !== role.toLowerCase()) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = {
      student: "/student",
      tutor: "/tutor",
      admin: "/admin"
    }[userRole?.toLowerCase() || ""] || "/login";

    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
