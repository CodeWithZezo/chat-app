import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../zustand/auth";

const ProtectedRoute = () => {
  const { user, isAuthChecked } = useAuthStore();

  if (!isAuthChecked) return null; // ⛔ wait
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
