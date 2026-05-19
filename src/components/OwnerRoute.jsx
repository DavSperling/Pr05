import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// OwnerRoute is a wrapper around a route that verifies that the current user is the owner of the resource of access.
export default function OwnerRoute() {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (String(currentUser.id) !== String(userId)) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}
