import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  role: string;
  children: React.ReactNode;
}

const PrivateRoute = ({ role, children }: PrivateRouteProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const userRole = localStorage.getItem('role')?.toLowerCase();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== role.toLowerCase()) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = {
      student: "/student",
      tutor: "/tutor",
      admin: "/admin"
    }[userRole || ""] || "/";

    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
