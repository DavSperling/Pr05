import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// ProtectedRoute Unlike OwnerRoute, ProtectedRoute only checks that the user is logged in, but doesn't check that they are the owner of any particular resource.
export default function ProtectedRoute() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}
