import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isActive = localStorage.getItem("active") === "true";

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Blocked user
  if (!isActive) {
    return <Navigate to="/login" />;
  }

  // ❌ Role restriction
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/home" />;
  }

  return children;
}