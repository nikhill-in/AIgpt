import { Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = AuthProvider.useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb] dark:bg-[#0a0a0c]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ff7a18]/30 border-t-[#ff7a18]" />
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
}