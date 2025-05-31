import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  role: string;
  children: React.ReactNode;
}

const PrivateRoute = ({ role, children }: PrivateRouteProps) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token") !== null;
  const userRole = localStorage.getItem("role");

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but wrong role, redirect to appropriate dashboard
  if (userRole && userRole.toLowerCase() !== role.toLowerCase()) {
    const redirectPath = {
      student: "/student",
      tutor: "/tutor",
      admin: "/admin"
    }[userRole.toLowerCase()];

    if (redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  // If authenticated and correct role, render children
  return <>{children}</>;
};

export default PrivateRoute;
