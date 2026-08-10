// auth/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from './useAuthContext'; // adjust path to match your structure

const RequireAuth = () => {
  const location = useLocation();
  const { auth } = useAuthContext();

  if (!auth?.token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export { RequireAuth };