import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../services/api";

export default function ProtectedRoute({ children, role }) {
  const token = getToken();
  const user  = getUser();

  // No token → go to login
  if (!token || !user) return <Navigate to="/login" replace />;

  // Wrong role → go to login
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}
