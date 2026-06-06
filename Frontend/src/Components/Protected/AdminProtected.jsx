import { Navigate } from "react-router-dom";

export default function AdminProtected({ children }) {
  const token = localStorage.getItem("token"); // Must match Login.jsx
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // If not logged in → GO TO LOGIN PAGE
  if (!token) return <Navigate to="/login" replace />;

  // Logged in but not admin → Home
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;

  // If admin → allow AdminLayout
  return children;
}
