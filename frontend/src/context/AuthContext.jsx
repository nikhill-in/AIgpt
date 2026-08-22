import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check existing authentication on app startup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);

    try {
      const res = await loginUser(email, password);

      setUser(res.data.user);

      return res.data.user;
    } catch (err) {
      setAuthError(
        err.response?.data?.message || "Login failed"
      );

      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  // Update user everywhere immediately without another API request
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        authLoading,
        authError,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);