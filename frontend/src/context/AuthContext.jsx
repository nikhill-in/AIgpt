import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until initial check completes
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null)) // no valid cookie — stay logged out, not an error to show
      .finally(() => setAuthLoading(false));
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await loginUser(email, password);
      setUser(res.data.user);
    } catch (err) {
      setAuthError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, logout, authLoading, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);