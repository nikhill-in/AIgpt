import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();
  // console.log("this is the user", user);

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}