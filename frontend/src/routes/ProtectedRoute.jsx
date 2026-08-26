import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const {
    user,
    authLoading,
    checkAuth,
  } = AuthProvider.useAuth();

  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (user || hasCheckedRef.current) {
      return;
    }

    hasCheckedRef.current = true;
    checkAuth();
  }, [user, checkAuth]);

  // Only /app shows this loading state.
  // The landing page remains completely untouched.
  if (authLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#f8f9fb] dark:bg-[#0a0a0c]">
        <div
          className="
            h-8 w-8 animate-spin rounded-full
            border-2 border-[#ff7a18]/30
            border-t-[#ff7a18]
          "
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

