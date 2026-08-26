
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  logoutUser,
  getCurrentUser,
  getTokenOptions,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [isPro, setIsPro] = useState(false);

  // This is NOT app-startup loading anymore.
  // It is only true while we explicitly check/refresh authentication.
  const [authLoading, setAuthLoading] = useState(false);

  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();

  // --------------------------------------------------
  // Clear auth state when a protected API returns 401
  // --------------------------------------------------

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setTokenOptions([]);
      setIsPro(false);
      setAuthError(null);

      navigate("/", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized,
      );
    };
  }, [navigate]);

  // --------------------------------------------------
  // Check authentication explicitly
  // --------------------------------------------------

  const checkAuth = async () => {
    setAuthError(null);
    setAuthLoading(true);

    try {
      // Run both requests together instead of one after another.
      const [userRes, tokenRes] = await Promise.all([
        getCurrentUser(),
        getTokenOptions(),
      ]);

      const currentUser = userRes.data.user;
      const options = tokenRes.data.options ?? [];
      const pro = !!tokenRes.data.isPro;

      setUser(currentUser);
      setTokenOptions(options);
      setIsPro(pro);

      return {
        user: currentUser,
        options,
        isPro: pro,
      };
    } catch (error) {
      setUser(null);
      setTokenOptions([]);
      setIsPro(false);

      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // --------------------------------------------------
  // Refresh authenticated user data
  // Used after login / pro upgrade / other auth updates
  // --------------------------------------------------

  const refreshAuth = async () => {
    return checkAuth();
  };

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  const login = async (email, password) => {
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await loginUser(email, password);

      const loggedInUser = res.data.user;

      setUser(loggedInUser);

      // Load token permissions after successful login.
      const tokenRes = await getTokenOptions();

      const options = tokenRes.data.options ?? [];
      const pro = !!tokenRes.data.isPro;

      setTokenOptions(options);
      setIsPro(pro);

      return loggedInUser;
    } catch (err) {
      setAuthError(
        err?.response?.data?.message || "Login failed",
      );

      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      setTokenOptions([]);
      setIsPro(false);
      setAuthError(null);

      navigate("/", { replace: true });
    }
  };

  // --------------------------------------------------
  // Local user update
  // --------------------------------------------------

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isPro,
        tokenOptions,
        authLoading,
        authError,

        login,
        logout,

        checkAuth,
        refreshAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "AuthProvider.useAuth() must be used inside AuthProvider",
    );
  }

  return context;
};

