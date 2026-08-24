import { Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = AuthProvider.useAuth();

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}