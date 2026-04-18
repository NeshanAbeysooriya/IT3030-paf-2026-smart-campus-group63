import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  // 🔥 WAIT UNTIL ROLE IS AVAILABLE
  if (!role) return <div>Loading...</div>;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/home" />;
  }

  return children;
}
