// routing/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("userToken");

  if (!token) {
    // remember where they were headed so you can send them back after login
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export { ProtectedRoute };